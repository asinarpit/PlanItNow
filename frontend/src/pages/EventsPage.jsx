import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import EventCardSkeleton from "../components/EventCardSkeleton";
import { useSearchParams } from "react-router";
import { FiCalendar, FiArrowDown, FiFilter } from "react-icons/fi";
import EventsPageFilters from "../components/EventsPageFilters";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { motion, AnimatePresence } from "framer-motion";
import MobileFilters from "../components/MobileFilters";
import Portal from "../components/Portal";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            when: "beforeChildren",
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: index * 0.1,
            duration: 0.3,
        },
    }),
};

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(
        searchParams.get("categories")?.split(",") || []
    );
    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [upcoming, setUpcoming] = useState(searchParams.get("upcoming") === "true");
    const [featured, setFeatured] = useState(searchParams.get("featured") === "true");
    const [newEvents, setNewEvents] = useState(searchParams.get("new") === "true");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    useEffect(() => {
        const fetchEventsAndCategories = async () => {
            setLoading(true);
            try {
                const [eventsRes, categoriesRes] = await Promise.all([
                    axios.get(`${BASE_URL}/events/paginated`, {
                        params: {
                            page,
                            category: selectedCategories.join(","),
                            sort: sortBy,
                            upcoming,
                            featured,
                            new: newEvents,
                        },
                    }),
                    axios.get(`${BASE_URL}/events/categories`),
                ]);

                setEvents(prev => [...prev, ...eventsRes.data.events]);
                setHasMore(eventsRes.data.hasNext);
                setCategories(categoriesRes.data);
                setError("");
            } catch (err) {
                setError("Failed to fetch events. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchEventsAndCategories();
    }, [page, selectedCategories, sortBy, upcoming, featured, newEvents]);

    const handleCategoryToggle = (category) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];

        setSelectedCategories(newCategories);
        setPage(1);
        setEvents([]);
        setSearchParams({
            categories: newCategories.join(","),
            sort: sortBy,
            upcoming,
            featured,
            new: newEvents,
        });
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setSortBy(newSort);
        setPage(1);
        setEvents([]);
        setSearchParams({
            categories: selectedCategories.join(","),
            sort: newSort,
            upcoming,
            featured,
            new: newEvents,
        });
    };

    const handleUpcomingToggle = () => {
        const newUpcoming = !upcoming;
        setUpcoming(newUpcoming);
        setPage(1);
        setEvents([]);
        setSearchParams({
            categories: selectedCategories.join(","),
            sort: sortBy,
            upcoming: newUpcoming,
            featured,
            new: newEvents,
        });
    };

    const handleFeaturedToggle = () => {
        const newFeatured = !featured;
        setFeatured(newFeatured);
        setPage(1);
        setEvents([]);
        setSearchParams({
            categories: selectedCategories.join(","),
            sort: sortBy,
            upcoming,
            featured: newFeatured,
            new: newEvents,
        });
    };

    const handleNewToggle = () => {
        const newNewEvents = !newEvents;
        setNewEvents(newNewEvents);
        setPage(1);
        setEvents([]);
        setSearchParams({
            categories: selectedCategories.join(","),
            sort: sortBy,
            upcoming,
            featured,
            new: newNewEvents,
        });
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSortBy("newest");
        setUpcoming(false);
        setFeatured(false);
        setNewEvents(false);
        setPage(1);
        setEvents([]);
        setSearchParams({});
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="lg:hidden fixed left-5 top-20 z-50">
                    <button
                        onClick={() => setIsFiltersOpen(true)}
                        className="flex text-sm items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-3xl shadow-lg hover:bg-teal-700 transition-colors"
                    >
                        <FiFilter />
                        Show Filters
                    </button>
                </div>

                {/* Mobile Filters */}
                <Portal>
                    <MobileFilters
                        isOpen={isFiltersOpen}
                        onClose={() => setIsFiltersOpen(false)}
                    >
                        <EventsPageFilters
                            categories={categories}
                            selectedCategories={selectedCategories}
                            handleCategoryToggle={handleCategoryToggle}
                            sortBy={sortBy}
                            handleSortChange={handleSortChange}
                            upcoming={upcoming}
                            handleUpcomingToggle={handleUpcomingToggle}
                            featured={featured}
                            handleFeaturedToggle={handleFeaturedToggle}
                            newEvents={newEvents}
                            handleNewToggle={handleNewToggle}
                            clearFilters={clearFilters}
                        />

                    </MobileFilters>
                </Portal>
                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                    <div className="hidden lg:block">
                        <EventsPageFilters
                            categories={categories}
                            selectedCategories={selectedCategories}
                            handleCategoryToggle={handleCategoryToggle}
                            sortBy={sortBy}
                            handleSortChange={handleSortChange}
                            upcoming={upcoming}
                            handleUpcomingToggle={handleUpcomingToggle}
                            featured={featured}
                            handleFeaturedToggle={handleFeaturedToggle}
                            newEvents={newEvents}
                            handleNewToggle={handleNewToggle}
                            clearFilters={clearFilters}
                        />

                    </div>


                    {/* Events Grid */}
                    <div className="flex-1">
                        {error && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                                {error}
                            </div>
                        )}

                        {!loading && events.length === 0 && (
                            <div className="text-center py-12">
                                <div className="inline-block bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                                    <FiCalendar className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No events found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Try adjusting your filters or check back later!
                                </p>
                            </div>
                        )}

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            key={`${selectedCategories.join()}-${sortBy}-${page}`}
                        >
                            <AnimatePresence initial={false}>
                                {loading
                                    ? [...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={`skeleton-${i}`}
                                            variants={itemVariants}
                                            custom={i}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            <EventCardSkeleton />
                                        </motion.div>
                                    ))
                                    : events.map((event, index) => (
                                        <motion.div
                                            key={event._id}
                                            variants={itemVariants}
                                            custom={index}
                                            initial="hidden"
                                            animate="visible"
                                            
                                        >
                                            <EventCard event={event} />
                                        </motion.div>
                                    ))}
                            </AnimatePresence>
                        </motion.div>

                        {hasMore && !loading && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={() => setPage(prev => prev + 1)}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
                                >
                                    Load More Events
                                    <FiArrowDown className="ml-2 animate-bounce" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventsPage;