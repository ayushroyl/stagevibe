import React, { useEffect, useRef } from 'react';
import { saveAs } from 'file-saver'; // To download QR code
import { useLocation } from 'react-router-dom'; // To access navigation state
import gpayIcon from '../assets/gpay-icon.png'; // Add path to UPI icons
import phonepeIcon from '../assets/phonepe-icon.png';
import paytmIcon from '../assets/paytm-icon.png';
import QRious from 'qrious'; // For generating QR code

const Payment = () => {
  const location = useLocation(); // Get location object to access state
  const { upiUrl } = location.state || {}; // Retrieve UPI URL from the passed state
  const canvasRef = useRef(null); // Ref to the canvas element for QR code

  useEffect(() => {
    if (upiUrl && canvasRef.current) {
      // Generate QR code using QRious
      new QRious({
        element: canvasRef.current,
        value: upiUrl,
        size: 256,
      });
    }
  }, [upiUrl]);

  // Download QR code function
  const downloadQR = () => {
    const canvas = canvasRef.current; // Access the canvas
    canvas.toBlob((blob) => {
      saveAs(blob, 'stagevibe-qr.png'); // Download the QR code as PNG
    });
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-b from-[#0b0b22] to-[#0f1a3d] text-white">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-center text-2xl font-bold mb-6">StageVibe Payment</h1>

        {upiUrl ? (
          <div className="text-center relative">
            {/* Display QR Code */}
            <div className="relative inline-block">
              <canvas ref={canvasRef} className="mx-auto mb-4" />
            </div>

            <p className="text-sm mb-4">Scan this QR code to pay via any UPI app.</p>
            {/* Accepted Payment Message */}
            <p className="text-lg mb-2 font-bold text-gray-300">Accepted payments:</p>
            <div className="flex justify-center items-center space-x-4 mb-6">
              {/* UPI Icons */}
              <img src={gpayIcon} alt="Google Pay" className="w-10 h-10" />
              <img src={phonepeIcon} alt="PhonePe" className="w-10 h-10" />
              <img src={paytmIcon} alt="Paytm" className="w-10 h-10" />
            </div>
            <p className="mb-6 text-gray-400">Pay using Google Pay, PhonePe, Paytm, or any UPI app.</p>

            {/* Download QR Code Button */}
            <button
              onClick={downloadQR}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Download QR Code
            </button>
          </div>
        ) : (
          <p className="text-center text-yellow-400">Book your seat First <a className='text-blue-700' href='https://stagevibe.vercel.app/booking'>click here</a></p>
        )}
      </div>
    </div>
  );
};

export default Payment;