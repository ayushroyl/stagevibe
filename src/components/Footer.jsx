import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Github, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-r from-[#040024] to-[#0b0b22] font-medium text-white py-6">
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-pink-500/20 rounded-full filter blur-[80px]" />
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-purple-600/20 rounded-full filter blur-[80px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container my-1 mx-auto relative z-10 flex-col items-center text-center">
        {/* Logo and copyright */}
        <div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-indigo-300">
            StageVibe © {currentYear}
          </h3>
          <p className="text-sm text-indigo-200">All Rights Reserved</p>
          <p className="text-sm text-indigo-200 mt-2">
            Made with <span className="text-red-500">❤</span> by <a className='text-blue-400' href='https://instagram.com/ayushroyl'>Ayush</a>
          </p>
        </div>

        {/* Connect with Us */}
        <div>
          <h4 className="text-md font-semibold mb-4 text-pink-300">Connect with Us</h4>
          <div className="flex justify-center space-x-4">
            {[Instagram, Linkedin, Github, Twitter].map((Icon, index) => (
              <motion.a
                key={index}
                href="#"
                className="text-indigo-200 hover:text-pink-300 transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* About StageVibe */}
        <div>
          <h4 className="text-md font-semibold mb-4 text-pink-300">About StageVibe</h4>
          <p className="text-sm text-indigo-200 mb-2">
            StageVibe is dedicated to creating unforgettable experiences for students through engaging events and activities.
          </p>
          <p className="text-sm text-indigo-200 mb-2">
            Join us as we celebrate creativity, talent, and collaboration within our community.
          </p>
          <p className="text-sm text-indigo-200 mb-2">
            For business inquiries or collaborations, reach out to us at: ayushroy.business.contact@gmail.com
          </p>
          <p className="text-sm text-indigo-200">
            Connect with us on social media for updates on our events!
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;