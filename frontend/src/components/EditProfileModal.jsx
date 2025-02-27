import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../features/auth/authSlice";
import { useCallback, useState } from "react";
import { FaImage } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

const EditProfileModal = ({ user, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        image: user.image,
    });
    const [uploadedImage, setUploadedImage] = useState(null);



    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result);
                setFormData((prev) => ({ ...prev, image: file }));
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*",
        maxFiles: 1,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("email", formData.email);
            if (formData.image instanceof File) {
                data.append("image", formData.image);
            }

            const response = await dispatch(updateUser({ userId: user._id, formData: data })).unwrap();
            toast.success("Profile updated successfully");
            onClose();
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Profile Image</label>
                        <div
                            {...getRootProps()}
                            className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:border-teal-600 transition-colors dark:bg-gray-900"
                        >
                            <input {...getInputProps()} />
                            {uploadedImage ? (
                                <img
                                    src={uploadedImage}
                                    alt="Uploaded"
                                    className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <FaImage className="text-4xl text-teal-600 mb-2" />
                                    <p className="text-gray-600">
                                        Drag & drop an image here, or click to select one
                                    </p>
                                    <p className="text-sm text-gray-500">(Only *.jpeg, *.png, *.jpg)</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-teal-600 rounded text-teal-600 hover:bg-teal-600 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-teal-600 text-white rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;