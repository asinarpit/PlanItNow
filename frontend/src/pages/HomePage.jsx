import React from "react";
import NewEvents from "../components/NewEvents";
import UpcomingEvents from "../components/UpcomingEvents";
import FeaturedEvents from "../components/FeaturedEvents";



const HomePage = () => {
  return (
    <div className="min-h-screenpy-8">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to PlanItNow: The Event Manager</h1>
        <p className="text-gray-700 mb-8">Plan, organize, and manage college events with ease.</p>

        <NewEvents/>
        <UpcomingEvents/>
        <FeaturedEvents/>
      </div>
    </div>
  );
};

export default HomePage;
