import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { motion } from "framer-motion";
import { Vortex } from "react-loader-spinner"; // Cool spinner
import database from "../firebase";

const Leaderboard = () => {
  const [performers, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformers = () => {
      const performersRef = ref(database, "performers");
      onValue(performersRef, (snapshot) => {
        const data = snapshot.val();
        const performersList = Object.values(data || {}).map((performer) => {
          const ratings = performer.ratings || {};
          const numberOfRatings = Object.keys(ratings).length;
          const totalRatings = Object.values(ratings).reduce(
            (sum, stars) => sum + stars,
            0
          );
          const avgRating =
            numberOfRatings > 0 ? totalRatings / numberOfRatings : 0;

          return {
            ...performer,
            avgRating: avgRating.toFixed(1),
          };
        });

        // Sort performers by average rating (highest to lowest)
        performersList.sort((a, b) => b.avgRating - a.avgRating);
        setPerformers(performersList);
        setLoading(false);
      });
    };

    fetchPerformers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#040024] to-[#0b0b22] text-white">
        <Vortex
          visible={true}
          height="100"
          width="100"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={["#ffffff", "#00f6ff", "#00d4ff", "#009fff", "#005dff"]}
        />
        <p className="text-lg font-semibold mt-4">Loading Leaderboard...</p>
      </div>
    );
  }

  const getBadge = (rank) => {
    if (rank === 1) return "bg-yellow-400 text-yellow-800";
    if (rank === 2) return "bg-gray-300 text-gray-700";
    if (rank === 3) return "bg-orange-400 text-orange-800";
    return "bg-gray-700 text-white";
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#040024] to-[#0b0b22] text-white p-6">
      <motion.h1
        className="text-center text-3xl font-bold mb-8 text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Performer Leaderboard
      </motion.h1>
      <motion.div
        className="max-w-4xl mx-auto space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {performers.map((performer, index) => (
          <motion.div
            key={performer.id}
            className={`flex items-center bg-gray-800 rounded-lg p-4 shadow-md transform transition-transform ${
              index === 0
                ? "scale-105"
                : index === 1
                ? "scale-102"
                : "scale-100"
            }`}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full mr-4 ${getBadge(
                index + 1
              )}`}
            >
              {index + 1}
            </div>
            <img
              src={performer.imgUrl}
              alt={performer.name}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold">{performer.name}</h3>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-400">{performer.avgRating}</p>
              <p className="text-sm text-gray-400">Average Rating</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Leaderboard;
