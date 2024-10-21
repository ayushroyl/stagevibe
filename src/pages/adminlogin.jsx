import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import navigation hooks
import { ref, onValue } from 'firebase/database';
import database from '../firebase'; // Import Firebase instance

const AdminLogin = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  const [admins, setAdmins] = useState([]);
  const [adminUsername, setAdminUsername] = useState(''); // Define adminUsername state
  const [adminPassword, setAdminPassword] = useState(''); // Define adminPassword state
  const [error, setError] = useState(''); // Define error state

  // Fetch admin data from Firebase when the component mounts
  useEffect(() => {
    const adminsRef = ref(database, 'admins');

    const unsubscribe = onValue(adminsRef, (snapshot) => {
      const data = snapshot.val();
      setAdmins(data ? Object.values(data) : []); // Set admins from Firebase data
    });

    return () => unsubscribe(); // Clean up the subscription on component unmount
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    setError(''); // Reset error message

    // Check for matching admin credentials
    const admin = admins.find((admin) => admin.username === adminUsername && admin.password === adminPassword);

    if (admin) {
      // If admin is found, save their username to localStorage
      localStorage.setItem('currentAdmin', JSON.stringify({ username: admin.username })); // Save admin info
      navigate('/admin'); // Redirect to admin dashboard
    } else {
      setError('Invalid username or password'); // Set error message for invalid credentials
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 rounded-2xl mb-28 text-white p-8 shadow-lg w-auto max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Admin Login</h2>
        
        {error && <p className="text-red-400 text-center mb-4">{error}</p>} {/* Display error messages */}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)} // Update username state
              required
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)} // Update password state
              required
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Are you a SuperAdmin? */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">Are you a SuperAdmin?</p>
          <Link
            to="/sadminlogin"
            className="text-teal-400 hover:text-teal-500 font-medium transition duration-300"
          >
            Super Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
