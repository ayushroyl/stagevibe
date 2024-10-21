import React, { useEffect, useState } from 'react';
import { ArrowRight, Music, Star } from 'lucide-react';
import Modal from './Modal';

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const heading = document.getElementById('hero-heading');
    heading.classList.add('animate__animated', 'animate__fadeInDown');
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {[...Array(50)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-yellow-200 animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random(),
              transform: `scale(${Math.random() * 0.5 + 0.5})`,
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div id="home" className="relative z-10 container mx-auto px-4 h-screen flex flex-col justify-center items-center">
        <div className="max-w-4xl mx-auto text-center space-y-6 p-4">
          {/* Main Heading */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-6xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 tracking-tight"
          >
            Fresher's Party 2024
          </h1>

          {/* Subheading */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-pink-300 mt-4">
            For MCA & BCA Fresher's
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Join us for an unforgettable night at the{' '}
            <span className="text-yellow-300 font-semibold">
              College Auditorium
            </span>{' '}
            filled with music, dance, and new friendships.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a
              href="/booking"
              className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
            >
              Reserve Your Spot
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              onClick={() => setModalOpen(true)}
              className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
            >
              Apply for Performance
              <Music className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        {/* Animated Element */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-10 sm:bottom-18 animate-bounce">
          <div className="w-16 h-14 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <Star className="text-yellow-200 w-10 h-10 sm:w-16 sm:h-16" />
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />}
    </section>
  );
};

export default Home;