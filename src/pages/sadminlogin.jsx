import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import database from '../firebase'; // Import Firebase instance

const SAdminLogin = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  const [superAdmins, setSuperAdmins] = useState([]);
  const [superAdminUsername, setSuperAdminUsername] = useState(''); // Define superAdminUsername state
  const [superAdminPassword, setSuperAdminPassword] = useState(''); // Define superAdminPassword state
  const [error, setError] = useState(''); // Define error state

  // Fetch super admin data from Firebase when the component mounts
  useEffect(() => {
    const superAdminsRef = ref(database, 'superAdmins'); // Reference superAdmins in the database

    const unsubscribe = onValue(superAdminsRef, (snapshot) => {
      const data = snapshot.val();
      setSuperAdmins(data ? Object.values(data) : []); // Set superAdmins from Firebase data
    });

    return () => unsubscribe(); // Clean up the subscription on component unmount
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    setError(''); // Reset error message

    // Check for matching super admin credentials
    const superAdmin = superAdmins.find(
      (admin) => admin.username === superAdminUsername && admin.password === superAdminPassword
    );

    if (superAdmin) {
      // If super admin is found, save their username to localStorage
      localStorage.setItem('currentSuperAdmin', JSON.stringify({ username: superAdmin.username }));
      navigate('/superadmin'); // Redirect to super admin dashboard
    } else {
      setError('Invalid username or password'); // Set error message for invalid credentials
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 text-white mb-28 p-8 rounded-2xl shadow-lg w-auto max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Super Admin Login</h2>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>} {/* Display error messages */}

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
            <label htmlFor="superAdminPassword" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="superAdminPassword"
              value={superAdminPassword}
              onChange={(e) => setSuperAdminPassword(e.target.value)} // Update password state
              required
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-black font-semibold rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Back to Admin Login */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">Back to Admin Login?</p>
          <Link
            to="/adminlogin"
            className="text-teal-400 hover:text-teal-500 font-medium transition duration-300"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SAdminLogin;
