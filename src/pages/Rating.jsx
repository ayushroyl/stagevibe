import React, { useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { Vortex } from 'react-loader-spinner';
import database from '../firebase';

const Rating = () => {
  const [activePerformer, setActivePerformer] = useState(null);
  const [voter, setVoter] = useState(null);
  const [rating, setRating] = useState(0);
  const [numberOfVoters, setNumberOfVoters] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [success, setSuccess] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    const fetchVoter = () => {
      const currentVoter = JSON.parse(localStorage.getItem('currentVoter'));
      if (!currentVoter) {
        alert('Please log in first!');
        window.location.href = '/login';
      }
      setVoter(currentVoter.username);
    };

    const fetchActivePerformer = () => {
      const performersRef = ref(database, 'performers');
      onValue(performersRef, (snapshot) => {
        const performers = snapshot.val();
        const activePerformer = Object.values(performers || {}).find(
          (performer) => performer.isActive
        );

        if (activePerformer) {
          setSuccess('');
          setRating(0);
          setHoveredStar(0);
          setActivePerformer(activePerformer);
          const ratings = activePerformer.ratings || {};
          setNumberOfVoters(Object.keys(ratings).length);
          setTotalVotes(
            Object.values(ratings).reduce((sum, stars) => sum + stars, 0)
          );
        } else {
          setActivePerformer(null);
          setNumberOfVoters(0);
          setTotalVotes(0);
        }
      });
    };

    fetchVoter();
    fetchActivePerformer();
  }, []);

  const handleRating = async (starCount) => {
    if (!activePerformer || !voter) return;

    const voterRef = ref(database, `voters/${voter}`);
    const performerRef = ref(database, `performers/${activePerformer.id}`);
    const newRating = {
      ...activePerformer.ratings,
      [voter]: starCount,
    };

    try {
      await update(voterRef, {
        [`ratings/${activePerformer.id}`]: starCount,
      });

      await update(performerRef, { ratings: newRating });

      setRating(starCount);
      setSuccess('Thank you for Rate!');
    } catch (err) {
      console.error('Error saving rating:', err);
      alert('An error occurred while submitting your rating.');
    }
  };

  if (!activePerformer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-black text-white">
        <Vortex
          visible={true}
          height="100"
          width="100"
          ariaLabel="vortex-loading"
          colors={['#fbb034', '#ffdd00', '#ff4f81', '#4db3ff', '#4bffa5']}
        />
        <p className="text-lg font-semibold mt-4">Waiting for a performer...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen items-center justify-center bg-gradient-to-r from-[#040024] to-[#0b0b22] p-6">
      {/* Top Heading */}
      <h1 className="text-3xl font-bold text-white mb-4 mt-0 text-center">Performer Rating</h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="w-full mb-10 max-w-sm bg-gray-800 rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500"
      >
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <img
            src={activePerformer.imgUrl}
            alt={activePerformer.name}
            className="w-full h-64 object-cover rounded-t-3xl"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-t-3xl">
            <h2 className="text-xl font-bold text-white">
              {activePerformer.name}
            </h2>
            <p className="text-sm italic text-gray-300">
              {activePerformer.tagline || ''}
            </p>
          </div>
        </motion.div>
        <div className="p-6 space-y-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.span
                key={star}
                className={`text-4xl cursor-pointer transition-transform ${
                  hoveredStar >= star || rating >= star
                    ? 'text-yellow-400 scale-125'
                    : 'text-gray-300'
                }`}
                whileHover={{ scale: 1.3 }}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
              >
                <FaStar />
              </motion.span>
            ))}
          </div>
          <p className="text-center font-bold text-white">
            Total Raters: <span className="font-semibold">{numberOfVoters}</span>
          </p>
          <p className="text-center font-bold text-white">
            Average Rating:{' '}
            <span className="font-bold text-yellow-400">
              {numberOfVoters ? (totalVotes / numberOfVoters).toFixed(1) : '-'} / 5.0
            </span>
          </p>
          {success && (
            <motion.p
              className="text-center text-green-500 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {success}
            </motion.p>
          )}
        </div>
      </motion.div>
      {/* Leaderboard Button */}
      <motion.a
    href="/leaderboard"
    className="mt-6 px-8 py-3 text-lg text-center justify-start font-bold text-white bg-gradient-to-r from-gray-500 to-yellow-300 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
    whileHover={{ scale: 1.1 }}
  >
    View Leaderboard
  </motion.a>

    </div>
  );
};

export default Rating;
