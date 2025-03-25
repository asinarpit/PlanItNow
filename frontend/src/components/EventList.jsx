import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";
import { useNavigate } from "react-router";
import { FaArrowRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion } from "framer-motion";
import 'swiper/css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EventList = ({
    title,
    subtitle,
    endpoint,
    emptyMessage,
    showViewAll = true,
    viewAllLink = "/events",
    skeletonCount = 4,
}) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const swiperRef = useRef(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/events/paginated?${endpoint}`);
                setEvents(response.data.events);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching events:", error);
                setLoading(false);
            }
        };

        fetchEvents();
    }, [endpoint]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 14,
                delay: 0.4
            }
        },
        hover: {
            scale: 1.1,
            transition: { type: "spring", stiffness: 300 }
        },
        tap: { scale: 0.95 }
    };

    const iconVariants = {
        hoverPrev: { x: -4 },
        hoverNext: { x: 4 },
    };

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={containerVariants}
            className="py-16 max-w-screen-xl mx-auto"
        >
            <div className="max-w-screen-2xl mx-auto">
                {/* Header */}
                <motion.div
                    variants={containerVariants}
                    className="mb-12 text-center"
                >
                    {title && (
                        <>
                            <motion.div
                                variants={cardVariants}
                                className="inline-flex items-center mb-4"
                            >
                                <span className="h-1 w-20 bg-gradient-to-r from-transparent to-teal-600 mr-4"></span>
                                <h2 className="text-sm font-semibold tracking-widest text-teal-600 uppercase">
                                    {title}
                                </h2>
                                <span className="h-1 w-20 bg-gradient-to-l from-transparent to-teal-600 ml-4"></span>
                            </motion.div>
                            <motion.h3
                                variants={cardVariants}
                                className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
                            >
                                {subtitle}
                            </motion.h3>
                        </>
                    )}
                </motion.div>

                {/* Content */}
                {!loading && events.length === 0 ? (
                    <motion.div
                        variants={cardVariants}
                        className="text-center py-12"
                    >
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            {emptyMessage}
                        </p>
                    </motion.div>
                ) : (
                    <div className="relative group">
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={30}
                            onSlideChange={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            slidesPerView={'auto'}
                            breakpoints={{
                                640: { slidesPerView: 1.2 },
                                768: { slidesPerView: 2.2 },
                                1024: { slidesPerView: 3.2 },
                                1280: { slidesPerView: 4 },
                            }}
                            navigation={{
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            }}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            className="!py-4"
                        >
                            {loading
                                ? [...Array(skeletonCount)].map((_, index) => (
                                    <SwiperSlide key={index}>
                                        <motion.div
                                            variants={cardVariants}
                                            custom={index}
                                        >
                                            <EventCardSkeleton />
                                        </motion.div>
                                    </SwiperSlide>
                                ))
                                : events.map((event, index) => (
                                    <SwiperSlide key={event._id} className="!h-auto">
                                        <motion.div
                                            variants={cardVariants}
                                            custom={index}
                                            className="h-full"
                                        >
                                            <EventCard event={event} />
                                        </motion.div>
                                    </SwiperSlide>
                                ))}
                        </Swiper>

                        {/* Navigation buttons */}
                        <motion.button
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="hidden lg:inline-flex swiper-button-prev absolute top-1/2 left-5 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 text-teal-600 p-3 rounded-full 
        shadow-lg hover:shadow-xl transition-all duration-300
        border border-gray-200 dark:border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed
        hover:bg-teal-50 dark:hover:bg-gray-700"
                            disabled={swiperRef.current?.isBeginning}
                        >
                            <motion.span
                                variants={iconVariants}
                                whileHover="hoverPrev"
                                className="block"
                            >
                                <FiChevronLeft className="w-6 h-6" />
                            </motion.span>
                        </motion.button>

                        <motion.button
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                            onClick={() => swiperRef.current?.slideNext()}
                            className="hidden lg:inline-flex swiper-button-next absolute top-1/2 right-5 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 text-teal-600 p-3 rounded-full 
        shadow-lg hover:shadow-xl transition-all duration-300
        border border-gray-200 dark:border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed
        hover:bg-teal-50 dark:hover:bg-gray-700"
                            disabled={swiperRef.current?.isEnd}
                        >
                            <motion.span
                                variants={iconVariants}
                                whileHover="hoverNext"
                                className="block"
                            >
                                <FiChevronRight className="w-6 h-6" />
                            </motion.span>
                        </motion.button>
                    </div>
                )}
            </div>

            {showViewAll && !loading && events.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-4"
                >
                    <button
                        className="group inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
                        onClick={() => navigate(viewAllLink)}
                    >
                        View All Events
                        <FaArrowRight className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                </motion.div>
            )}
        </motion.section>
    );
};

export default EventList;