"use client";

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import Profile from '@components/Profile';
import ProfileSuspense from '@components/ProfileSuspens';

const UserProfile = ({ params }) => {
    const [posts, setPosts] = useState([]);
    const [username, setUsername] = useState(null);

    const { data: session } = useSession();

    const router = useRouter();

    useEffect(() => {
        if (session?.user.id === params.id) {
            router.push('/profile');
        }

        const fetchPosts = async () => {
            const response = await fetch(`/api/users/${params.id}/posts`);
            const data = await response.json();
            setPosts(data);
            setUsername(data[0]?.creator.username);
        }

        fetchPosts();
    }, [])



    return (
        username ? (
            <Profile
                name={`${username}'s`}
                desc="Welcome to your profile"
                data={posts}
            />
        ) : (
            <ProfileSuspense />
        )
    )
}
export default UserProfile;