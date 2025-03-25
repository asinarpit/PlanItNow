import React from "react";
import HeroSection from "../components/HeroSection";
import EventList from "../components/EventList";



const HomePage = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto text-center">
        <HeroSection />
        <EventList
          title="Featured Events"
          subtitle="Highlights You Can't Miss"
          endpoint="featured=true"
          emptyMessage="No featured events right now."
          viewAllLink="/events?featured=true"

        />
        <EventList
          title="New Events"
          subtitle="Discover What's Fresh"
          endpoint="new=true"
          emptyMessage="No new events available at the moment."
          viewAllLink="/events?new=true"
        />

        <EventList
          title="Upcoming Events"
          subtitle="Plan Your Next Adventure"
          endpoint="upcoming=true"
          emptyMessage="No upcoming events scheduled yet."
          viewAllLink="/events?upcoming=true"
        />
      </div>
    </div>
  );
};

export default HomePage;
