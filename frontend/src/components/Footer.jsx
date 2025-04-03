import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="hidden md:block bg-gray-800 text-white py-12 text-center relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex justify-center gap-6">
          {['Twitter', 'LinkedIn', 'GitHub'].map((social, index) => (
            <motion.a
              key={index}
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ y: -2 }}
            >
              {social}
            </motion.a>
          ))}
        </div>
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} PlanItNow. All rights reserved.<br />
          Crafted with ❤️ by Arpit Singh for the future of education
        </p>
      </div>
    </footer>
  );
};

export default Footer;
