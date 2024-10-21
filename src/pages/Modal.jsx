import React, { useState } from 'react';

const Modal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    classN: 'Choose',
    rollNo: '',
    mobileNo: '',
    act: 'Choose',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); // Reset error on change
  };

  const validateMobileNumber = (number) => {
    const regex = /^[0-9]{10}$/; // Simple validation for a 10-digit number
    return regex.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading on form submit

    // Validate mobile number
    if (!validateMobileNumber(formData.mobileNo)) {
      setLoading(false); // Reset loading on error
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        roll_number: formData.rollNo,
        phone: formData.mobileNo,
        class: formData.classN,
        role: formData.act
      };

      // Send form data to backend API
      const response = await fetch('https://admin-panel-tan-three.vercel.app/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        setLoading(false); // Reset loading on success
        setSubmitted(true); // Show thank you message
      } else if (response.status === 409) {
        setLoading(false); // Reset loading on conflict error
        setError('This entry already exists.');
      } else {
        throw new Error('Something went wrong while submitting the form');
      }
    } catch (error) {
      setLoading(false); // Reset loading on failure
      setError('Failed to submit the form. Please try again later.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl text-white shadow-lg w-auto max-w-md relative" onClick={(e) => e.stopPropagation()}>
        {submitted ? (
          <div className="flex flex-col items-center justify-center text-center">
            {/* Animated Checkmark */}
            <div className="checkmark-container mb-4">
              <svg className="checkmark w-16 h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-green-400 mb-4">Thank You!</h2>
            <p className="text-gray-300 font-semibold">Thank you for applying to participate in the Fresher's Party. We will contact you soon.</p>
            <button onClick={onClose} className="mt-4 py-2 px-4 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-600 transition duration-300">
              OK
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-extrabold mb-4">Apply for Performance</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            {loading ? (
              <div className="flex justify-center mb-4">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-300 h-12 w-12"></div>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <select
                  name="classN"
                  value={formData.classN}
                  onChange={handleChange}
                  className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="Choose">Choose Your Class</option>
                  <option value="BCA1">BCA1</option>
                  <option value="BCA2">BCA2</option>
                  <option value="BCA3">BCA3</option>
                  <option value="MCA1">MCA1</option>
                  <option value="MCA3">MCA3</option>
                  <option value="Other">Other Departments</option>
                </select>
                <input
                  type="number"
                  name="rollNo"
                  placeholder="Roll No."
                  value={formData.rollNo}
                  onChange={handleChange}
                  required
                  className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="tel"
                  name="mobileNo"
                  placeholder="10-Digit Mobile No."
                  value={formData.mobileNo}
                  onChange={handleChange}
                  required
                  className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <select
                  name="act"
                  value={formData.act}
                  onChange={handleChange}
                  className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="Choose">Choose Your Act</option>
                  <option value="Dance">Dance</option>
                  <option value="Singing">Singing</option>
                  <option value="Instrumental Music">Instrumental Music</option>
                  <option value="Drama">Drama</option>
                  <option value="Stand-up Comedy">Stand-up Comedy</option>
                  <option value="Other">Other (Show Your Talent)</option>
                </select>
                <button type="submit" className="mt-4 py-2 px-4 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-600 transition duration-300">
                  Submit
                </button>
                <button type="button" onClick={onClose} className="mt-4 py-2 px-4 bg-gray-600 text-white font-semibold rounded-full hover:bg-gray-700 transition duration-300">
                  Cancel
                </button>
              </>
            )}
          </form>
        )}
      </div>  

      <style jsx>{`
        .loader {
          border-color: #fbbf24;
          border-top-color: #000;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .checkmark-container {
          width: 56px;
          height: 56px;
        }

        .checkmark {
          width: 100%;
          height: 100%;
          animation: draw 0.8s ease-out forwards;
        }

        .checkmark-circle {
          stroke: #4CAF50;
          stroke-width: 2.5;
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: stroke 0.6s ease-out forwards;
        }

        .checkmark-check {
          stroke: #4CAF50;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s 0.6s ease-out forwards;
        }

        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes draw {
          0% {
            stroke-dashoffset: 48;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;
