import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { Link } from 'react-router-dom';
import 'boxicons';

function Profile() {
    const [user, setUser] = useState(auth.currentUser);
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');
    const [newUserImage, setNewUserImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser(authUser);
                fetchUserData(authUser.uid);
            } else {
                setUser(null);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (user && user.uid) {
            fetchUserVerification(user.uid);
        }
    }, [user]);

    const fetchUserData = async (userId) => {
        setLoading(true);
        try {
            const userDoc = await firestore.collection('users').doc(userId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                setUserName(userData.userName || '');
                setUserImage(userData.userImage || '');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        setLoading(false);
    };

    const fetchUserVerification = async (userId) => {
        try {
            const userDoc = await firestore.collection('users').doc(userId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                setIsVerified(userData.verified || false);
            }
        } catch (error) {
            console.error('Error fetching user verification status:', error);
        }
    };

    const handleNameChange = (e) => {
        setUserName(e.target.value);
    };

    const handleImageChange = (e) => {
        setNewUserImage(e.target.value);
    };

    const handleProfileUpdate = async () => {
        setUpdating(true);

        try {
            const userId = user.uid;
            const updateData = {
                userName: userName,
            };

            if (newUserImage) {
                updateData.userImage = newUserImage;
            }

            await firestore.collection('users').doc(userId).update(updateData);

            if (newUserImage) {
                setUserImage(newUserImage);
            }

            setNewUserImage('');

            fetchUserData(userId);
        } catch (error) {
            console.error('Error updating user profile:', error);
        }

        setUpdating(false);
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            // Redirect or navigate to the desired page after logout
            // For example: navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div>
            <h2>Welcome to the Profile Page</h2>
            {user ? (
                <div>
                    <p style={{ display: 'flex', alignItems: 'center' }}>
                        <span>
                            Hello, @{userName || 'Guest'}!
                        </span>
                        {isVerified && (
                            <box-icon
                                type='solid'
                                name='check-circle'
                                color="orange"
                                style={{ marginLeft: '5px' }}
                            />
                        )}
                    </p>
                    {loading ? (
                        <p>Loading user data...</p>
                    ) : (
                        <>
                            <div>
                                <p>Change Your Name:</p>
                                <input
                                    type="text"
                                    placeholder="User Name"
                                    value={userName}
                                    onChange={handleNameChange}
                                />
                            </div>
                            <div>
                                <p>Change Your Image URL:</p>
                                <input
                                    type="url"
                                    placeholder="Image URL"
                                    value={newUserImage}
                                    onChange={handleImageChange}
                                />
                            </div>
                            <button onClick={handleProfileUpdate} disabled={updating}>
                                {updating ? 'Updating...' : 'Update Profile'}
                            </button>
                            <button onClick={handleLogout}>Logout</button>
                            <div>
                                <img
                                    src={userImage}
                                    alt="User Profile"
                                    style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                                />
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <p>You are not logged in.</p>
            )}
            <Link to="/reset-password">¿Olvidaste tu contraseña?</Link>
        </div>
    );
}

export default Profile;