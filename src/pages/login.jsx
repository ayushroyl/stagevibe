import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import database from '../firebase';

const Login = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const usersRef = ref(database, 'voters');

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      setUsers(data ? Object.values(data) : []);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem(
        'currentVoter',
        JSON.stringify({ username: user.username, id: user.id })
      );
      navigate('/rating');
    } else {
      setError('Invalid username or password');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 w-auto max-w-md text-white">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-teal-400">
          Welcome to StageVibe
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative font-bold">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
            />
          </div>
          <div className="relative font-bold">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 mt-6 text-white font-semibold rounded-lg shadow-md transition duration-300 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 font-medium">
            Forgot Username or Password?
            <Link
              to="https://wa.me/917255071097?text=forgot+my+id+pass"
              className="text-teal-400 hover:text-teal-500 font-medium transition duration-300"
            >
              <br />
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;