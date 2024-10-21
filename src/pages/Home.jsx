import React, { useEffect, useState } from 'react';
import { ArrowRight, Music } from 'lucide-react';
import Modal from './Modal';
// Simulated imports for demo purposes
import backImg from '../assets/back3.jpg';
import animatedElement from '../assets/decorative-graphic.png';

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const heading = document.getElementById('hero-heading');
    heading.classList.add('animate__animated', 'animate__fadeInDown');
  }, []);

  return (
    <section className="relative min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${backImg})`,
          filter: 'brightness(0.7)'
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4 h-screen flex flex-col justify-center items-center">
        <div className="max-w-4xl mx-auto text-center space-y-6 p-4">
          {/* Main Heading */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white tracking-tight"
          >
            Fresher's Party 2024
          </h1>

          {/* Subheading */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-rose-700 mt-4">
            For MCA & BCA Fresher's
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Join us for an unforgettable day at the{' '}
            <span className="text-yellow-300 font-semibold">
              College Auditorium
            </span>{' '}
            filled with laughter, music, and performances.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a
              href="/booking"
              className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-500 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
            >
              Reserve Your Spot
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              onClick={() => setModalOpen(true)}
              className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-500 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
            >
              Apply for Performance
              <Music className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        {/* Animated Element */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-10 sm:bottom-20 animate-bounce">
          <img 
            src={animatedElement} 
            alt="Decorative element" 
            className="h-16 sm:h-24 opacity-80"
          />
        </div>
      </div>

      {/* Modal */}
      {modalOpen && <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />}
    </section>
  );
};

export default Home;