import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import hlogo from '../assets/logo-header.svg';

const Nav = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "about", isScroll: true },
    { label: "Agenda", path: "agenda", isScroll: true },
    { label: "Photos", path: "photos", isScroll: true },
    { label: "Team", path: "team", isScroll: true },
    { label: "Book Seat", path: "/booking" },
    { label: "Rating", path: "/rating" },
    { label: "Login", path: "/login" }
  ];

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  return (
    <>
      <header  className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#040024] to-[#0b0b22] backdrop-blur-lg p-4">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center relative">
        <Link to="/" className="flex items-center text-white text-2xl font-serif font-semibold cursor-pointer">
          <motion.img 
            src={hlogo} 
            alt="StageVibe Logo" 
            className="mr-2 h-auto w-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            StageVibe
          </motion.span>
        </Link>

        <motion.button
          className="md:hidden text-white text-2xl focus:outline-none cursor-pointer"
          onClick={toggleMobileMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </motion.button>

        <nav className="hidden md:flex md:items-center md:gap-4">
          <ul className="md:text-lg flex flex-row gap-4">
            {navItems.map((item, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.isScroll ? (
                  <ScrollLink
                    to={item.path}
                    smooth={true}
                    offset={-80}
                    duration={500}
                    className="nav-link bg-transparent hover:bg-white hover:text-black font-semibold transition-all duration-300 rounded-md py-2 px-4 tracking-normal block cursor-pointer"
                  >
                    {item.label}
                  </ScrollLink>
                ) : (
                  <Link
                    to={item.path}
                    className="nav-link bg-transparent hover:bg-white hover:text-black font-semibold transition-all duration-300 rounded-md py-2 px-4 tracking-normal block cursor-pointer"
                  >
                    {item.label}
                  </Link>
                )}
              </motion.li>
            ))}
          </ul>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 w-full bg-gradient-to-b from-[#040024] to-[#0b0b22] rounded-b-lg z-30"
            >
              <ul className="text-center flex flex-col space-y-4 p-6">
                {navItems.map((item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.isScroll ? (
                      <ScrollLink
                        to={item.path}
                        smooth={true}
                        offset={-80}
                        duration={500}
                        className="text-white font-semibold transition-all duration-300 hover:bg-white hover:text-black py-2 px-4 rounded-md block cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </ScrollLink>
                    ) : (
                      <Link
                        to={item.path}
                        className="text-white font-semibold transition-all duration-300 hover:bg-white hover:text-black py-2 px-4 rounded-md block cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
      <main style={{ paddingTop: `${headerHeight}px` }}>
        {children}
      </main>
    </>
  );
};

export default Nav;