import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set, push, onValue, remove } from 'firebase/database';
import database from '../firebase'; // Import Firebase instance

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const currentSuperAdmin = JSON.parse(localStorage.getItem('currentSuperAdmin') || 'null');
    const [accessGranted, setAccessGranted] = useState(
        JSON.parse(localStorage.getItem('accessGranted') || 'false')
    );

    useEffect(() => {
        if (!currentSuperAdmin) {
            navigate('/sadminlogin');
        } else if (!accessGranted) {
            const userInput = prompt("Please enter access code:");
            if (userInput === '154236') {
                setAccessGranted(true);
                localStorage.setItem('accessGranted', true);
            } else {
                navigate('/sadminlogin');
            }
        }
    }, [currentSuperAdmin, accessGranted, navigate]);

    const superadminName = currentSuperAdmin?.username || '';
    const [users, setUsers] = useState([]);
    const [performers, setPerformers] = useState([]);
    const [admins, setAdmins] = useState([]);


    const [userForm, setUserForm] = useState({
        name: '',
        class: '',
        roll: '',
        mobile: '',
        seatNo: '',
        paymentMode: '',
    });

    const [performerForm, setPerformerForm] = useState({
        name: '',
        imgUrl: '',
    });

    const [adminForm, setAdminForm] = useState({
        username: '',
        password: '',
    });

    const [editingUser, setEditingUser] = useState(null);
    const [message, setMessage] = useState(''); // State to handle messages
    const [showMessage, setShowMessage] = useState(false); // State to control the visibility of the message

    // Fetch data from Firebase on component mount
    useEffect(() => {
        const usersRef = ref(database, 'users');
        const performersRef = ref(database, 'performers');
        const adminsRef = ref(database, 'admins');

        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            setUsers(data ? Object.values(data).reverse() : []);
        });

        onValue(performersRef, (snapshot) => {
            const data = snapshot.val();
            setPerformers(data ? Object.values(data).reverse() : []);
        });

        onValue(adminsRef, (snapshot) => {
            const data = snapshot.val();
            setAdmins(data ? Object.values(data).reverse() : []);
        });
    }, []);

    // Handler functions for form inputs
    const handleUserInputChange = (e) => {
        const { name, value } = e.target;
        setUserForm({ ...userForm, [name]: value });
    };

    const handlePerformerInputChange = (e) => {
        const { name, value } = e.target;
        setPerformerForm({ ...performerForm, [name]: value });
    };

    const handleAdminInputChange = (e) => {
        const { name, value } = e.target;
        setAdminForm({ ...adminForm, [name]: value });
    };

    // Function to add user
    const handleAddUser = (e) => {
        e.preventDefault();
        const usersRef = ref(database, 'users');
        const newUserRef = push(usersRef);
        const newUser = { ...userForm, id: newUserRef.key, approved: false };
        set(newUserRef, newUser);
        setUsers((prevUsers) => [newUser, ...prevUsers]);
        showPopup(`User ${userForm.name} added successfully.`);
        setUserForm({ name: '', class: '', roll: '', mobile: '', seatNo: '', paymentMode: 'cash' });
    };

    // Function to add performer
    const handleAddPerformer = (e) => {
        e.preventDefault();
        const performersRef = ref(database, 'performers');
        const newPerformerRef = push(performersRef);
        set(newPerformerRef, { ...performerForm, id: newPerformerRef.key });
        showPopup(`Performer ${performerForm.name} added successfully.`);
        setPerformerForm({ name: '', imgUrl: '' });
    };

    // Function to add admin
    const handleAddAdmin = (e) => {
        e.preventDefault();
        const adminsRef = ref(database, 'admins');
        const newAdminRef = push(adminsRef);
        set(newAdminRef, { ...adminForm, id: newAdminRef.key });
        showPopup(`Admin ${adminForm.username} added successfully.`);
        setAdminForm({ username: '', password: '' });
    };

    // Approve user
    const handleApproveUser = (id) => {
        const userRef = ref(database, `users/${id}`);
        const updatedUser = users.find((user) => user.id === id);
        set(userRef, { ...updatedUser, approved: true });
        showPopup(`User ${updatedUser.name} approved.`);
    };

    // Edit user
    const handleEditUser = (user) => {
        setEditingUser(user);
        setUserForm(user);
    };

    const handleSaveEditUser = () => {
        const userRef = ref(database, `users/${editingUser.id}`);
        set(userRef, { ...editingUser, ...userForm });
        showPopup(`User ${editingUser.name} updated successfully.`);
        setEditingUser(null);
        setUserForm({ name: '', class: '', roll: '', mobile: '', seatNo: '', paymentMode: '' });
    };

    // Delete user
    const handleDeleteUser = (id) => {
        const userRef = ref(database, `users/${id}`);
        remove(userRef);
        showPopup('User deleted successfully.');
    };

    // Delete performer
    const handleDeletePerformer = (id) => {
        const performerRef = ref(database, `performers/${id}`);
        remove(performerRef);
        showPopup('Performer deleted successfully.');
    };

    // Delete admin
    const handleDeleteAdmin = (id) => {
        const adminRef = ref(database, `admins/${id}`);
        remove(adminRef);
        showPopup('Admin deleted successfully.');
    };

    // Function to show popup message
    const showPopup = (msg) => {
        setMessage(msg);
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
            setMessage('');
        }, 3000); // Show for 3 seconds
    };

    const handleLogout = () => {
        // Clear the currentAdmin from localStorage
        localStorage.removeItem('currentSuperAdmin');
        // Optionally, you can add additional logout logic here
        console.log('Logged out successfully');
      };

    // Render approved users and pending users
    const approvedUsers = users.filter((user) => user.approved);
    const pendingUsers = users.filter((user) => !user.approved);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    SuperAdmin Dashboard
                </h1>
                <h2 className="text-xl font-semibold text-gray-600 mb-6">
                    Welcome {superadminName}
                </h2>
                <button 
        onClick={handleLogout} 
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
      >
        Logout
      </button>
    
                <div className="flex justify-center mt-8">
                    <a
                        className="font-medium bg-green-800 border-2 border-red-600 rounded-md text-white py-2 px-4 hover:bg-green-700 transition-colors"
                        href="https://admin-panel-tan-three.vercel.app/login"
                    >
                        New Applied Performers list
                    </a>
                </div>

                {/* Display the message */}
                {showMessage && (
                    <div className="bg-green-500 text-white p-4 rounded-md mb-4">
                        {message}
                    </div>
                )}

                {/* Add User Form */}
                <div className="mb-10 ">
                    <h3 className="text-2xl font-bold mb-4 text-black">Add User</h3>
                    <form onSubmit={handleAddUser} className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="name"
                            value={userForm.name}
                            onChange={handleUserInputChange}
                            placeholder="Name"
                            className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                        <select
                            name="class"
                            value={userForm.class}
                            onChange={handleUserInputChange}
                            className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        >
                            <option value="">Select Class</option>
                            <option value="BCA1">BCA1</option>
                            <option value="BCA2">BCA2</option>
                            <option value="BCA3">BCA3</option>
                            <option value="MCA1">MCA1</option>
                            <option value="MCA3">MCA3</option>
                        </select>
                        <input
                            type="text"
                            name="roll"
                            value={userForm.roll}
                            onChange={handleUserInputChange}
                            placeholder="Roll"
                            className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                        <input
                            type="text"
                            name="mobile"
                            value={userForm.mobile}
                            onChange={handleUserInputChange}
                            placeholder="Mobile"
                            className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                        <input
                            type="text"
                            name="seatNo"
                            value={userForm.seatNo.toUpperCase()}
                            onChange={handleUserInputChange}
                            placeholder="Seat No (Pending)"
                            className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                        <select
                            name="paymentMode"
                            value={userForm.paymentMode}
                            onChange={handleUserInputChange}
                            className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        >
                            <option value="">Select Mode</option>
                            <option value="cash">Cash</option>
                            <option value="online">Online</option>
                        </select>
                        <button
                            type="submit"
                            className="col-span-2 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                        >
                            Add User
                        </button>
                    </form>
                </div>

                {/* Add Performer Form */}
                <div className="mb-10">
                    <h3 className="text-2xl font-bold mb-4 text-black">Add Selected Performer</h3>
                    <form onSubmit={handleAddPerformer} className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="name"
                            value={performerForm.name}
                            onChange={handlePerformerInputChange}
                            placeholder="Performer Name"
                            className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                        <input
                            type="text"
                            name="imgUrl"
                            value={performerForm.imgUrl}
                            onChange={handlePerformerInputChange}
                            placeholder="Image URL"
                            className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                        <button
                            type="submit"
                            className="col-span-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                        >
                            Add Performer
                        </button>
                    </form>
                </div>

                {/* Add Admin Form */}
                <div className="mb-10">
                    <h3 className="text-2xl font-bold mb-4 text-black">Add Admin</h3>
                    <form onSubmit={handleAddAdmin} className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="username"
                            value={adminForm.username}
                            onChange={handleAdminInputChange}
                            placeholder="Username"
                            className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={adminForm.password}
                            onChange={handleAdminInputChange}
                            placeholder="Password"
                            className="font-medium bg-gray-700 border border-gray-600 text-white p-2 mb-4 w-full rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                        <button
                            type="submit"
                            className="col-span-2 bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
                        >
                            Add Admin
                        </button>
                    </form>
                </div>
                {/* Display Admins */}
                <div className="mb-10">
                    <h3 className="text-2xl font-bold mb-4 text-black">Admins</h3>
                    {admins.length > 0 ? (
                        <ul className="space-y-4">
                            {admins.map((admin) => (
                                <li key={admin.id} className="flex justify-between items-center p-4 bg-gray-500 font-bold rounded-md shadow-md">
                                    <span className="text-black">User: {admin.username}</span>
                                    <span className='text-black'>Pass: {admin.password}</span>
                                    <button
                                        onClick={() => handleDeleteAdmin(admin.id)}
                                        className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>) : (
                        <p className="text-black">No Admins.</p>
                    )}
                </div>
                {/* Display Performers */}
                <div className="mb-10">

                    <h3 className="text-2xl font-bold mb-4 text-blue-700">Selected Performers</h3>
                    {performers.length > 0 ? (
                        <ul className="space-y-4">
                            {performers.map((performer) => (
                                <li key={performer.id} className="flex justify-between items-center p-4 bg-cyan-600 rounded-md shadow-md">
                                    <div className='text-black'>
                                        <p><strong>Name:</strong> {performer.name}</p>
                                        <img src={performer.imgUrl} alt={performer.name} className="w-20 h-20 object-cover mt-2" />
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleDeletePerformer(performer.id)}
                                            className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className='text-red-500'>No performers available.</p>
                    )}
                </div>
                {/* Display Approved Users */}
                <div className="mb-10">
                    <h3 className="text-2xl font-bold mb-4 text-black">Approved Users</h3>
                    {approvedUsers.length > 0 ? (
                        <ul className="space-y-4">
                            {approvedUsers.map((user) => (
                                <li
                                    key={user.id}
                                    className={`flex justify-between items-center p-4 rounded-md font-medium shadow-md ${user.approved ? 'bg-green-400' : 'bg-red-400'
                                        }`}
                                >
                                    <div className='text-black'>
                                        <p><strong>Name:</strong> {user.name}</p>
                                        <p><strong>Class:</strong> {user.class}</p>
                                        <p><strong>Roll:</strong> {user.roll}</p>
                                        <p><strong>Mobile:</strong> {user.mobile}</p>
                                        <p><strong>Seat No:</strong>{user.seatNo}</p>
                                        <p><strong>Payment Mode:</strong> {user.paymentMode}</p>
                                        <p><strong>Approved:</strong> {user.approved ? 'Yes' : 'No'}</p>
                                    </div>
                                    <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0'>
                                        <a className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-red-600 transition" href=''
                                        >
                                            Invite
                                        </a>
{/*                                         <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button> */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className='font-'>No users available.</p>
                    )}
                </div>

                {/* Display Pending Users */}
                <div className="mb-10">
                    <h3 className="text-2xl font-bold mb-4 text-black">Pending Users</h3>
                    {pendingUsers.length > 0 ? (
                        <ul className="space-y-4">
                            {pendingUsers.map((user) => (
                                <li key={user.id} className={`flex justify-between items-center p-4 rounded-md shadow-md font-medium ${user.approved ? 'bg-green-400' : 'bg-red-400'
                                    }`}
                                >
                                    <div className='text-black'>
                                        <p><strong>Name:</strong> {user.name}</p>
                                        <p><strong>Class:</strong> {user.class}</p>
                                        <p><strong>Roll:</strong> {user.roll}</p>
                                        <p><strong>Mobile:</strong> {user.mobile}</p>
                                        <p><strong>Seat No:</strong>{user.seatNo}</p>
                                        <p><strong>Payment Mode:</strong> {user.paymentMode}</p>
                                        <p><strong>Approved:</strong> {user.approved ? 'Yes' : 'No'}</p>
                                    </div>
                                    <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0'>
                                        <button
                                            onClick={() => handleApproveUser(user.id)}
                                            className="bg-green-500 text-white py-1 px-2 rounded-md hover:bg-green-600 transition"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>) : (
                        <p className="text-black">No pending users.</p>
                    )}
                </div>
            </div>
        </div>
    );


};

export default SuperAdminDashboard;
