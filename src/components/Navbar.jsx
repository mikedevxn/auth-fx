import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import 'boxicons';

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(auth.currentUser);
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');
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

    const handleNavbarClick = () => {
        navigate('/profile');
    };

    return (
        <header className="w-full h-16 bg-gray-950 py-2 px-2 flex justify-between items-center">
            <div>
                <h1 className="text-xl">Fox Logo</h1>
            </div>

            <nav>
                <ul className="flex gap-4">
                    <li><a href="/home">Inicio</a></li>
                    <li><a href="/directory">Directorio</a></li>
                    <li><a href="/home">New Episodes</a></li>
                    <li><a href="/directory">On Air</a></li>
                </ul>
            </nav>

            <div onClick={handleNavbarClick}>
                {user ? (
                    <div className="flex justify-center items-center">
                        <img
                            className="user-img"
                            src={userImage || '/avatar.png'}
                            alt="User Profile"
                        />
                        <span className="mr-1">@{userName || 'Guest'}</span>
                        {isVerified && <box-icon name="check-circle" type="solid" color="orange" size="17px"></box-icon>}
                    </div>
                ) : (
                    <div className="flex justify-center items-center">
                        <img
                            className="user-img"
                            src="/avatar.png"
                            alt="Guest Profile"
                        />
                        <span>@Foxito User</span>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;