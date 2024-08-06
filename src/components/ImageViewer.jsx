import React from 'react';
import { useLocation } from 'react-router-dom';

export function ImageViewer() {
    const location = useLocation();
    const imageUrl = decodeURIComponent(location.pathname.replace('/og/', ''));
    console.log({imageUrl});

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <img src={imageUrl} alt="Generated OG" className="border rounded shadow-md max-w-full h-auto" />
        </div>
    );
}
