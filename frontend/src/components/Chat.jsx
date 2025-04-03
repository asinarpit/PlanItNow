import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiSend, FiPaperclip, FiX, FiMenu} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import MessageBubble from './MessageBubble';
import { motion, AnimatePresence } from 'framer-motion';
import EventsSidebar from './EventsSidebar';
import { MdOutlineEventNote } from 'react-icons/md';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Chat = () => {
    const { user, token } = useSelector(state => state.auth);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const socketRef = useRef();
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchRegisteredEvents = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/events/user/registered`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRegisteredEvents(response.data);
            } catch (error) {
                console.error('Error fetching registered events:', error);
                toast.error('Failed to load events');
            }
        };

        if (user) fetchRegisteredEvents();
    }, [user, token]);

    useEffect(() => {
        if (!selectedEvent) return;

        socketRef.current = io(import.meta.env.VITE_BASE_URL);

        socketRef.current.emit('joinEventRoom', {
            eventId: selectedEvent._id,
            userId: user.id
        },
            (error) => {
                if (error) {
                    console.error("Failed to join room:", error);
                    toast.error(`Failed to join chat: ${error}`);
                }
            });

        socketRef.current.on('previousMessages', (messages) => {
            setMessages(messages);
        });

        socketRef.current.on('receiveMessage', (message) => {
            setMessages(prev => [...prev, message]);
        });

        socketRef.current.on('messageDeleted', ({ messageId }) => {
            setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
            toast.success('Message deleted');
        });
        socketRef.current.on('attachmentDeleted', ({ messageId, attachmentId }) => {
            setMessages(prevMessages => prevMessages.map(msg => {
                if (msg._id === messageId) {
                    return {
                        ...msg,
                        attachments: msg.attachments.filter(attachment =>
                            attachment._id !== attachmentId
                        )
                    };
                }
                return msg;
            }));

            toast.success('Attachment deleted successfully');
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [selectedEvent, user?.id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);

        const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
        if (validFiles.length < files.length) {
            toast.error('Some files exceed the 10MB size limit and were not added');
        }

        const newFiles = validFiles.map(file => ({
            file,
            name: file.name,
            type: file.type,
            size: file.size,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        }));

        setSelectedFiles(prev => [...prev, ...newFiles]);
        if (validFiles.length > 0) {
            toast.success(`${validFiles.length} file(s) selected`);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => {
            const updated = [...prev];
            const fileName = updated[index].name;

            if (updated[index].preview) {
                URL.revokeObjectURL(updated[index].preview);
            }
            updated.splice(index, 1);
            toast.success(`Removed ${fileName}`);
            return updated;
        });
    };

    const handleDeleteAttachment = (messageId, attachmentId) => {
        if (!socketRef.current || !messageId) return;

        toast.loading('Deleting attachment...', { id: 'deleteAttachment' });

        socketRef.current.emit('deleteAttachment', {
            messageId,
            attachmentId,
            userId: user.id,
            eventId: selectedEvent._id
        }, (error) => {
            if (error) {
                console.error('Failed to delete attachment:', error);
                toast.error(`Failed to delete attachment: ${error}`, { id: 'deleteAttachment' });
            } else {
                toast.dismiss('deleteAttachment');
            }
        });
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if ((!messageInput.trim() && selectedFiles.length === 0) || !user?.id || !selectedEvent) return;
        if (isUploading) return;

        try {
            setIsUploading(true);
            toast.loading('Sending message...', { id: 'sendMessage' });

            const filePromises = selectedFiles.map(fileObj => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64data = reader.result.split(',')[1];
                        resolve({
                            name: fileObj.name,
                            type: fileObj.type,
                            size: fileObj.size,
                            data: base64data
                        });
                    };
                    reader.readAsDataURL(fileObj.file);
                });
            });

            const filesData = await Promise.all(filePromises);

            const messageData = {
                text: messageInput,
                userId: user.id,
                eventId: selectedEvent._id,
                files: filesData
            };

            setMessageInput('');
            setSelectedFiles([]);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            await new Promise((resolve, reject) => {
                socketRef.current.emit('sendMessage', messageData, (error) => {
                    if (error) {
                        reject(error);
                        setMessageInput(messageData.text);
                    } else {
                        resolve();
                    }
                });
            });

            toast.success('Message sent', { id: 'sendMessage' });
        } catch (err) {
            console.error('Failed to send message:', err);
            toast.error('Failed to send message. Please try again.', { id: 'sendMessage' });

        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex h-screen md:h-[80vh] w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 my-4">

            <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="md:hidden fixed left-0 top-1/2 z-50 p-2 rounded-r-full bg-teal-600 text-white shadow-lg"
            >
             <MdOutlineEventNote size={20} />
            </button>

            <AnimatePresence>
                {(showSidebar || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={`fixed md:relative inset-y-0 left-0 z-[55] md:z-auto w-3/4 md:w-1/4 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 overflow-y-auto`}
                    >
                        <EventsSidebar
                            registeredEvents={registeredEvents}
                            selectedEvent={selectedEvent}
                            setSelectedEvent={(event) => {
                                setSelectedEvent(event);
                                setShowSidebar(false);
                            }}
                            onClose={()=>setShowSidebar(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay*/}
            <AnimatePresence>
                {showSidebar && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
                        onClick={() => setShowSidebar(false)}
                    />
                )}
            </AnimatePresence>


           


            <div className="relative flex-1 flex flex-col">
                {selectedEvent ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col h-full"
                    >

                        <div className="md:hidden p-4 border-b dark:border-gray-700 flex items-center">
                            <div>
                                <h2 className="text-lg font-semibold dark:text-white">
                                    {selectedEvent.title}
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {selectedEvent.location} • {new Date(selectedEvent.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        
                        <div className="hidden md:block p-4 border-b dark:border-gray-700">
                            <h2 className="text-xl font-semibold dark:text-white">
                                {selectedEvent.title}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {selectedEvent.location} • {new Date(selectedEvent.date).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                            <AnimatePresence initial={false}>
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={msg._id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <MessageBubble
                                            message={msg}
                                            isSender={msg.user._id === user?.id}
                                            onDeleteAttachment={handleDeleteAttachment}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendMessage} className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                            {selectedFiles.length > 0 && (
                                <div className="mb-2 flex flex-wrap gap-2">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="relative bg-gray-100 dark:bg-gray-700 rounded p-2 flex items-center space-x-2">
                                            <div className="max-w-xs truncate">
                                                {file.preview ? (
                                                    <div className="w-10 h-10 rounded overflow-hidden">
                                                        <img src={file.preview} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-xs">
                                                        {file.name.split('.').pop().toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs truncate max-w-xs">{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder={selectedFiles.length > 0 ? "Add a message or send files..." : "Type your message..."}
                                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 dark:bg-gray-700 dark:border-gray-600"
                                />

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    multiple
                                    accept="image/jpeg,image/png,image/jpg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                />

                                <motion.button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    disabled={isUploading}
                                >
                                    <FiPaperclip className="w-5 h-5" />
                                </motion.button>

                                <motion.button
                                    type="submit"
                                    className="p-2 text-white bg-teal-600 rounded-full hover:bg-teal-700 transition-colors disabled:opacity-50"
                                    disabled={(!messageInput.trim() && selectedFiles.length === 0) || !user || isUploading}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiSend className="w-5 h-5" />
                                </motion.button>
                            </div>

                            {isUploading && (
                                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Uploading files...
                                </div>
                            )}
                        </form>
                    </motion.div>
                ) : (
                    <div className="flex-1 flex items-center justify-center dark:text-gray-300">
                        <div className="text-center p-4">
                            <p className="text-lg mb-4">Select an event to view its chat</p>
                            <button
                                onClick={() => setShowSidebar(true)}
                                className="md:hidden px-4 py-2 bg-teal-600 text-white rounded-lg"
                            >
                                Browse Events
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;