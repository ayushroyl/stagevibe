import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import database from '../firebase';
import { ref, onValue, set, remove, update } from 'firebase/database';

const Admin = () => {

  const navigate = useNavigate();
  const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin') || 'null');
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    if (!currentAdmin) {
      navigate('/adminlogin');
    } else if (!accessGranted) {
      const userInput = prompt("Please enter access code:");
      if (userInput === '1295') {
        setAccessGranted(true);
      } else {
        navigate('/adminlogin');
      }
    }
  }, [currentAdmin, accessGranted, navigate]);


  const adminName = currentAdmin?.username || '';
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userForm, setUserForm] = useState({
    name: '',
    class: '',
    roll: '',
    mobile: '',
    seatNo: '',
    paymentMode: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({ show: false, userId: null });
  const [showFormModal, setShowFormModal] = useState(false);
  const [filter, setFilter] = useState({ class: '', approvedStatus: 'all' });
  const itemsPerPage = 10;

  const usersRef = ref(database, 'users');

  useEffect(() => {
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const userList = data ? Object.entries(data).map(([id, details]) => ({ id, ...details })) : [];
      setUsers(userList);
    });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterByClass = (e) => {
    setFilter({ ...filter, class: e.target.value });
  };

  const handleFilterByApproval = (status) => {
    setFilter({ ...filter, approvedStatus: status });
  };

  const filteredUsers = users.filter((user) => {
    const matchesClass = filter.class ? user.class === filter.class : true;
    const matchesApproval =
      filter.approvedStatus === 'all' ? true : filter.approvedStatus === 'approved' ? user.approved : !user.approved;
    return matchesClass && matchesApproval && user.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddUser = () => {
    if (userForm.id) {
      update(ref(database, `users/${userForm.id}`), { ...userForm });
    } else {
      const userId = Date.now().toString();
      set(ref(database, `users/${userId}`), { ...userForm, approved: false, id: userId, added_by: adminName });
    }
    setUserForm({ name: '', class: '', roll: '', mobile: '', seatNo: '', paymentMode: '' });
    setShowFormModal(false);
  };

  const handleDeleteUser = (userId) => {
    remove(ref(database, `users/${userId}`));
    setShowDeleteConfirm({ show: false, userId: null });
  };

  const handleEditUser = (user) => {
    setUserForm(user);
    setShowFormModal(true);
  };

  const handleApproveUser = (userId) => {
    update(ref(database, `users/${userId}`), { approved: true });
  };


  const handleLogout = () => {
    // Clear the currentAdmin from localStorage
    localStorage.removeItem('currentAdmin');
    // Optionally, you can add additional logout logic here
    console.log('Logged out successfully');
    navigate('/adminlogin');
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-blue-800 dark:text-blue-300">{adminName} Dashboard</h1>
        <div className="mt-4 space-x-4">
          <button
            onClick={() => {
              setUserForm({ name: '', class: '', roll: '', mobile: '', seatNo: '', paymentMode: '' });
              setShowFormModal(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 dark:hover:bg-green-700"
          >
            Add User
          </button>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-700">Logout</button>
        </div>
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="flex mb-4 space-x-2 flex-wrap">
        <select
          onChange={handleFilterByClass}
          value={filter.class}
          className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 w-full sm:w-auto"
        >
          <option value="">Filter by Class</option>
          <option value="BCA1">BCA1</option>
          <option value="BCA2">BCA2</option>
          <option value="BCA3">BCA3</option>
          <option value="MCA1">MCA1</option>
          <option value="MCA3">MCA3</option>
        </select>

        <button
          onClick={() => handleFilterByApproval('all')}
          className={`px-3 py-2 rounded ${filter.approvedStatus === 'all' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-700'}`}
        >
          All Users
        </button>

        <button
          onClick={() => handleFilterByApproval('approved')}
          className={`px-3 py-2 rounded ${filter.approvedStatus === 'approved' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-700'}`}
        >
          Approved Users
        </button>

        <button
          onClick={() => handleFilterByApproval('notApproved')}
          className={`px-3 py-2 rounded ${filter.approvedStatus === 'notApproved' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-700'}`}
        >
          Not Approved Users
        </button>
      </div>
      {/* User Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <table className="min-w-full border bg-white dark:bg-gray-800 rounded-lg table-fixed">
          <thead>
            <tr className="bg-blue-500 dark:bg-blue-700 text-white">
              <th className="w-1/12 p-3 text-left text-sm">SR No.</th>
              <th className="w-3/12 p-3 text-left text-sm">Name</th>
              <th className="w-2/12 p-3 text-left text-sm">Class</th>
              <th className="w-1/12 p-3 text-left text-sm">Roll</th>
              <th className="w-3/12 p-3 text-left text-sm">Mobile</th>
              <th className="w-2/12 p-3 text-left text-sm">Seat No.</th>
              <th className="w-2/12 p-3 text-left text-sm">Payment Mode</th>
              <th className="w-2/12 p-3 text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr key={user.id} className="border-b font-medium dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white">
                <td className="p-3 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="p-3 text-sm overflow-hidden whitespace-nowrap text-ellipsis">{user.name}</td>
                <td className="p-3 text-sm overflow-hidden whitespace-nowrap text-ellipsis">{user.class}</td>
                <td className="p-3 text-sm overflow-hidden whitespace-nowrap text-ellipsis">{user.roll}</td>
                <td className="p-3 text-sm overflow-hidden whitespace-nowrap text-ellipsis">{user.mobile}</td>
                <td className="p-3 text-sm overflow-hidden whitespace-nowrap text-ellipsis">{user.seatNo}</td>
                <td className="p-3 text-sm overflow-hidden whitespace-nowrap text-ellipsis">{user.paymentMode}</td>
                <td className="p-3 text-sm">
                  <div className="flex justify-center space-x-2">
                    {user.approved ? (
                      "Done"
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-1 text-blue-500"
                          title="Edit"
                        >
                          <span className="material-icons">edit</span> {/* Pencil icon for Edit */}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm({ show: true, userId: user.id })}
                          className="px-1 text-red-500"
                          title="Delete"
                        >
                          <span className="material-icons">delete</span> {/* Trash icon for Delete */}
                        </button>
                        <button
                          onClick={() => handleApproveUser(user.id)}
                          className="px-1 text-yellow-500"
                          title="Approve"
                        >
                          <span className="material-icons">check_circle</span> {/* Check icon for Approve */}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>


      {/* Delete Confirmation Modal */}
      {showDeleteConfirm.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl text-white shadow-lg w-auto max-w-md relative">
            <h2 className="text-lg font-bold text-black dark:text-white">Confirm Delete</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setShowDeleteConfirm({ show: false, userId: null })} className="px-4 py-2 bg-gray-400 dark:bg-gray-600 text-white rounded hover:bg-gray-500 dark:hover:bg-gray-700">Cancel</button>
              <button onClick={() => handleDeleteUser(showDeleteConfirm.userId)} className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-b font-medium from-gray-800 to-gray-900 p-6 rounded-2xl text-white shadow-lg w-auto max-w-md relative">
            <h2 className="text-lg font-bold text-white">{userForm.id ? 'Edit User' : 'Add User'}</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
              <input
                type="text"
                placeholder="Name"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-500 rounded-lg bg-gray-700 text-white"
                required
              />
              <select
                value={userForm.class}
                onChange={(e) => setUserForm({ ...userForm, class: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-500 rounded-lg bg-gray-700 text-white"
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
                placeholder="Roll"
                value={userForm.roll}
                onChange={(e) => setUserForm({ ...userForm, roll: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-500 rounded-lg bg-gray-700 text-white"
                required
              />
              <input
                type="text"
                placeholder="Mobile"
                value={userForm.mobile}
                onChange={(e) => setUserForm({ ...userForm, mobile: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-500 rounded-lg bg-gray-700 text-white"
                required
              />
              <input
                type="text"
                placeholder="Seat No."
                value={userForm.seatNo}
                onChange={(e) => setUserForm({ ...userForm, seatNo: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-500 rounded-lg bg-gray-700 text-white"
                required
              />
              <select
                value={userForm.paymentMode}
                onChange={(e) => setUserForm({ ...userForm, paymentMode: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-500 rounded-lg bg-gray-700 text-white"
                required
              >
                <option value="">Select Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {userForm.id ? 'Update User' : 'Add User'}
                </button>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;