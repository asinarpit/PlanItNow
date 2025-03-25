import { motion } from "framer-motion";
import { FiArrowRight, FiCalendar, FiUsers } from "react-icons/fi";
import { IoIosFlash } from "react-icons/io";
import { FaSackDollar } from "react-icons/fa6";
import { useNavigate } from "react-router";

const HeroSection = () => {
    const navigate = useNavigate();
    return (
        <section className="min-h-screen bg-white dark:bg-gray-900 px-6 lg:px-10 py-10 overflow-hidden">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 lg:gap-12 items-center">
                {/* Left Content */}
                <div className="text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center gap-3 justify-center md:justify-start"
                            >
                                <div className="h-12 w-1 bg-teal-600 rounded-full hidden md:block"></div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                    PlanItNow
                                </span>
                            </motion.div>

                            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-300 dark:to-emerald-400 bg-clip-text text-transparent">
                                    Elevate Your<br />
                                </span>
                                <span className="relative text-gray-800 dark:text-gray-200">
                                    College Events
                                    <span className="absolute -bottom-5 sm:-bottom-3 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0  h-1.5 w-24 bg-teal-500 rounded-lg "></span>
                                </span>
                            </h1>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-lg lg:text-2xl text-gray-600 dark:text-gray-300 font-light max-w-2xl"
                        >
                            Transform event planning from chaotic to seamless with our all-in-one management platform
                        </motion.p>

                        {/* Features List */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="grid grid-cols-2 gap-4 text-left"
                        >
                            {[
                                { title: "Collaborative Planning", icon: <FiUsers /> },
                                { title: "Smart Scheduling", icon: <FiCalendar /> },
                                { title: "Budget Tracking", icon: <FaSackDollar /> },
                                { title: "Real-time Updates", icon: <IoIosFlash /> }
                            ].map((feature, index) => (
                                <div key={feature.title} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <span className="text-xl lg:text-2xl text-teal-600 dark:text-teal-300">
                                        {feature.icon}
                                    </span>
                                    <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300 font-medium">
                                        {feature.title}
                                    </span>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="pt-8"
                        >
                            <button onClick={()=>navigate("/events")} className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 dark:from-teal-500 dark:to-emerald-500 text-white px-4 py-2 lg:px-8 lg:py-4 rounded-xl  font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 group mx-auto lg:mx-0 text-base lg:text-lg">
                                Start Planning Today
                                <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Right Animated Illustration */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative w-full h-96"
                >
                    <div className="absolute inset-0 bg-teal-100/50 dark:bg-teal-900/30 rounded-3xl transform rotate-3 -translate-y-4"></div>
                    <div className="absolute inset-0 bg-teal-200/30 dark:bg-teal-800/20 rounded-3xl transform -rotate-3 translate-y-4"></div>

                    <motion.div
                        animate={{
                            y: [-10, 10, -10],
                            rotate: [-1, 1, -1]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 backdrop-blur-sm"
                    >
                        <div className="absolute -top-4 right-6 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                            <FiCalendar className="inline-block" />
                            Featured Event
                        </div>

                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {[...Array(7)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="h-2 bg-teal-200 dark:bg-teal-700 rounded"
                                />
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="h-4 bg-teal-100 dark:bg-teal-900 rounded w-3/4"></div>
                            <div className="h-4 bg-teal-50 dark:bg-teal-800 rounded w-1/2"></div>

                            {[1, 2].map((item) => (
                                <motion.div
                                    key={item}
                                    whileHover={{ scale: 1.02 }}
                                    className="h-24 bg-teal-100 dark:bg-teal-900 rounded-lg p-3 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-sm"></div>
                                    <div className="flex gap-2 relative">
                                        <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                                            <FiUsers className="text-white" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-2 bg-teal-200 dark:bg-teal-700 rounded w-1/3"></div>
                                            <div className="h-2 bg-teal-200 dark:bg-teal-700 rounded"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            <div className="grid grid-cols-3 gap-4 mt-6">
                                {['120+ Events', '50 Colleges', '95% Rating'].map((text, index) => (
                                    <motion.div
                                        key={text}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 + 0.8 }}
                                        className="bg-white dark:bg-gray-700 p-3 rounded-lg text-center shadow-sm border border-gray-100"
                                    >
                                        <div className="text-2xl font-bold text-teal-600 dark:text-teal-300">
                                            {text.split(' ')[0]}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-300">
                                            {text.split(' ')[1]}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;