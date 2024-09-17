"use client";

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Form from '@components/Form';

const EditPrompt = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [post, setPost] = useState({
        prompt: "",
        tag: "",
    });

    const searchParams = useSearchParams();

    const promptId = searchParams.get("id");

    const router = useRouter();

    const editPrompt = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        if (!promptId) return alert("Prompt not found");

        try {
            const response = await fetch(`/api/prompt/${promptId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        prompt: post.prompt,
                        tag: post.tag,
                    }),
                });

            if (response.ok) {
                router.push("/");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        const getPromptDetails = async () => {
            const response = await fetch(`/api/prompt/${promptId}`);
            const data = await response.json();

            setPost({
                prompt: data.prompt,
                tag: data.tag,
            });
        }

        if (promptId)
            getPromptDetails();
    }, [promptId])

    return (
        <Form
            type="Edit"
            post={post}
            setPost={setPost}
            isSubmitting={isSubmitting}
            handleSubmit={editPrompt}
        />
    )
}

export default EditPrompt;