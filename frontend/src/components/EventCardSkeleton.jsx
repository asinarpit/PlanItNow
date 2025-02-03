import React from "react";
import Skeleton from "react-loading-skeleton";

const EventCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm p-4 shadow-md">
      <Skeleton height={150} />
          <div className="p-4">
            <Skeleton width="60%" />
            <Skeleton count={4} className="mt-2" width={"40%"} />
            <Skeleton height={30} width="100%" className="mt-4" />
          </div>
    </div>
  );
};

export default EventCardSkeleton;
