import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import navigation hooks
import { ref, onValue } from 'firebase/database';
import database from '../firebase'; // Import Firebase instance

const Login = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState(''); // Define adminUsername state
  const [password, setPassword] = useState(''); // Define adminPassword state
  const [error, setError] = useState(''); // Define error state
  const [loading, setLoading] = useState(false);

  // Fetch admin data from Firebase when the component mounts
  useEffect(() => {
    const usersRef = ref(database, 'users');

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      setUsers(data ? Object.values(data) : []); // Set users from Firebase data
    });

    return () => unsubscribe(); // Clean up the subscription on component unmount
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    setError(''); // Reset error message

    // Check for matching admin credentials
    const user = users.find((user) => user.username === username && user.password === password);

    if (user) {
      // If admin is found, save their username to localStorage
      localStorage.setItem('currentUser', JSON.stringify({ username: user.username })); // Save admin info
      navigate('/rating'); // Redirect to admin dashboard
    } else {
      setError('Invalid username or password'); // Set error message for invalid credentials
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl mb-28 shadow-lg p-8 w-auto max-w-md text-white">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-teal-400">
          Welcome to StageVibe
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
            />
            <span className="absolute top-1/2 right-4 transform -translate-y-1/2 text-teal-400">
              <i className="fas fa-user"></i>
            </span>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
            />
            <span className="absolute top-1/2 right-4 transform -translate-y-1/2 text-teal-400">
              <i className="fas fa-lock"></i>
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={`w-full py-3 mt-6 text-white font-semibold rounded-lg shadow-md transition duration-300 ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-teal-500 hover:bg-teal-600'
              }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
        </form>

        {/* Are you an admin? */}
        <div className="mt-8 text-center">
          <p className='text-gray-400'>Forgot Username or Password?
            <Link
              to="https://wa.me/917255071097?text=forgot+my+id+pass"
              className="text-teal-400 hover:text-teal-500 font-medium transition duration-300"
            >
              <><br /></>Contact Us
            </Link> </p>
          <p className="text-gray-400">Are you an Admin?</p>
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

export default Login;