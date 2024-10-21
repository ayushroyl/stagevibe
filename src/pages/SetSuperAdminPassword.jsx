import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, update } from 'firebase/database';
import database from '../firebase'; // Import Firebase instance

const SetSuperAdminPassword = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [superAdminUsername, setSuperAdminUsername] = useState(''); // State for username
  const [newPassword, setNewPassword] = useState(''); // State for password
  const [confirmPassword, setConfirmPassword] = useState(''); // State for password confirmation
  const [error, setError] = useState(''); // State for error messages
  const [success, setSuccess] = useState(''); // State for success message

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    setError(''); // Clear previous errors
    setSuccess(''); // Clear success message

    // Basic validation for password match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Basic validation for empty username
    if (!superAdminUsername) {
      setError('Username is required');
      return;
    }

    // Update the super admin username and password in Firebase
    const superAdminRef = ref(database, 'superAdmins/superadmin'); // Reference to 'superAdmins' node
    update(superAdminRef, { username: superAdminUsername, password: newPassword })
      .then(() => {
        setSuccess('Credentials successfully updated!');
        navigate('/superadmin'); // Redirect to super admin dashboard
      })
      .catch((error) => {
        setError('Failed to update credentials: ' + error.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 text-white mb-28 p-8 rounded-2xl shadow-lg w-auto max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Set Super Admin Credentials</h2>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        {success && <p className="text-green-400 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="superAdminUsername" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="superAdminUsername"
              value={superAdminUsername}
              onChange={(e) => setSuperAdminUsername(e.target.value)} // Update username state
              required
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} // Update password state
              required
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your new password"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
              required
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your new password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-black font-semibold rounded-md hover:bg-blue-600 transition duration-300"
          >
            Set Credentials
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetSuperAdminPassword;
