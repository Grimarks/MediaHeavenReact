import React from 'react';
import meavenLogo from '../assets/Logo4.png';
import {Link} from 'react-router-dom';

export default function Navbar() {
        const getCurrentPage = () => {
            if (window.location.pathname.includes('/community')) {
                return 'Community';
            } else if (window.location.pathname.includes('/wishlist')) {
                return 'Wishlist';
            }else if (window.location.pathname.includes('/login')) {
                return 'Sign In';
            }else if (window.location.pathname.includes('/regis')) {
                return 'Register';
            } else {
                return 'Movies';
            }
        };

        const activePage = getCurrentPage();

        return (
            <header className="flex justify-between items-center p-2.5 sticky top-0 z-50 backdrop-blur-md shadow-md">
                <div className="logo">
                    <Link to="/">
                        <img
                            src={meavenLogo}
                            alt="Logo"
                            className="w-10 h-10"
                        />
                    </Link>

                </div>
                <nav className="navigation1 flex gap-3.5 items-center p-2.5">
                    <Link to="/"
                       className={`font-bold rounded-2xl px-3.5 py-2.5 transition duration-500 ease-in-out hover:bg-gray-400 hover:text-black ${activePage === 'Movies' ? 'bg-gray-400 text-black' : 'text-black'}`}>
                        Movies
                    </Link>
                    <Link to="/community"
                       className={`font-bold rounded-2xl px-3.5 py-2.5 transition duration-500 ease-in-out hover:bg-gray-400 hover:text-black ${activePage === 'Community' ? 'bg-gray-400 text-black' : 'text-black'}`}>
                        Community
                    </Link>
                    <Link to="/wishlist"
                       className={`font-bold rounded-2xl px-3.5 py-2.5 transition duration-500 ease-in-out hover:bg-gray-400 hover:text-black ${activePage === 'Wishlist' ? 'bg-gray-400 text-black' : 'text-black'}`}>
                        Wishlist
                    </Link>
                    <Link to="/login"
                          className={`font-bold rounded-2xl px-3.5 py-2.5 transition duration-500 ease-in-out bg-black hover:bg-gray-400 hover:text-black ${activePage === 'Sign In' ? 'bg-gray-400 text-black' : 'text-white'}`}>
                        Sign In
                    </Link>
                    <Link to="/register"
                          className={`font-bold rounded-2xl px-3.5 py-2.5 transition duration-500 ease-in-out bg-black hover:bg-gray-400 hover:text-black ${activePage === 'Sign In' ? 'bg-gray-400 text-black' : 'text-white'}`}>
                        Register
                    </Link>

                </nav>
            </header>

        )
    }
