import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiChevronLeft } from 'react-icons/fi';

const EventsSidebar = ({ registeredEvents, selectedEvent, setSelectedEvent, onClose }) => {
    return (
        <div className="h-full overflow-y-auto"
        >
            <div className="p-4">
                <div className='flex items-center justify-between mb-4'>
                    <h2 className="text-xl font-semibold dark:text-white flex items-center">
                        <FiCalendar className="mr-2 text-teal-600" /> Your Events
                    </h2>

                    <div onClick={onClose} className='md:hidden p-2 bg-teal-600 rounded-full text-white shadow-sm'>
                        <FiChevronLeft />

                    </div>

                </div>

                {registeredEvents.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        You haven't registered for any events yet.
                    </p>
                ) : (
                    <AnimatePresence>
                        {registeredEvents.map((event, index) => (
                            <React.Fragment key={event._id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`px-2 py-5 rounded-md cursor-pointer transition-colors duration-200 ${selectedEvent?._id === event._id
                                        ? 'bg-teal-600 text-white'
                                        : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-sm md:text-base">{event.title}</h3>
                                            <p className="text-xs opacity-75 mt-1 truncate">
                                                {event.location}
                                            </p>
                                        </div>
                                        <p className="text-xs opacity-75 font-semibold whitespace-nowrap">
                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </p>
                                    </div>
                                </motion.div>

                                <div className='border-b dark:border-gray-700'></div>
                            </React.Fragment>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default EventsSidebar;