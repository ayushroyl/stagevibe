import React, { useState } from 'react';
import Img from '../assets/image.png';

const Rating = ({ performers = [], loggedIn }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleLeftArrowClick = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? performers.length - 1 : prevIndex - 1
    );
  };

  const handleRightArrowClick = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === performers.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500 flex flex-col items-center justify-center">
      {/* Header */}
      <header className="bg-gray-800 text-white w-full py-4 shadow-md fixed top-0">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">StageVibe - Rate Performers</h1>
          {loggedIn ? (
            <button className="bg-red-500 py-2 px-4 rounded hover:bg-red-600 transition">Logout</button>
          ) : (
            <a href="/login" className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-600 transition">Login</a>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex items-center justify-center mt-24 w-full">
        {/* Left arrow */}
        <button
          className="text-4xl text-white bg-gray-900 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition absolute left-6"
          onClick={handleLeftArrowClick}
        >
          &lt;
        </button>

        {/* Performer cards */}
        <div className="relative w-80 md:w-96 h-auto">
          {performers.length > 0 ? (
            performers.map((performer, index) => (
              <div
                key={performer.id}
                className={`absolute top-0 w-full bg-gradient-to-r from-yellow-400 to-pink-400 rounded-lg shadow-xl p-6 text-center transform transition-all duration-500 ${
                  activeIndex === index
                    ? 'opacity-100 scale-100 z-10'
                    : 'opacity-0 scale-95 z-0'
                }`}
              >
                <img
                  src={performer.image_url}
                  alt={performer.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold">{performer.name}</h2>
                <p className="text-sm mt-2">Avg Rating: {performer.rating} / 10</p>
                <p className="text-sm">Total Ratings: {performer.ratings_count}</p>

                {loggedIn ? (
                  <div className="mt-4">
                    <label htmlFor="rating" className="block mb-2 text-sm">
                      Rate (1-10):
                    </label>
                    <select
                      name="rating"
                      className="border border-gray-300 py-2 px-3 rounded w-full mb-2"
                    >
                      {[...Array(10).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>
                          {num + 1}
                        </option>
                      ))}
                    </select>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 transition">
                      Submit Rating
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 text-white">
                    Please{" "}
                    <a href="/login" className="text-blue-300 underline">
                      log in
                    </a>{" "}
                    to rate this performer.
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className='mb-44'>
            <img src="https://devfest.gdgpatna.com/assets/planning-KNpvy04k.gif" alt="comming soon" />
            <h2 className='text-3xl font-bold content-center text-green-900 text-secondary mt-4 mb-[-5%]'>Comming Soon</h2>
            </div>
          )}
        </div>

        {/* Right arrow */}
        <button
          className="text-4xl text-white bg-gray-900 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition absolute right-6"
          onClick={handleRightArrowClick}
        >
          &gt;
        </button>
      </main>

      {/* Footer */}
      {loggedIn && (
        <footer className="fixed bottom-4">
          <a
            href="#results"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            View Results
          </a>
        </footer>
      )}
    </div>
  );
};

export default Rating;
