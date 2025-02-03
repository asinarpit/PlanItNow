import React from 'react';

const HeroSection = () => {
    return (
        <section
            className="relative text-white py-32 px-6 bg-cover bg-center max-w-screen-2xl overflow-hidden mb-8 -mx-4 min-h-screen flex justify-center items-center"
            style={{
                backgroundImage: 'url(https://wallpapercave.com/wp/wp7488230.jpg)',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
            }}
        >
            <div className="container mx-auto text-center relative z-10">
                <h1 className="text-5xl font-bold mb-4">Welcome to Plan<span className='text-teal-600'>It</span>Now</h1>
                <p className="text-xl mb-8">
                    Seamlessly organize, manage, and participate in college events with ease. Stay updated on the latest happenings in your campus.
                </p>
                <div className="space-x-4">
                    <a
                        href="#events"
                        className="inline-block bg-teal-600 text-gray-100 font-semibold py-2 px-6 rounded-full hover:bg-teal-700 transition duration-300"
                    >
                        Explore Events
                    </a>
                    <a
                        href="#create-event"
                        className="inline-block bg-transparent border-2 border-teal-600 text-teal-600 font-semibold py-2 px-6 rounded-full hover:bg-teal-600 hover:text-gray-100 transition duration-300"
                    >
                        Create Event
                    </a>
                </div>
            </div>
            <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
        </section>
    );
};

export default HeroSection;
