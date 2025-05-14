import React, { useContext } from 'react';
import { assets } from '../assets/frontend_assets/assets.js';
import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { ShopContext } from '../context/ShopContext.jsx';
const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const {
        setShowSearch,
        getCartCount,
        navigate,
        token,
        setToken,
        setCartItems,
    } = useContext(ShopContext);
    const logout = () => {
        navigate('/login');
        localStorage.removeItem('token');
        setCartItems({});
        setToken('');
    };
    return (
        <div>
            <div className="flex items-center justify-between py-5 font-medium">
                {/* Logo */}
                <Link to="/">
                    <img src={assets.logo} alt="logo" className="w-36" />
                </Link>

                {/* Navbar */}
                <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
                    <li className="hover:text-gray-900 transition duration-300">
                        <NavLink to="/">
                            HOME
                            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                        </NavLink>
                    </li>
                    <li className="hover:text-gray-900 transition duration-300">
                        <NavLink to="/collection">
                            COLLECTION
                            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                        </NavLink>
                    </li>
                    <li className="hover:text-gray-900 transition duration-300">
                        <NavLink to="/about">
                            ABOUT
                            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                        </NavLink>
                    </li>

                    <li className="hover:text-gray-900 transition duration-300">
                        <NavLink to="/contact">
                            CONTACT
                            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                        </NavLink>
                    </li>
                </ul>

                <div className="flex items-center gap-5">
                    <img
                        onClick={() => setShowSearch(true)}
                        src={assets.search_icon}
                        alt="search-icon"
                        className="w-5 cursor-pointer"
                    />
                    <div className="group relative">
                        <img
                            onClick={() => (token ? null : navigate('/login'))}
                            src={assets.profile_icon}
                            alt=""
                            className="w-5 cursor-pointer"
                        />
                        {/* Dropdown Menu */}
                        {token && (
                            <div className="group-hover:block hidden absolute dropdown-menu right-0 bg-white shadow-lg rounded-lg pt-4">
                                <div className="flex flex-col gap-2 w-36 py-3 px-5">
                                    <p className=" cursor-pointer hover:text-black">
                                        My Profile
                                    </p>
                                    <p
                                        onClick={() => navigate('/orders')}
                                        className=" cursor-pointer hover:text-black"
                                    >
                                        Orders
                                    </p>
                                    <p
                                        onClick={logout}
                                        className=" cursor-pointer hover:text-black"
                                    >
                                        Logout
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <Link to="/cart" className="relative">
                        <img src={assets.cart_icon} className=" w-5 min-w-5" />
                        <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                            {getCartCount()}
                        </p>
                    </Link>
                    <img
                        onClick={() => setVisible(true)}
                        src={assets.menu_icon}
                        alt="menu-icon"
                        className="w-5 cursor-pointer sm:hidden"
                    />
                </div>
                {/* {Sidebar menu for small screen} */}
                <div
                    className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
                        visible ? 'w-full' : 'w-0'
                    }`}
                >
                    <div className="flex flex-col text-gray-600">
                        <div
                            onClick={() => setVisible(false)}
                            className=" flex items-center gap-4 p-3 cursor-pointer"
                        >
                            <img
                                className="h-4 rotate-180"
                                alt=""
                                src={assets.dropdown_icon}
                            />
                            <p>Back</p>
                        </div>

                        <NavLink
                            onClick={() => setVisible(false)}
                            className="py-2 pl-6 border"
                            to="/"
                        >
                            HOME
                        </NavLink>

                        <NavLink
                            onClick={() => setVisible(false)}
                            className="py-2 pl-6 border"
                            to="/about"
                        >
                            ABOUT
                        </NavLink>

                        <NavLink
                            onClick={() => setVisible(false)}
                            className="py-2 pl-6 border"
                            to="/contact"
                        >
                            CONTACT
                        </NavLink>
                        <NavLink
                            onClick={() => setVisible(false)}
                            className="py-2 pl-6 border"
                            to="/collection"
                        >
                            COLLECTION
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
