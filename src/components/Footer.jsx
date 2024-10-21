import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Github, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-t from-indigo-900 via-purple-900 to-pink-800 text-white py-12">
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full filter blur-[100px]" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full filter blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and copyright */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-indigo-300">
              StageVibe © {currentYear}
            </h3>
            <p className="text-indigo-200">All Rights Reserved</p>
            <p className="text-indigo-200 mt-2">
              Made with <span className="text-red-500">❤</span> by Ayush
            </p>
          </div>

          {/* Connect with Us */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4 text-pink-300">Connect with Us</h4>
            <div className="flex justify-center space-x-4">
              {[Instagram, Linkedin, Github, Twitter].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-indigo-200 hover:text-pink-300 transition-colors duration-300"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* About StageVibe */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold mb-4 text-pink-300">About StageVibe</h4>
            <p className="text-indigo-200 mb-2">
              StageVibe is dedicated to creating unforgettable experiences for students through engaging events and activities.
            </p>
            <p className="text-indigo-200 mb-2">
              Join us as we celebrate creativity, talent, and collaboration within our community.
            </p>
            <p className="text-indigo-200 mb-2">
              For business inquiries or collaborations, reach out to us at: ayushroy.business.contact@gmail.com
            </p>
            <p className="text-indigo-200">
              Connect with us on social media for updates on our events!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;