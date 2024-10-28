import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Booking.css';
import { ref, set, push, onValue, remove } from 'firebase/database';
import database from '../firebase'; // Import Firebase instance


const rows = [
  //{ row: 'A', seats: 10 },
// { row: 'B', seats: 10 },
  { row: 'C', seats: 12 },
  { row: 'D', seats: 12 },
  { row: 'E', seats: 12 },
  { row: 'F', seats: 14 },
  { row: 'G', seats: 14 },
  { row: 'H', seats: 16 },
  { row: 'I', seats: 16 },
  { row: 'J', seats: 16 },
  { row: 'K', seats: 18 },
  // Upper floor curved rows
  { row: 'L', seats: 17, isCurved: true },  // Curved row 1
  { row: 'M', seats: 18, isCurved: true }   // Curved row 2
];

const Booking = () => {
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [userDetails, setUserDetails] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [mobileError, setMobileError] = useState('');
  const [rollError, setRollError] = useState('');
  const [currentSeat, setCurrentSeat] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef(null);
  const scrollInterval = useRef(null);
  const isManualScroll = useRef(false);
  const autoScrollTimeout = useRef(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [pendingSeats, setPendingSeats] = useState([]);   
  const navigate = useNavigate();


  // Fetch booked and pending seats from Firebase
  useEffect(() => {
    const seatsRef = ref(database, 'users');
    onValue(seatsRef, (snapshot) => {
      const booked = [];
      const pending = [];
      snapshot.forEach((childSnapshot) => {
        const seatData = childSnapshot.val();
        if (seatData.approved) {
          booked.push(seatData.seatNo.toUpperCase());
        } else {
          pending.push(seatData.seatNo.toUpperCase());
        }
      });
      setBookedSeats(booked);
      setPendingSeats(pending);
    });
  }, []);
  
  const handleSeatSelection = (seat) => {
    if (!isSeatBooked(seat) && !isSeatPending(seat)) {
      if (selectedSeats.has(seat)) {
        // Deselect seat and update the total amount
        const seatClass = userDetails[seat]?.class;
        let seatPrice = 349; // Default price
  
        // Adjust price based on the class
        if (seatClass === 'BCA1') {
          seatPrice = 249;
        } else if (['BCA2', 'BCA3'].includes(seatClass)) {
          seatPrice = 299;
        }
  
        setSelectedSeats((prev) => {
          const newSelectedSeats = new Set(prev);
          newSelectedSeats.delete(seat);
          return newSelectedSeats;
        });
        setTotalAmount((prev) => prev - seatPrice);
      } else {
        // Select seat and open popup for user details
        setCurrentSeat(seat);
        setIsPopupOpen(true);
      }
    }
  };
  

  const validateInput = () => {
    let isValid = true;

    // Mobile number validation
    const mobile = userDetails[currentSeat]?.mobile || '';
    if (mobile.length !== 10) {
      setMobileError('Mobile number must be 10 digits');
      isValid = false;
    }

    // Roll number validation
    const roll = userDetails[currentSeat]?.roll || '';
    if (roll.length > 3) {
      setRollError('Roll number cannot be more than 3 digits');
      isValid = false;
    }

    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [currentSeat]: {
        ...prevDetails[currentSeat],
        [name]: value,
      },
    }));
    // Reset error messages on input change
    if (name === "mobile") {
      setMobileError('');
    } else if (name === "roll") {
      setRollError('');
    }
};

