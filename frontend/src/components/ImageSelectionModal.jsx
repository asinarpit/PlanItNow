import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaCamera, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUser } from "../features/auth/authSlice";

const defaultImages = [
    "https://cdn-icons-png.flaticon.com/512/706/706820.png",
    "https://cdn-icons-png.flaticon.com/512/706/706844.png",
    "https://cdn-icons-png.flaticon.com/512/706/706829.png",
    "https://cdn-icons-png.flaticon.com/512/706/706836.png",
    "https://cdn-icons-png.flaticon.com/512/706/706845.png",
    "https://cdn-icons-png.flaticon.com/512/706/706841.png",
    "https://cdn-icons-png.flaticon.com/512/706/706822.png",
    "https://cdn-icons-png.flaticon.com/512/706/706797.png",
];

const ImageSelectionModal = ({ isOpen, onClose, userId }) => {
    const dispatch = useDispatch();
    const [selectedTab, setSelectedTab] = useState("default");

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        multiple: false,
        maxSize: 5 * 1024 * 1024, // 5MB
        onDrop: (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles?.length) {
                toast.error("File must be an image (JPEG, PNG, WEBP) up to 5MB");
                return;
            }
            if (acceptedFiles?.length) {
                handleImageUpload(acceptedFiles[0]);
            }
        }
    });

    const handleImageSelect = async (imageUrl) => {
        try {
            const formData = new FormData();
            formData.append("image", imageUrl);

            await dispatch(updateUser({ userId, formData })).unwrap();
            toast.success("Profile image updated!");
            onClose();
        } catch (error) {
            toast.error(error.message || "Failed to update image");
        }
    };

    const handleImageUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append("image", file);

            await dispatch(updateUser({ userId, formData })).unwrap();
            toast.success("Profile image updated!");
            onClose();
        } catch (error) {
            toast.error(error.message || "Failed to upload image");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Update Profile Image</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <div className="flex gap-4 mb-4">
                    <button
                        onClick={() => setSelectedTab("default")}
                        className={`px-4 py-2 rounded-md text-sm ${selectedTab === "default"
                                ? "bg-teal-600 text-white"
                                : "bg-gray-100 dark:bg-gray-700"
                            }`}
                    >
                        Default Images
                    </button>
                    <button
                        onClick={() => setSelectedTab("upload")}
                        className={`px-4 py-2 rounded-md text-sm ${selectedTab === "upload"
                                ? "bg-teal-600 text-white"
                                : "bg-gray-100 dark:bg-gray-700"
                            }`}
                    >
                        Upload
                    </button>
                </div>

                {selectedTab === "default" ? (
                    <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                        {defaultImages.map((img, index) => (
                            <div
                                key={index}
                                className="cursor-pointer group relative"
                                onClick={() => handleImageSelect(img)}
                            >
                                <img
                                    src={img}
                                    alt={`Default ${index + 1}`}
                                    className="w-full h-32 object-contain rounded-lg hover:opacity-75 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-teal-600 p-2 rounded-full">
                                        <FaCamera className="text-white" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                                ? "border-teal-600 bg-teal-50 dark:bg-teal-900/30"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="text-teal-600 text-4xl mb-4 flex flex-col items-center">
                            <FaCamera />
                        </div>
                        {isDragActive ? (
                            <p className="text-gray-600 dark:text-gray-300">
                                Drop the image here...
                            </p>
                        ) : (
                            <>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Drag and drop an image here, or click to select
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    (JPEG, PNG, WEBP up to 5MB)
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageSelectionModal;