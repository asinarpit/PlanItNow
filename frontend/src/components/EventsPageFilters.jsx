import React from "react";
import { FiFilter, FiX } from "react-icons/fi";

const EventsPageFilters = ({
    categories,
    selectedCategories,
    handleCategoryToggle,
    sortBy,
    handleSortChange,
    upcoming,
    handleUpcomingToggle,
    featured,
    handleFeaturedToggle,
    newEvents,
    handleNewToggle,
    clearFilters,
}) => {
    return (
        <div className="w-full lg:w-64 lg:sticky lg:top-24">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <FiFilter className="text-teal-600" /> Filters
                    </h3>
                    {(selectedCategories.length > 0 || sortBy !== "newest" || upcoming || featured || newEvents) && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
                        >
                            Clear all <FiX className="mt-0.5" />
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Sort By
                        </label>
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="popular">Most Popular</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Categories
                        </label>
                        <div className="space-y-2">
                            {categories.map(category => (
                                <label
                                    key={category}
                                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCategoryToggle(category)}
                                        className="rounded text-teal-600 focus:ring-teal-500"
                                    />
                                    <span className="capitalize">{category}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Additional Filters
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                <input
                                    type="checkbox"
                                    checked={upcoming}
                                    onChange={handleUpcomingToggle}
                                    className="rounded text-teal-600 focus:ring-teal-500"
                                />
                                <span>Upcoming Events</span>
                            </label>
                            <label className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                <input
                                    type="checkbox"
                                    checked={featured}
                                    onChange={handleFeaturedToggle}
                                    className="rounded text-teal-600 focus:ring-teal-500"
                                />
                                <span>Featured Events</span>
                            </label>
                            <label className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                <input
                                    type="checkbox"
                                    checked={newEvents}
                                    onChange={handleNewToggle}
                                    className="rounded text-teal-600 focus:ring-teal-500"
                                />
                                <span>New Events (Last 7 Days)</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventsPageFilters;