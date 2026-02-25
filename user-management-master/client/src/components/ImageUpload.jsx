import React, { useState, useEffect } from 'react';

const ImageUpload = ({ onImageSelect, existingImage, onImageRemove }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingImage) {
            setPreviewUrl(existingImage);
        } else {
            setPreviewUrl(null);
        }
    }, [existingImage]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setError('');

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB
            setError('File size must be less than 2MB.');
            return;
        }

        setPreviewUrl(URL.createObjectURL(file));
        onImageSelect(file);
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        onImageSelect(null);
        if (onImageRemove) {
            onImageRemove();
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <span>No Image</span>
                    </div>
                )}
            </div>

            <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            <div className="flex space-x-3">
                <label
                    htmlFor="profileImage"
                    className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 text-sm font-medium"
                >
                    {previewUrl ? 'Change Image' : 'Add Image'}
                </label>

                {previewUrl && onImageRemove && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 text-sm font-medium"
                    >
                        Remove Image
                    </button>
                )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default ImageUpload;
