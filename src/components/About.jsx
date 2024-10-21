import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-25% 0px' });

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 20px rgba(236, 72, 153, 0.5)",
    },
    vibrate: {
      x: [-2, 2, -2, 2, -2, 2, 0],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: 'loop'
      },
    },
  };

  const glowVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
      }
    }
  };

  return (
    <section
      id="about"
      className="relative py-8 md:py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Effects */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full opacity-20"
        initial="hidden"
        animate="visible"
        variants={glowVariants}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500 rounded-full filter blur-[100px]" />
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-600 rounded-full filter blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400 rounded-full filter blur-[100px]" />
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10" ref={ref}>
        <div className="max-w-5xl mx-auto backdrop-blur-sm bg-black/30 rounded-3xl p-6 md:p-10 shadow-2xl border border-pink-500/10">
          {/* Animated Heading */}
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={textVariants}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Fresher's Party 2024
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 font-medium"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={textVariants}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Hosted by <span className="text-pink-300 font-semibold">Nalanda College</span>
            <br className="md:hidden" /> 
            <span className="hidden md:inline"> - </span>
            <span className="text-indigo-300 font-semibold">MCA & BCA Departments</span>
          </motion.p>

          {/* Content */}
          <motion.div
            className="text-left space-y-6 md:space-y-8"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={textVariants}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <p className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              🎉 A Night to Remember at the College Auditorium
            </p>
            
            <div className="space-y-4 md:space-y-6 bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-pink-500/10">
              <p className="text-base md:text-lg lg:text-xl leading-relaxed text-indigo-100">
                Step into a magical evening filled with energy, fun, and the spirit of celebration. The Fresher's Party 2024 is set to bring together our talented and enthusiastic freshers in a grand showcase of talent, music, and camaraderie.
              </p>
              
              <p className="text-base md:text-lg lg:text-xl leading-relaxed text-indigo-100">
                Whether you're performing, cheering on your friends, or simply enjoying the vibe, this is your moment to shine. Get ready for a night of exciting performances, surprise acts, and the much-awaited performer rating system through StageVibe!
              </p>
              
              <p className="text-base md:text-lg lg:text-xl leading-relaxed text-indigo-100">
                Don't miss the opportunity to be a part of this amazing night where the entire college will come together to celebrate the start of your incredible journey!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-xl bg-black/30 backdrop-blur-sm border border-pink-500/20 hover:border-pink-500/40 transition-colors duration-300">
                <p className="text-lg md:text-xl font-semibold text-center flex items-center justify-center gap-2">
                  <Calendar className="text-yellow-300" />
                  <span className="text-pink-300">Date:</span> 
                  <span className="text-indigo-100">To be announced</span>
                </p>
              </div>
              <div className="p-4 rounded-xl bg-black/30 backdrop-blur-sm border border-pink-500/20 hover:border-pink-500/40 transition-colors duration-300">
                <p className="text-lg md:text-xl font-semibold text-center flex items-center justify-center gap-2">
                  <MapPin className="text-yellow-300" />
                  <span className="text-pink-300">Venue:</span>
                  <span className="text-indigo-100">Auditorium, Nalanda College</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Animated Button */}
          <motion.div className="mt-8 md:mt-10 text-center">
            <motion.a
              href="/booking"
              variants={buttonVariants}
              whileHover={["hover", "vibrate"]}
              className="inline-block py-3 md:py-4 px-6 md:px-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg md:text-xl font-semibold rounded-full transition duration-300 ease-in-out shadow-lg hover:from-pink-600 hover:to-purple-700 transform hover:-translate-y-1 border border-pink-400/20"
            >
              Book Your Seat Now
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;