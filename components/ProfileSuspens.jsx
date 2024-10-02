import React from 'react';

const ProfileSuspense = () => (
    <section className="w-full">
        <div className="desc text-left h-10 w-96 bg-gray-200 rounded animate-pulse mt-2"></div>
        <div className="desc text-left h-5 w-80 bg-gray-200 rounded animate-pulse mt-2"></div>
        <div className="mt-10 prompt_layout">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg p-4 w-full h-60 animate-pulse mb-4"></div>
            ))}
        </div>
    </section>
);

export default ProfileSuspense;