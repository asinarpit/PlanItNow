import React from "react";
import NewEvents from "../components/NewEvents";
import UpcomingEvents from "../components/UpcomingEvents";
import FeaturedEvents from "../components/FeaturedEvents";
import HeroSection from "../components/HeroSection";



const HomePage = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto text-center">
        <HeroSection/>
        <NewEvents/>
        <UpcomingEvents/>
        <FeaturedEvents/>
      </div>
    </div>
  );
};

export default HomePage;
