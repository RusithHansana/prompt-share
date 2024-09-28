"use client";
import { useState, useEffect, useCallback } from 'react';
import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
    return (
        <div className="mt-16 prompt_layout">
            {data.map((prompt, index) => (
                <PromptCard
                    key={index}
                    post={prompt}
                    handleTagClick={handleTagClick}
                />
            ))}
        </div>
    );
}

const Feed = () => {
    const [searchText, setSearchText] = useState("");
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = useCallback(async () => {
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
    }, [page]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleScroll = () => {
        if (
            (window.innerHeight + document.documentElement.scrollTop ===
                document.documentElement.offsetHeight)
            && hasMore)
            fetchPosts();


    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    const handleSearchChange = (e) => {
        e.preventDefault();
        setSearchText(e.target.value);
    }

    return (
        <section className="feed">
            <form className="relative w-full flex-center">
                <input
                    type="text"
                    placeholder="Search for user or tags"
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                    className="search_input peer"
                />
            </form>

            <PromptCardList
                data={posts}
                handleTagClick={() => { }}
            />
        </section>
    )
}

export default Feed;