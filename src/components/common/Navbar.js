import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
    const { currentUser, isOwner, isAdmin, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-2xl font-bold">PARKINGA</Link>
                <div className="hidden md:flex items-center space-x-4">
                    {currentUser ? (
                        <>
                            <Link to="/parks" className="text-white hover:text-gray-400 transition-colors duration-300">Find Parking</Link>
                            <Link to="/requests" className="text-white hover:text-gray-400 transition-colors duration-300">My Requests</Link>
                            
                            {isOwner && (
                                <>
                                    <Link to="/my-parks" className="text-white hover:text-gray-400 transition-colors duration-300">My Parks</Link>
                                    <Link to="/owner/requests" className="text-white hover:text-gray-400 transition-colors duration-300">Park Requests</Link>
                                </>
                            )}
                            
                            {isAdmin && (
                                <Link to="/pending-parks" className="text-white hover:text-gray-400 transition-colors duration-300">Pending Parks</Link>
                            )}
                            
                            <span className="text-white">{currentUser.firstname}</span>
                            <button onClick={handleLogout} className="text-white hover:text-gray-400 transition-colors duration-300">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-white hover:text-gray-400 transition-colors duration-300">Login</Link>
                            <Link to="/register" className="text-white hover:text-gray-400 transition-colors duration-300">Register</Link>
                        </>
                    )}
                </div>
                <div className="md:hidden">
                    <button onClick={handleMenuToggle} className="text-white focus:outline-none">
                        {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                    </button>
                </div>
            </div>
            {menuOpen && (
                <div className="md:hidden">
                    <div className="flex flex-col items-center space-y-4 mt-4">
                        {currentUser ? (
                            <>
                                <Link to="/parks" className="text-white hover:text-gray-400 transition-colors duration-300">Find Parking</Link>
                                <Link to="/requests" className="text-white hover:text-gray-400 transition-colors duration-300">My Requests</Link>
                                
                                {isOwner && (
                                    <>
                                        <Link to="/my-parks" className="text-white hover:text-gray-400 transition-colors duration-300">My Parks</Link>
                                        <Link to="/owner/requests" className="text-white hover:text-gray-400 transition-colors duration-300">Park Requests</Link>
                                    </>
                                )}
                                
                                {isAdmin && (
                                    <Link to="/pending-parks" className="text-white hover:text-gray-400 transition-colors duration-300">Pending Parks</Link>
                                )}
                                
                                <span className="text-white">{currentUser.firstname}</span>
                                <button onClick={handleLogout} className="text-white hover:text-gray-400 transition-colors duration-300">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-white hover:text-gray-400 transition-colors duration-300">Login</Link>
                                <Link to="/register" className="text-white hover:text-gray-400 transition-colors duration-300">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;