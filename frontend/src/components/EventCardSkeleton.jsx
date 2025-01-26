import React from "react";

const EventCardSkeleton = () => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md animate-pulse">
      <div className="bg-gray-300 h-48 w-full mb-4 rounded-md"></div>
      <div className="bg-gray-200 h-6 w-3/4 mb-2"></div>
      <div className="bg-gray-200 h-4 w-1/2 mb-4"></div>
      <div className="bg-gray-200 h-4 w-1/3"></div>
    </div>
  );
};

export default EventCardSkeleton;
