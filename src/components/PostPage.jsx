import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import icon from '../assets/react.svg';
import './PostPage.css';
import { Notification } from './Notification';

export function PostPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [ogImageUrl, setOgImageUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isImageVisible, setIsImageVisible] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const postRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    // Function to generate OG image
    const generateOGImage = async () => {
        if (!title && !content && !image) {
            triggerNotification("Please fill in all fields before generating the image.", "error");
            return;
        }
        setIsGenerating(true);
        triggerNotification("Generating OG Image...", "info");
        try {
            const canvas = await html2canvas(postRef.current, {
                scale: 2,
                useCORS: true,
                logging: true,
                windowWidth: 1200,
                windowHeight: 630
            });
            const dataUrl = canvas.toDataURL('image/png');
            setOgImageUrl(dataUrl);
            setIsImageVisible(true);
            triggerNotification("OG Image generated successfully.", "success");

            // Update the OG meta tag with the generated image URL
            updateMetaTag(dataUrl);

        } catch (error) {
            console.error('Failed to generate OG image:', error);
            triggerNotification("Failed to generate OG image.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    // Function to update or create the og:image meta tag
    const updateMetaTag = (imageUrl) => {
        let metaTag = document.querySelector('meta[property="og:image"]');
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute('property', 'og:image');
            document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', imageUrl);
    };

    // Function to trigger notifications
    const triggerNotification = (message, type) => {
        setNotification({ message, type, show: true });
        setTimeout(() => {
            setNotification({ ...notification, show: false });
        }, 3000);
    };

    // Function to download the generated image
    const downloadImage = () => {
        if (ogImageUrl) {
            const link = document.createElement('a');
            link.href = ogImageUrl;
            link.download = 'og-image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            triggerNotification("Image downloaded successfully", "success");
        }
    };

    // Function to view the generated image in a new tab
    const viewImage = () => {
        if (ogImageUrl) {
            window.open(ogImageUrl, '_blank');
        }
    };

    return (
        <div className="p-4 h-full">
            <h1 className="text-3xl font-bold mb-4 text-center">Create a Post</h1>
            {notification.show && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ ...notification, show: false })}
                />
            )}
            <div className="flex flex-wrap justify-between -mx-2 space-y-4 md:space-y-0 md:space-x-4">
                {/* Left Section: OG Image Creation */}
                <div className="flex w-full px-2 h-full">
                    <div className='flex flex-col w-1/2'>
                        <h2 className="text-2xl font-bold mb-4">Create OG Image</h2>
                        <button
                            onClick={generateOGImage}
                            className="mb-6 px-4 py-2 bg-blue-500 text-white rounded"
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'Generating...' : 'Generate OG Image'}
                        </button>
                        <div className="flex flex-col space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <ReactQuill
                                value={content}
                                onChange={setContent}
                                className="p-2 border rounded quill-editor"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="p-2 border rounded"
                            />
                        </div>
                    </div>
                    <div ref={postRef} className="ml-8 p-4 border rounded bg-gray-100 relative h-fit">
                        <h2 className="text-2xl font-bold">{title}</h2>
                        <div className="mt-2" dangerouslySetInnerHTML={{ __html: content }} />
                        {image && (
                            <div className="relative mt-4 max-w-full h-auto overflow-hidden">
                                <img src={image} alt="Post" className="rounded shadow-lg" crossOrigin="anonymous" />
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Section: Generated Image with Transition */}
            <div className={`generated-image-container bg-white ${isImageVisible ? 'visible' : ''}`}>
                <span className='text-2xl absolute top-[20px] right-[20px] cursor-pointer hover:bg-slate-300 px-4 py-2 rounded-sm' onClick={() => setIsImageVisible(!isImageVisible)}>x</span>
                <div className="relative overflow-hidden w-[500px] h-[300px]">
                    <img src={icon} alt="Icon" className="absolute top-2 left-2 w-8 h-8" />
                    <button
                        onClick={downloadImage}
                        className="mb-4 px-4 py-2 bg-green-500 text-white rounded self-end absolute top-[10px] right-[10px] z-10"
                    >
                        Download
                    </button>
                    <button
                        onClick={viewImage}
                        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded self-end absolute top-[10px] right-[120px] z-10"
                    >
                        View
                    </button>
                    <img src={ogImageUrl} alt="Generated OG" className="border rounded shadow-md max-w-full h-auto w-full" />
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent"></div>
                    <p className="mt-2 text-sm text-gray-600 text-center">Right-click on the image to open it in a new tab.</p>
                </div>
            </div>
        </div>
    );
}
