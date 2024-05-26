import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [usernameForDeletion, setUsernameForDeletion] = useState('');
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [deletePictureFlag, setDeletePictureFlag] = useState(false);
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
        if (response.data.profile_picture) {
          setProfilePictureUrl(`http://localhost:8000${response.data.profile_picture}`);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const fetchUpdatedUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/profile/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUser(response.data);
      setFullName(response.data.full_name);
      setEmail(response.data.email);
      if (response.data.profile_picture) {
        setProfilePictureUrl(`http://localhost:8000${response.data.profile_picture}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('email', email);
    if (profilePictureFile) {
      formData.append('profile_picture', profilePictureFile);
    }
    if (deletePictureFlag) {
      formData.append('delete_picture', 'true');
    }
    try {
      await axios.put('http://localhost:8000/api/profile/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchUpdatedUser();
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
      setShowChangePassword(false);
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

  const handleDeletePicture = () => {
    setProfilePictureFile(null);
    setDeletePictureFlag(true);
    setProfilePictureUrl(null);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setProfilePictureUrl(url);
    setProfilePictureFile(file);
    setDeletePictureFlag(false);
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleUpdateProfile} className="bg-white p-6 rounded shadow-md w-80">
        <div 
          className="relative flex justify-center mb-4" 
          onMouseEnter={() => setShowDeleteButton(true)}
          onMouseLeave={() => setShowDeleteButton(false)}
        >
          {profilePictureUrl ? (
            <div className="relative w-24 h-24">
              <img
                src={profilePictureUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              {showDeleteButton && (
                <button 
                  type="button"
                  className="absolute inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50 text-white text-3xl rounded-full"
                  onClick={handleDeletePicture}
                >
                  &times;
                </button>
              )}
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-3xl">
              {getInitial(fullName)}
            </div>
          )}
        </div>
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
          onChange={handleProfilePictureChange}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded mb-4">Update Profile</button>

        <button
          type="button"
          onClick={() => setShowChangePassword(true)}
          className="bg-blue-500 text-white p-2 w-full rounded mb-4"
        >
          Change Password
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteWarning(true)}
          className="bg-red-500 text-white p-2 w-full rounded"
        >
          Delete Account
        </button>
      </form>

      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-2xl mb-4 text-center">Change Password</h2>
            <form onSubmit={handleChangePassword}>
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
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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