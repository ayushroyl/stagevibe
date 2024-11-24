import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import database from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa'; // For stars
import { Vortex } from 'react-loader-spinner'; // Cool spinner

const Rating = () => {
  const [activePerformers, setActivePerformers] = useState([]);

  // Fetch active performers
  useEffect(() => {
    const performersRef = ref(database, 'performers');
    onValue(performersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const active = Object.values(data).filter((performer) => performer.isActive);
        setActivePerformers(active);
      } else {
        setActivePerformers([]);
      }
    });
  }, []);

  // Handle rating submission
  const handleRating = (performerId, rating) => {
    const performerRef = ref(database, `performers/${performerId}`);
    onValue(performerRef, (snapshot) => {
      const performer = snapshot.val();
      if (performer) {
        const newTotalRatings = (performer.totalRatings || 0) + 1;
        const newTotalStars = (performer.totalStars || 0) + rating;
        const newAvgRating = newTotalStars / newTotalRatings;

        update(performerRef, {
          totalRatings: newTotalRatings,
          totalStars: newTotalStars,
          avgRating: newAvgRating,
        });
      }
    });
  };

  // Framer Motion Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#040024] to-[#0b0b22] p-6 flex flex-col items-center">
      <motion.h2
        className="text-4xl font-bold text-white mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      >
        Performer Ratings
      </motion.h2>

      {activePerformers.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-8">
          <AnimatePresence>
            {activePerformers.map((performer) => (
              <motion.div
                key={performer.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="w-80 bg-gray-800 text-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300 overflow-hidden"
              >
                {/* Performer Image */}
                <img
                  src={performer.imgUrl}
                  alt={performer.name}
                  className="w-full h-48 object-cover"
                />

                {/* Performer Details */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    {performer.name}
                  </h3>

                  {/* Rating Input */}
                  <div className="flex justify-center mb-4 space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                        className={`text-3xl cursor-pointer ${
                          star <= (performer.userRating || 0) ? 'text-yellow-400' : 'text-gray-500'
                        }`}
                        onClick={() => handleRating(performer.id, star)}
                      >
                        <FaStar />
                      </motion.button>
                    ))}
                  </div>

                  {/* Display Ratings */}
                  <div className="text-center">
                    <p className="text-lg font-medium text-yellow-400">
                      {performer.avgRating?.toFixed(1) || 0} / 5.0
                    </p>
                    <p className="text-sm text-gray-400">
                      {performer.totalRatings || 0} Ratings
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <Vortex
            visible={true}
            height="120"
            width="120"
            ariaLabel="vortex-loading"
            wrapperClass="vortex-wrapper"
            colors={['#ffffff', '#4fa94d', '#ffcc00', '#cc0000']}
          />
          <p className="mt-4 text-gray-300 text-lg text-center">
            Waiting for performers to start performing...
          </p>
        </div>
      )}

      {/* Final Results Button */}
      <motion.div
        className="mt-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
      >
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition transform hover:scale-110"
          onClick={() => {
            // Placeholder logic for leaderboard navigation
            console.log('Navigate to leaderboard');
          }}
        >
          View Final Results
        </button>
      </motion.div>
    </div>
  );
};

export default Rating;
