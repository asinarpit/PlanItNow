import React from 'react';
import { FiUser, FiFile, FiDownload, FiFileText, FiTrash } from 'react-icons/fi';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const MessageBubble = ({ message, isSender, onDeleteAttachment }) => {
    const getFileIcon = (contentType) => {
        if (contentType.startsWith('image/')) {
            return null; 
        } else if (contentType.includes('pdf')) {
            return <FiFileText className="w-5 h-5" />;
        } else {
            return <FiFile className="w-5 h-5" />;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const handleDeleteAttachment = (attachmentId, event) => {
        event.stopPropagation();
        event.preventDefault();
        if (onDeleteAttachment && isSender) {
            onDeleteAttachment(message._id, attachmentId);
        }
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                x: isSender ? 50 : -50
            }}
            animate={{
                opacity: 1,
                x: 0
            }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 15
            }} className={`flex items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}>
            {!isSender && (
                <div className="flex-shrink-0">
                    {message.user.image ? (
                        <img
                            src={message.user.image}
                            alt={message.user.name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <FiUser className="text-gray-600 dark:text-gray-300" />
                        </div>
                    )}
                </div>
            )}

            <div className={`max-w-xs lg:max-w-md p-3 ${isSender
                ? 'bg-teal-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-lg rounded-tr-lg rounded-br-lg'
                }`}>
                {!isSender && (
                    <div className="text-sm font-medium mb-1">
                        {message.user.name}
                    </div>
                )}
                
                {message.text && <p className="text-sm break-words">{message.text}</p>}
                
                {/* Attachments section */}
                {message.attachments && message.attachments.length > 0 && (
                    <div className="space-y-2 mt-2">
                        {message.attachments.map((attachment, index) => (
                            <div key={index} className="rounded overflow-hidden">
                                {attachment.contentType && attachment.contentType.startsWith('image/') ? (
                                    <div className="relative group">
                                        <img 
                                            src={attachment.url} 
                                            alt={attachment.filename || "Attached image"} 
                                            className="rounded max-h-60 w-full object-contain cursor-pointer"
                                            onClick={() => window.open(attachment.url, '_blank')}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="flex gap-2">
                                                <a 
                                                    href={attachment.url} 
                                                    download={attachment.filename}
                                                    className="p-2 bg-white rounded-full shadow-lg"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <FiDownload className="text-gray-800" />
                                                </a>
                                                
                                                {isSender && (
                                                    <button
                                                        className="p-2 bg-white rounded-full shadow-lg"
                                                        onClick={(e) => handleDeleteAttachment(attachment._id || index, e)}
                                                    >
                                                        <FiTrash className="text-red-500" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <a 
                                        href={attachment.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={`flex items-center p-2 rounded transition-colors ${
                                            isSender 
                                                ? 'bg-teal-700 hover:bg-teal-800' 
                                                : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                                        }`}
                                    >
                                        <div className="mr-2 text-white">
                                            {getFileIcon(attachment.contentType)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium truncate">
                                                {attachment.filename || "File"}
                                            </div>
                                            <div className={`text-xs ${isSender ? 'text-teal-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {attachment.filesize && formatFileSize(attachment.filesize)}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <FiDownload className={`${isSender ? 'text-teal-200' : 'text-gray-500 dark:text-gray-300'}`} />
                                            
                                            {isSender && (
                                                <button 
                                                    onClick={(e) => handleDeleteAttachment(attachment._id || index, e)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <FiTrash />
                                                </button>
                                            )}
                                        </div>
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="flex justify-end mt-1">
                    <span className="text-xs opacity-75">
                        {format(new Date(message.timestamp), 'HH:mm')}
                    </span>
                </div>
            </div>

            {isSender && (
                <div className="flex-shrink-0">
                    {message.user.image ? (
                        <img
                            src={message.user.image}
                            alt={message.user.name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <FiUser className="text-gray-600 dark:text-gray-300" />
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default MessageBubble;