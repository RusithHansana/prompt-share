import React from 'react';

const FeedSuspense = () => (
    <div className="mt-10 prompt_layout">
        {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg p-4 w-80 h-60 animate-pulse mb-4"></div>
        ))}
    </div>
);

export default FeedSuspense;