const addSeatToBooking = () => {
  if (validateInput()) {
    let seatPrice = 349; // Default price

    // Determine the price based on the user's class
    if (userDetails[currentSeat]?.class === 'BCA1') {
      seatPrice = 249;
    } else if (['BCA2', 'BCA3'].includes(userDetails[currentSeat]?.class)) {
      seatPrice = 299;
    }

    // Update the selected seats and total amount
    if (currentSeat && userDetails[currentSeat]) {
      setSelectedSeats((prev) => new Set(prev).add(currentSeat));
      setTotalAmount((prev) => prev + seatPrice);
      setCurrentSeat('');
      setIsPopupOpen(false); // Close popup after adding
    }
  }
};
  


  const handleAddUser = () => {
    const usersRef = ref(database, 'users');
    selectedSeats.forEach(seat => {
      const newUserRef = push(usersRef);
      const newUser = {
        ...userDetails[seat],
        id: newUserRef.key,
        approved: false,
        added_by: 'self',
        seatNo: seat,
        paymentMode: 'online',
      };
      set(newUserRef, newUser);
    });
    setCurrentSeat('');
    setSelectedSeats(new Set());
    setTotalAmount(0);
  };

  const isSeatBooked = (seat) => {
    return bookedSeats.includes(seat);
  };

  const isSeatPending = (seat) => {
    return pendingSeats.includes(seat);
  };

  const renderSeat = (seat) => {
    const seatBooked = isSeatBooked(seat);
    const seatSelected = selectedSeats.has(seat);
    const seatPending = isSeatPending(seat);

    let seatClass = 'rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 ';
    if (seatBooked) {
      seatClass += 'bg-gray-500 border border-green-300';
    } else if (seatPending) {
      seatClass += 'bg-yellow-600 text-white border border-green-300';
    } else if (seatSelected) {
      seatClass += 'bg-green-500 text-white border border-green-300';
    } else {
      seatClass += 'border border-green-500 bg-transparent hover:bg-green-500';
    }

    return (
      <div
        key={seat}
        className={seatClass}
        onClick={() => handleSeatSelection(seat)}
      >
        {seat}
      </div>
    );
  };

  const startAutoScrolling = () => {
    if (scrollRef.current && isMobile && !isManualScroll.current) {
      scrollRef.current.scrollLeft = 0; // Reset scroll position if needed
      scrollInterval.current = setInterval(() => {
        scrollRef.current.scrollBy({
          left: 1,
          behavior: 'smooth',
        });
      }, 100); // Adjust speed by changing the interval time
    }
  };

  const stopAutoScrolling = () => {
    clearInterval(scrollInterval.current);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check size on initial render
    handleResize();

    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Start auto-scrolling when mobile
    if (isMobile) {
      startAutoScrolling();
    }

    return () => {
      stopAutoScrolling();
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const handleTouchStart = () => {
    isManualScroll.current = true;
    stopAutoScrolling(); // Stop auto-scrolling
    clearTimeout(autoScrollTimeout.current); // Clear timeout if it exists
  };

  const handleTouchEnd = () => {
    isManualScroll.current = false;
    autoScrollTimeout.current = setTimeout(startAutoScrolling, 5000); // Restart auto-scrolling after 1 second of inactivity
  };

  const handleWheel = (e) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY; // Manual scroll on mouse wheel
      stopAutoScrolling(); // Stop auto-scrolling when user scrolls with the mouse
    }
  };

  const handlePayClick = () => {
    // Get user details
    const userDetailsArray = Array.from(selectedSeats).map(seat => userDetails[seat]);
    const userNames = userDetailsArray.map(details => details.name).join(', ');
    const userClasses = userDetailsArray.map(details => details.class).join(', ');
    const userRolls = userDetailsArray.map(details => details.roll).join(', ');
    const userMobiles = userDetailsArray.map(details => details.mobile).join(', ');
  
    // Generate dynamic UPI URL with URL encoding
    const seatDetails = Array.from(selectedSeats).join(', ');
    const transactionNote = `Seat ${seatDetails}, ${userNames}, ${userClasses}, ${userRolls}, ${userMobiles}`;
    
    const upiUrl = `upi://pay?pa=ayushroy0753@okhdfcbank&am=${totalAmount}&tn=${encodeURIComponent(transactionNote)}&cu=INR&url=${encodeURIComponent('https://stagevibe.vercel.app')}`;
  
    // Navigate to the Payment page with UPI URL
    navigate('/payment', {
      state: {
        upiUrl, // Passing the dynamically generated UPI URL
      },
    });
  
    // Call addUser function after payment (optional)
    setTimeout(() => {
      handleAddUser(); // This can be adjusted based on your user confirmation logic
    }, 5000); // Adjust delay as needed
  };  
  
  
  return (
    <div className="p-2 bg-gradient-to-b from-[#0b0b22FD] to-[#0f1a3dFD] min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-center text-2xl font-bold mb-4">
        <i className="fas fa-film"></i> &nbsp; Book Your Seats Now!
      </h1>
      <div className="rounded-lg w-60 h-16 mb-4 flex text-center font-bold items-center justify-center text-lg text-red-500 mx-0.5 border border-yellow-500">
        All eyes this way please!
      </div>

      {/* Boys and Girls Labels with line */}
      <div className="w-full flex items-center justify-between mb-4 relative">
        <span className="text-blue-500 font-bold ml-4 mr-2 md:mx-auto">← For boys</span>
        <span className="text-pink-500 font-bold ml-2 mr-4 md:mx-auto">For girls →</span>
      </div>

      {/* Scrollable seat layout (Main and Upper floor combined) */}
      <div
        className="scrollable-container w-full overflow-x-scroll mb-4"
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel} // Listen for mouse wheel events
      >
        <div className="min-w-[800px]">
          <div className="grid grid-cols-12 gap-2">

            {/* Main Floor Rows */}
            {rows
              .filter(({ row }) => !['L', 'M'].includes(row)) // Filter out L and M for main floor
              .map(({ row, seats }) => (
                <div key={row} className="col-span-12 flex justify-center mb-2">
                  <div className="flex items-center">
                    {/* Right seats (reversed numbering) */}
                    {Array.from({ length: Math.ceil(seats / 2) }, (_, index) => `${row}${seats - index}`).map(renderSeat)}

                    {/* Middle space with a vertical line */}
                    <div className="w-14 flex items-center justify-center">
                      <div className="border-l-2 border-gray-400 h-full"></div> {/* Vertical dividing line */}
                    </div>

                    {/* Left seats */}
                    {Array.from({ length: Math.floor(seats / 2) }, (_, index) => `${row}${seats - Math.floor(seats / 2) - index}`).map(renderSeat)}
                  </div>
                </div>
              ))}

            {/* Divider for Upper Floor */}
            <div className="col-span-12 text-center text-white font-medium">
              Upper Floor Seats ↴
            </div>

            {/* Upper Floor Rows */}

            {/* First curved row (L) without middle space */}
            <div className="col-span-12 flex justify-center mb-4">
              <div className="flex items-center">
                {Array.from({ length: 17 }, (_, index) => `L${17 - index}`).map(renderSeat)}
              </div>
            </div>

            {/* Second curved row (M) without middle space */}
            <div className="col-span-12 flex justify-center mb-4">
              <div className="flex items-center">
                {Array.from({ length: 18 }, (_, index) => `M${18 - index}`).map(renderSeat)}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Instructions */}
      <div className="flex flex-wrap justify-center mb-2">
        <div className="flex items-center mr-4 mb-2">
          <div className="w-4 h-4 border border-green-500 bg-transparent rounded mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center mr-4 mb-2">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center mr-4 mb-2">
          <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center mr-4 mb-2">
          <div className="w-4 h-4 bg-yellow-300 rounded mr-2"></div>
          <span>Pending</span>
        </div>
      </div>

      {/* Booking Summary */}
      {selectedSeats.size > 0 && (
        <>
          {/* Fixed Button at the bottom */}
          <div className="fixed bottom-0 left-0 right-0 p-2 bg-gradient-to-b from-[#0b0b22FD] to-[#0f1a3dFD] flex justify-between items-center border-t border-gray-300">
            <div className="text-base font-bold ml-5">
              {selectedSeats.size} seat{selectedSeats.size > 1 && 's'} selected
            </div>
            <button
              className="bg-green-600 text-white py-2 px-5 rounded-full text-lg"
              onClick={handlePayClick}
            >
              Pay ₹{totalAmount}
            </button>
          </div>
          <div className="flex justify-center mb-20">
            <div className="border border-gray-300 rounded p-4">
              <h2 className="text-lg font-bold mb-2">Booking Summary</h2>
              <div>
                <strong>Total Seats:</strong> {selectedSeats.size}
              </div>
              <div>
                <strong>Total Amount:</strong> ₹{totalAmount}
              </div>
              <h3 className="mt-2 font-semibold">User Details:</h3>
              <ul>
                {Array.from(selectedSeats).map((seat) => (
                  <li key={seat}>
                    {userDetails[seat]?.name || 'Pending'}: {seat}
                  </li>
                ))}
              </ul>
              <button
                className="mt-2 bg-green-600 text-white py-2 px-5 rounded-full"
                onClick={handlePayClick} 
              >
                Pay ₹{totalAmount}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Seat selection popup */}
      {
        isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <form
              className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl text-white shadow-lg w-auto max-w-md relative"
              onClick={(e) => e.stopPropagation()}
              onSubmit={(e) => { e.preventDefault(); addSeatToBooking(); }} // Move onSubmit here
            >
              <h2><b>Enter User Details for </b>{currentSeat}</h2>
              <div className='font-bold my-4'>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={userDetails[currentSeat]?.name || ''}
                  required
                  onChange={handleInputChange}
                  className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <select
                  name="class"
                  value={userDetails[currentSeat]?.class || ''}
                  required
                  onChange={handleInputChange}
                  className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Choose Your Class</option>
                  <option value="BCA1">BCA1</option>
                  <option value="BCA2">BCA2</option>
                  <option value="BCA3">BCA3</option>
                  <option value="MCA1">MCA1</option>
                  <option value="MCA3">MCA3</option>
                </select>
                <input
                  type="number"
                  name="roll"
                  placeholder="Roll Number"
                  value={userDetails[currentSeat]?.roll || ''}
                  className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  onChange={handleInputChange}
                />
                {rollError && <p className="text-red-500 text-sm">{rollError}</p>}
                <input
                  type="number"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={userDetails[currentSeat]?.mobile || ''}
                  className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  onChange={handleInputChange}
                />
                {mobileError && <p className="text-red-500 text-sm">{mobileError}</p>}
                <div className="flex">
                  <button
                    type="submit" // Change to type="submit" for proper form submission
                    className="bg-blue-500 text-white py-1 px-3 rounded"
                  >
                    Add Seat
                  </button>
                  <button
                    type="button" // Change to type="button" to prevent form submission
                    className="bg-gray-300 text-gray-700 py-1 px-3 rounded ml-2"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>

          </div>
        )
      }
    </div >
  );
};

export default Booking;
