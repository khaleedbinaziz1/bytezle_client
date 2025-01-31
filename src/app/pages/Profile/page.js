"use client"
import React, { useState, useEffect } from 'react';
import { db, auth } from '../login/firebase/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Image from 'next/image';

const Profile = () => {
  const [userData, setUserData] = useState({
    uid: '',
    image: '',
    phone: '',
    address: '',
    name: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {

          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
  
          if (userDocSnap.exists()) {
            const userData = {
              uid: user.uid,
              image: userDocSnap.data().image || '',
              phone: userDocSnap.data().phone || '',
              address: userDocSnap.data().address || '',
              name: userDocSnap.data().name || '',
              email: userDocSnap.data().email || '',
            };

            setUserData(userData);
          } else {

          }
        } else {

        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    // Trigger fetchUserData() when the component mounts
    fetchUserData();
  
    // Add auth state change listener to handle user state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchUserData();
      } else {
        // Handle user sign out state if needed

        setUserData({
          uid: '',
          image: '',
          phone: '',
          address: '',
          name: '',
          email: '',
        });
      }
    });
  
    // Clean up auth state change listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch('https://api.imgbb.com/1/upload?key=7f0887346a467c90b49e348ff435d044', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      let imageUrl = userData.image;
      if (imageFile) {
        const uploadedImageUrl = await uploadImage(imageFile);
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        } else {
          alert('Image upload failed');
          return;
        }
      }

      const updatedUserData = { ...userData, image: imageUrl };

      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, updatedUserData, { merge: true });
        alert('Profile updated successfully');
        setIsEditing(false);
        setUserData(updatedUserData);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6  mt-24" style={{marginTop:'150px'}}>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Profile</h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="mb-6">
            {userData.image ? (
              <div className="w-32 h-32 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2">
                <Image
                  src={userData.image}
                  alt="Profile"
                  className='rounded-full'
                  width={128}
                  height={128}
                />
              </div>
            ) : (
              <p className="text-gray-500">No profile image</p>
            )}
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-4 p-2 border border-gray-300 rounded-lg"
              />
            )}
          </div>
          <div className="w-full">
            <div className="flex items-center justify-start mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Name</h2>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full max-w-xs"
                />
              ) : (
                <p className="text-lg ml-10 text-gray-600">{userData.name}</p>
              )}
            </div>
            <div className="flex items-center justify-start mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Email</h2>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full max-w-xs"
                />
              ) : (
                <p className="text-lg ml-10 text-gray-600">{userData.email}</p>
              )}
            </div>
            <div className="flex items-center justify-start mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Phone:</h2>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full max-w-xs"
                />
              ) : (
                <p className="text-lg ml-10 text-gray-600">{userData.phone}</p>
              )}
            </div>
            <div className="flex items-center justify-start mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Address:</h2>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
                  className="input input-bordered w-full max-w-xs"
                />
              ) : (
                <p className="text-lg ml-10 text-gray-600">{userData.address}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="btn btn-primary mr-2"
                >
                  Save Profile
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
