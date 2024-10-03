"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PromptCard from './PromptCard';
import FeedSuspense from './FeedSuspense';

// Memoize PromptCardList to prevent unnecessary re-renders
const PromptCardList = React.memo(({ data, handleTagClick }) => {
    return (
        <div className="mt-16 prompt_layout">
            {data.map((prompt) => (
                <PromptCard
                    key={prompt._id} // Use a unique key instead of index
                    post={prompt}
                    handleTagClick={handleTagClick}
                />
            ))}
        </div>
    );
});

const Feed = () => {
    const [searchText, setSearchText] = useState("");
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    // Use useCallback to memoize the fetchPosts function
    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/prompt?page=${page}&limit=6`);
            const newPosts = await response.json();

            if (newPosts.length === 0) {
                setHasMore(false);
            } else {
                setPosts(prevPosts => {
                    const uniquePosts = newPosts.filter(newPost =>
                        !prevPosts.some(existingPost => existingPost._id === newPost._id)
                    );
                    return [...prevPosts, ...uniquePosts];
                });
                setPage(prevPage => prevPage + 1);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Use useCallback to memoize the handleScroll function
    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100 // Add a buffer of 100px
            && hasMore && !isLoading
        ) {
            fetchPosts();
        }
    }, [hasMore, isLoading, fetchPosts]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Use useCallback to memoize the handleSearchChange function
    const handleSearchChange = useCallback((e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchText(searchValue);
    }, []);

    // Use useCallback to memoize the handleTagClick function
    const handleTagClick = useCallback((tag) => {
        setSearchText(tag);
    }, [setSearchText]);

    // Use useMemo to compute filteredPosts
    const filteredPosts = useMemo(() => {
        if (searchText === "") return posts;
        return posts.filter(post => {
            return post.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase())) ||
                post.creator.username.toLowerCase().includes(searchText.toLowerCase())
        });
    }, [posts, searchText]);

    return (
        <section className="feed">
            <form className="relative w-full flex-center">
                <input
                    type="text"
                    placeholder="Search for tags, or users"
                    value={searchText}
                    onChange={handleSearchChange}
                    className="search_input peer"
                />
            </form>

            {isLoading && posts.length === 0 ? (
                <FeedSuspense />
            ) : (
                <PromptCardList
                    data={filteredPosts}
                    handleTagClick={handleTagClick}
                />
            )}
        </section>
    )
}

export default Feed;