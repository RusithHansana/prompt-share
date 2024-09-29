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
    const [filteredPosts, setFilteredPosts] = useState([]);
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
        const searchValue = e.target.value.toLowerCase();
        setSearchText(searchValue);

        if (searchValue !== "") {
            const filtered = posts.filter(post => {
                return (
                    post.tag.toLowerCase().includes(searchValue) ||
                    post.creator.username.toLowerCase().includes(searchValue)
                );
            });

            setFilteredPosts(filtered);
        } else {
            setFilteredPosts([]);
        }
    }

    const handleTagClick = (tag) => {
        setSearchText(tag);
        const filtered = posts.filter(post => post.tag.toLowerCase() === tag.toLowerCase());
        setFilteredPosts(filtered);
    }

    return (
        <section className="feed">
            <form className="relative w-full flex-center">
                <input
                    type="text"
                    placeholder="Search for tags, or users"
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                    className="search_input peer"
                />
            </form>

            <PromptCardList
                data={filteredPosts.length > 0 ? filteredPosts : posts}
                handleTagClick={handleTagClick}
            />
        </section>
    )
}

export default Feed;