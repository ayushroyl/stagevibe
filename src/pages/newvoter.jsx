import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import database from '../firebase'; // Import Firebase instance

const NewVoter = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    // Validate inputs
    if (!username || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      // Push new voter data to Firebase
      const voterRef = ref(database, 'voters');
      await push(voterRef, { username, password });
      setSuccess('Voter added successfully!');
      setUsername('');
      setPassword('');
    } catch (err) {
      setError('Error adding voter. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 w-auto max-w-md text-white">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-teal-400">
          Add New Voter
        </h2>
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div className="relative font-bold">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
            />
          </div>

          {/* Password Input */}
          <div className="relative font-bold">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
            />
          </div>

          {/* Add Voter Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 text-white font-semibold rounded-lg shadow-md bg-teal-500 hover:bg-teal-600 transition duration-300"
          >
            Add Voter
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewVoter;
