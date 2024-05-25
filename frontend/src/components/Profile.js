import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [usernameForDeletion, setUsernameForDeletion] = useState('');
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data);
        setFullName(response.data.full_name);
        setEmail(response.data.email);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('email', email);
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }
    try {
      const response = await axios.put('http://localhost:8000/api/profile/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data);
      alert('Profile updated successfully.');
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating the profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/change_password/', {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert(response.data.detail);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error(error);
      alert('An error occurred while changing the password.');
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete('http://localhost:8000/api/delete_account/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: {
          username: usernameForDeletion,
        },
      });
      alert(response.data.detail);
      localStorage.removeItem('token');
      navigate('/signup');
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the account.');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleUpdateProfile} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4 text-center">Profile</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        />
        <input
          type="file"
          onChange={(e) => setProfilePicture(e.target.files[0])}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Update Profile</button>
      </form>

      <form onSubmit={handleChangePassword} className="bg-white p-6 rounded shadow-md w-80 mt-4">
        <h2 className="text-2xl mb-4 text-center">Change Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Change Password</button>
      </form>

      <div className="bg-white p-6 rounded shadow-md w-80 mt-4">
        <button
          onClick={() => setShowDeleteWarning(true)}
          className="bg-red-500 text-white p-2 w-full rounded"
        >
          Delete Account
        </button>
      </div>

      {showDeleteWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-2xl mb-4 text-center text-red-500">Delete Account</h2>
            <p className="text-sm mb-4">
              Are you sure you want to delete your AnyTodo account?
              Deleting your AnyTodo account will also delete all the data in your account. This process can't be undone.
            </p>
            <p className="text-sm mb-4">
              Type your Username, <strong>{user.username}</strong>, below to delete your AnyTodo account
            </p>
            <form onSubmit={handleDeleteAccount}>
              <input
                type="text"
                placeholder={`${user.username}`}
                value={usernameForDeletion}
                onChange={(e) => setUsernameForDeletion(e.target.value)}
                className="mb-4 p-2 w-full border border-gray-300 rounded"
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-red-500 text-white p-2 rounded"
                  disabled={usernameForDeletion !== user.username}
                >
                  Yes, delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteWarning(false)}
                  className="bg-gray-500 text-white p-2 rounded"
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

export default Profile;