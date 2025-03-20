import React, { useContext, useEffect, useState } from 'react'
import { assets } from "../assets/frontend_assets/assets"
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { FiSearch, FiUser } from "react-icons/fi";
import { FaChevronDown, FaUser } from "react-icons/fa6";
import { RiFileSearchLine, RiMenu5Fill } from "react-icons/ri";
import { IoBagOutline, IoCart, IoHeart } from "react-icons/io5";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { BsChevronRight } from "react-icons/bs";
import { MdOutlineMail } from "react-icons/md";
import SearchModal from './Search';
import { UiContext } from '../context/UiContext';
import { HashLink } from 'react-router-hash-link';

// Dropdown Menu Component
const DropdownMenu = ({ title, items, isActive }) => {
    const { openSlideCart } = useContext(UiContext);
    return (
        <div className="group relative">
            <NavLink  className={`flex flex-col items-center gap-0 transition-all hover:scale-105 ease-in-out duration-150 ${isActive ? 'text-orange-500' : ''}`}>
                <span className='text-md teko m-0 p-0 font-semibold flex items-center gap-1'>
                    {title}<FaChevronDown className="text-xs font-semibold" />
                </span>
            </NavLink>

            {/* Dropdown container */}
            <div className="invisible absolute left-0 z-20 pt-4 transition-all duration-300 group-hover:visible opacity-0 group-hover:opacity-100 top-8 w-[200px]">
                <div className="bg-white rounded shadow-lg py-2  border border-gray-100 w-full">
                    {items.map((item, index) => (
                        item.useHashLink ? (
                            <HashLink
                                key={index}
                                to={item.link}
                                smooth
                                className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-orange-500 transition-colors"
                            >
                                {item.name}
                            </HashLink>
                        ) : (
                            <Link
                                key={index}
                                to={item.link}
                                className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-orange-500 transition-colors"
                            >
                                {item.name}
                            </Link>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [viewMobileNavItems, setViewMobileNavItems] = useState(false);
    const { showSearch, setShowSearch, getCartCount, navigate, token, setToken, setCartItems, subCategoryData } = useContext(ShopContext);
    const location = useLocation();
    const { openSlideCart } = useContext(UiContext);

    const logout = () => {
        navigate("/login")
        localStorage.removeItem("token")
        setToken("");
        setCartItems({})
    }



    // Dropdown menu items for each category
    const menuItems = {
        Home: [
            { name: "Home", link: "/" },
            { name: "Explore Collections", link: "/#collections", useHashLink: true },
            { name: "Today's Top Picks", link: "/#top-picks", useHashLink: true },
            { name: "More Collections", link: "/#more-collections", useHashLink: true },
            { name: "Best Selling Products", link: "/#best-selling", useHashLink: true },
            { name: "Special Offer", link: "/#special-offer", useHashLink: true },
            { name: "Our Policy", link: "/#our-policy", useHashLink: true },
            { name: "Customer Reviews", link: "/#reviews", useHashLink: true },
        ],
        Shop: Object.keys(subCategoryData).length > 0
            ? Object.entries(subCategoryData).flatMap(([category, subcategories]) => [
                // First add the main category
                { name: category.charAt(0).toUpperCase() + category.slice(1), link: `/category/${category}`, useHashLink: false },
                // Then add subcategories (indented or with a different style)
                // ...subcategories.map(subcategory => (
                //   { name: `- ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`, link: `/category/${category}/${subcategory}`, useHashLink: false }
                // ))
            ])
            : [{ name: "No Categories", link: "/category", useHashLink: false }],

        Products: Object.keys(subCategoryData).length > 0
            ? Object.entries(subCategoryData).flatMap(([category, subcategories]) => [
                // First add the main category
                // { name: category.charAt(0).toUpperCase() + category.slice(1), link: `/category/${category}`, useHashLink: false },
                // Then add subcategories (indented or with a different style)
                ...subcategories.map(subcategory => (
                    { name: `${category.charAt(0).toUpperCase() + category.slice(1) +" "+ subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`, link: `/category/${category}/${subcategory}`, useHashLink: false }
                ))
            ])
            : [{ name: "No Categories", link: "/category", useHashLink: false }],

        Pages: [
            { name: "Wish List", link: "/wishlist" },
            // { name: "Search Result", link: "/search" },
            { name: "Shopping Cart", link: "/cart" },
            { name: "Login/Register", link: "/login" },
            // { name: "Forget Password", link: "/forgot-password" },
            { name: "Order Tracking", link: "/orders" },
            { name: "My Account", link: "/account" },
        ],
        // Contact: [
        //     { name: "Contact Us", link: "/contact" },
        //     { name: "About Us", link: "/about" },
        //     { name: "FAQs", link: "/faqs" },
        // ],
        // Blog: [
        //     { name: "Blog Grid", link: "/blog/grid" },
        //     { name: "Blog List", link: "/blog/list" },
        //     { name: "Blog Details", link: "/blog/details" },
        // ],
    };

    const renderMobileSubmenu = (categoryName) => {
        if (!menuItems[categoryName]) return null;
        const { openSlideCart } = useContext(UiContext);

        return (
            <div className="bg-gray-50 pl-8 py-2">
                {menuItems[categoryName].map((item, index) => (
                    item.useHashLink ? (
                        <HashLink
                            key={index}
                            to={item.link}
                            smooth
                            className="block px-2 py-2 text-sm hover:bg-gray-100 hover:text-orange-500 transition-colors"
                            onClick={() => setVisible(false)}
                        >
                            {item.name}
                        </HashLink>
                    ) : (
                        <Link
                            key={index}
                            to={item.link}
                            className="block px-2 py-2 text-sm hover:bg-gray-100 hover:text-orange-500 transition-colors"
                            onClick={() => setVisible(false)}
                        >
                            {item.name}
                        </Link>
                    )
                ))}
            </div>
        );
    };

    return (
        <div className='flex items-center justify-between py-6 font-medium bg-white px-4 text-black'>
            <HiOutlineMenuAlt1
                onClick={() => { setVisible(true) }}
                className='w-6 h-6 cursor-pointer lg:w-6 lg:h-6 lg:hidden md:hidden' alt="" />
            <Link to="/">
                <p className='tracking-wider text-xl teko font-bold text-black'>TRIBE</p>
            </Link>

            <ul className='hidden sm:flex gap-5 text-black'>
                {/* Dropdown menus for each navigation item */}
                {Object.keys(menuItems).map((title) => (
                    <DropdownMenu
                        key={title}
                        title={title}
                        items={menuItems[title]}
                        isActive={location.pathname.includes(title.toLowerCase())}
                    />
                ))}
            </ul>

            <div className='flex items-center gap-3 lg:gap-4 pr-2'>
                {/* <svg className="icon cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#181818" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M21.35 21.0004L17 16.6504" stroke="#181818" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" onClick={() => setShowSearch(!showSearch)}></path>
                </svg> */}
                <SearchModal />

                <div className='group relative hidden lg:flex'>
                    <FiUser className='w-5 h-5 cursor-pointer lg:w-6 lg:h-6' onClick={() => token ? null : navigate("/login")} />

                    {/* Dropdown */}
                    {token &&
                        <div className='invisible group-hover:visible absolute opacity-0 group-hover:opacity-100 transition-all duration-300 right-0 pt-4 z-10 top-4 '>
                            <div className='flex flex-col gap-2 w-44 py-3 px-5 bg-white shadow-lg text-gray-500 rounded border border-gray-100'>
                                <Link to="/account"><p className='cursor-pointer text-white bg-black px-6 py-2 rounded-lg hover:text-black flex justify-center hover:bg-white border border-black text-nowrap' >My Account</p></Link>
                                <button className='cursor-pointer text-white bg-black px-8 py-2 rounded-lg hover:text-black flex justify-center hover:bg-white border border-black' onClick={logout}>Logout</button>
                            </div>
                        </div>
                    }
                </div>
                <Link to='/wishlist' className='relative hidden lg:flex'>
                    <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.8401 4.60987C20.3294 4.09888 19.7229 3.69352 19.0555 3.41696C18.388 3.14039 17.6726 2.99805 16.9501 2.99805C16.2276 2.99805 15.5122 3.14039 14.8448 3.41696C14.1773 3.69352 13.5709 4.09888 13.0601 4.60987L12.0001 5.66987L10.9401 4.60987C9.90843 3.57818 8.50915 2.99858 7.05012 2.99858C5.59109 2.99858 4.19181 3.57818 3.16012 4.60987C2.12843 5.64156 1.54883 7.04084 1.54883 8.49987C1.54883 9.95891 2.12843 11.3582 3.16012 12.3899L4.22012 13.4499L12.0001 21.2299L19.7801 13.4499L20.8401 12.3899C21.3511 11.8791 21.7565 11.2727 22.033 10.6052C22.3096 9.93777 22.4519 9.22236 22.4519 8.49987C22.4519 7.77738 22.3096 7.06198 22.033 6.39452C21.7565 5.72706 21.3511 5.12063 20.8401 4.60987V4.60987Z" stroke="#181818" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </Link>
                <Link to='/cart' className='relative' >
                    <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.5078 10.8734V6.36686C16.5078 5.17166 16.033 4.02541 15.1879 3.18028C14.3428 2.33514 13.1965 1.86035 12.0013 1.86035C10.8061 1.86035 9.65985 2.33514 8.81472 3.18028C7.96958 4.02541 7.49479 5.17166 7.49479 6.36686V10.8734M4.11491 8.62012H19.8877L21.0143 22.1396H2.98828L4.11491 8.62012Z" stroke="#181818" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ></path>
                    </svg>
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-orange-900 text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </Link>
            </div>

            {/* Mobile Menu Overlay */}
            {visible && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setVisible(false)}></div>
            )}

            {/* Modified Mobile Menu - Slide from left */}
            <div className={`fixed top-0 left-0 bottom-0 w-full max-w-sm bg-white z-50 transition-transform duration-300 ease-in-out shadow-lg ${visible ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header with close button and search */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <IoMdClose
                            onClick={() => setVisible(false)}
                            className="w-6 h-6 cursor-pointer"
                        />
                        <div className="relative flex-1 mx-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none"
                            />
                            <IoSearchOutline className="absolute top-2.5 left-3 text-gray-500" />
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="flex-1 overflow-y-auto">
                        {/* Main navigation items */}
                        {Object.keys(menuItems).map((category) => (
                            <div key={category} className='transition-transform duration-300 ease-in-out'>
                                <div
                                    className="flex items-center justify-between py-4 px-5 border-b cursor-pointer"
                                    onClick={() => setViewMobileNavItems(viewMobileNavItems === category ? false : category)}
                                >
                                    <span className={viewMobileNavItems === category ? "text-orange-500 font-medium" : ""}>{category}</span>
                                    <span className="text-lg transition-all duration-200 ease-in-out">{viewMobileNavItems === category ? "−" : "+"}</span>
                                </div>
                                {viewMobileNavItems === category && renderMobileSubmenu(category)}
                            </div>
                        ))}

                        {/* Quick action buttons */}
                        {/* Quick action buttons */}
<div className="flex gap-3 p-5">
    <Link to="/wishlist" className="flex items-center justify-center w-1/2 py-3 bg-gray-100 rounded-md text-sm">
        <FaRegHeart className="mr-2" /> Wishlist
    </Link>
    {token ? (
        <div className="flex flex-col w-1/2 gap-2">
            <Link to="/account" className="flex items-center justify-center py-3 bg-gray-100 rounded-md text-sm">
                <FiUser className="mr-2" /> My Account
            </Link>
            <button 
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }}
                className="flex items-center justify-center py-3 bg-gray-100 rounded-md text-sm">
                Logout
            </button>
        </div>
    ) : (
        <Link to="/login" className="flex items-center justify-center w-1/2 py-3 bg-gray-100 rounded-md text-sm">
            <FiUser className="mr-2" /> Login
        </Link>
    )}
</div>

                        {/* Customer service section */}
                        <div className="p-5">
                            <h3 className="mb-4 font-medium">Need Help?</h3>
                            <p className="mb-2">549 Oak St.Crystal Lake, IL 60014</p>
                            <div className="flex items-center mb-4">
                                <button className="flex items-center text-sm font-medium">
                                    GET DIRECTION <BsChevronRight className="ml-1" />
                                </button>
                            </div>
                            <div className="flex items-center mb-4">
                                <MdOutlineMail className="mr-2" />
                                <span>themesflat@gmail.com</span>
                            </div>
                        </div>

                        {/* Language and currency selectors */}
                        <div className="flex items-center justify-between p-5 border-t mt-auto">
                            <div className="flex items-center">
                                <span className="mr-2">🇺🇸</span>
                                <select className="bg-transparent border-none text-sm">
                                    <option>USD</option>
                                </select>
                            </div>
                            <select className="bg-transparent border-none text-sm">
                                <option>English</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar;