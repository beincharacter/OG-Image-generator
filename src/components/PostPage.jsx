import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

export function PostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [ogImageUrl, setOgImageUrl] = useState('');
  const postRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const generateOGImage = async () => {
    if (postRef.current === null) return;
    console.log("Generating OG Image...");
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
      console.log("OG Image generated successfully.");
    } catch (error) {
      console.error('Failed to generate OG image:', error);
    }
  };

  const downloadImage = () => {
    if (ogImageUrl) {
      const link = document.createElement('a');
      link.href = ogImageUrl;
      link.download = 'og-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Create a Post</h1>
      <div className="flex flex-wrap justify-between -mx-2 space-y-4 md:space-y-0 md:space-x-4">
        {/* Left Section: OG Image Creation */}
        <div className="w-full md:w-2/5 px-2 h-full">
          <h2 className="text-2xl font-bold mb-4">Create OG Image</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 border rounded"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="p-2 border rounded"
              rows="4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="p-2 border rounded"
            />
            {image && <img src={image} alt="Post" className="rounded mt-4 max-w-full h-auto" />}
          </div>
          <div ref={postRef} className="mt-8 p-4 border rounded bg-gray-100">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-2">{content}</p>
            {image && <img src={image} alt="Post" className="rounded mt-4 max-w-full h-auto" crossOrigin="anonymous" />}
          </div>
          <button
            onClick={generateOGImage}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded w-full"
          >
            Generate OG Image
          </button>
        </div>

        {/* Right Section: Generated Image */}
        <div className="flex justify-center items-center flex-col w-full md:w-1/2 px-2">
          <h2 className="text-2xl font-bold mb-4">Generated OG Image</h2>
          {ogImageUrl ? (
            <div>
              <img src={ogImageUrl} alt="Generated OG" className="border rounded shadow-md max-w-full h-auto" />
              <button
                onClick={downloadImage}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded w-full"
              >
                Download Image
              </button>
              <p className="mt-2 text-sm text-gray-600 text-center">Right-click on the image to open it in a new tab.</p>
            </div>
          ) : (
            <div className="border rounded p-4 text-center text-gray-500">
              No image generated yet. Use the form on the left to create an OG image.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
