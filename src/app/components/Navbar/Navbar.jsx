"use client"
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
    FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiBookOpen, FiHome, FiBarChart2,
    FiSearch, FiChevronDown, FiAward, FiClock, FiShoppingCart, FiTrendingUp, FiBell
} from 'react-icons/fi';
import { useRouter, usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    // Refs for GSAP animations
    const navbarRef = useRef(null);
    const logoRef = useRef(null);
    const navLinksRef = useRef([]);
    const userMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const searchRef = useRef(null);
    const userAvatarRef = useRef(null);
    const notificationRef = useRef(null);
    const tl = useRef(gsap.timeline({ paused: true }));

    // GSAP animations
    useGSAP(() => {
        // Navbar scroll animation
        gsap.to(navbarRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
        });

        // Logo animation on load
        gsap.fromTo(logoRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, delay: 0.2, ease: "back.out(1.7)" }
        );

        // Navigation links stagger animation
        gsap.fromTo(navLinksRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: "power2.out" }
        );

        // User avatar animation
        gsap.fromTo(userAvatarRef.current,
            { scale: 0, rotation: -180 },
            { scale: 1, rotation: 0, duration: 0.5, delay: 0.4, ease: "back.out(1.7)" }
        );

        // Mobile menu animation timeline
        tl.current
            .to(mobileMenuRef.current, {
                height: "auto",
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            })
            .fromTo(".mobile-menu-item",
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.2, stagger: 0.05, ease: "power2.out" },
                "-=0.2"
            );
    }, []);

    // Toggle mobile menu with GSAP
    useEffect(() => {
        if (isOpen) {
            tl.current.play();
        } else {
            tl.current.reverse();
        }
    }, [isOpen]);

    // User menu dropdown animation
    useEffect(() => {
        if (showUserMenu) {
            gsap.fromTo(userMenuRef.current,
                { y: -10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.2, ease: "power2.out" }
            );
        }
    }, [showUserMenu]);

    // Notification dropdown animation
    useEffect(() => {
        if (showNotifications) {
            gsap.fromTo(notificationRef.current,
                { y: -10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.2, ease: "power2.out" }
            );
        }
    }, [showNotifications]);

    // Search bar animation
    useEffect(() => {
        if (showSearch) {
            gsap.to(searchRef.current, {
                width: "300px",
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
            searchRef.current.focus();
        } else {
            gsap.to(searchRef.current, {
                width: "0",
                opacity: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }, [showSearch]);

    // Navbar scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target) &&
                !userAvatarRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    const isActive = (path) => {
        return pathname === path;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setShowSearch(false);
        }
    };

    return (
        <nav
            ref={navbarRef}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/80 backdrop-blur-xl shadow-lg py-2'
                : 'bg-white/60 backdrop-blur-lg py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div ref={logoRef} className="flex-shrink-0">
                        <Link href="/" className="flex items-center group">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-3 mr-3 transform transition-all group-hover:rotate-12 group-hover:scale-110 duration-300 shadow-lg">
                                <FiBookOpen className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold text-gray-800">CourseMaster</span>
                        </Link>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:block">
                        <div className="relative overflow-hidden">
                            <div className="absolute inset-0 rounded-full blur-md"></div>
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search courses..."
                                className="relative w-0 opacity-0 px-5 py-3 text-gray-800 rounded-full border placeholder:text-gray-600 border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                            />
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="absolute right-0 top-0 h-full px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <FiSearch className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-1">
                            <Link
                                ref={el => navLinksRef.current[0] = el}
                                href="/"
                                className={`px-4 py-2 rounded-xl text-sm font-medium relative overflow-hidden group transition-all duration-300 ${isActive('/')
                                    ? 'text-blue-600 bg-blue-50/70 backdrop-blur-sm'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center">
                                    <FiHome className="mr-2" />
                                    Home
                                </span>
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform ${isActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                    } transition-transform duration-300`}></span>
                            </Link>
                            <Link
                                ref={el => navLinksRef.current[1] = el}
                                href="/courses"
                                className={`px-4 py-2 rounded-xl text-sm font-medium relative overflow-hidden group transition-all duration-300 ${isActive('/courses')
                                    ? 'text-blue-600 bg-blue-50/70 backdrop-blur-sm'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                                    }`}
                            >
                                <span className="relative z-10">Courses</span>
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform ${isActive('/courses') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                    } transition-transform duration-300`}></span>
                            </Link>
                            <Link
                                ref={el => navLinksRef.current[2] = el}
                                href="/instructors"
                                className={`px-4 py-2 rounded-xl text-sm font-medium relative overflow-hidden group transition-all duration-300 ${isActive('/instructors')
                                    ? 'text-blue-600 bg-blue-50/70 backdrop-blur-sm'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                                    }`}
                            >
                                <span className="relative z-10">Instructors</span>
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform ${isActive('/instructors') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                    } transition-transform duration-300`}></span>
                            </Link>

                            {status === 'authenticated' && (
                                <>
                                    <Link
                                        ref={el => navLinksRef.current[3] = el}
                                        href="/dashboard"
                                        className={`px-4 py-2 rounded-xl text-sm font-medium relative overflow-hidden group transition-all duration-300 ${isActive('/dashboard')
                                            ? 'text-blue-600 bg-blue-50/70 backdrop-blur-sm'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                                            }`}
                                    >
                                        <span className="relative z-10">Dashboard</span>
                                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform ${isActive('/dashboard') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            } transition-transform duration-300`}></span>
                                    </Link>
                                    <Link
                                        ref={el => navLinksRef.current[4] = el}
                                        href="/my-courses"
                                        className={`px-4 py-2 rounded-xl text-sm font-medium relative overflow-hidden group transition-all duration-300 ${isActive('/my-courses')
                                            ? 'text-blue-600 bg-blue-50/70 backdrop-blur-sm'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                                            }`}
                                    >
                                        <span className="relative z-10 flex items-center">
                                            My Courses
                                        </span>
                                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform ${isActive('/my-courses') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            } transition-transform duration-300`}></span>
                                    </Link>

                                    {session?.user?.role === 'admin' && (
                                        <Link
                                            ref={el => navLinksRef.current[5] = el}
                                            href="/admin"
                                            className={`px-4 py-2 rounded-xl text-sm font-medium relative overflow-hidden group transition-all duration-300 ${isActive('/admin')
                                                ? 'text-blue-600 bg-blue-50/70 backdrop-blur-sm'
                                                : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                                                }`}
                                        >
                                            <span className="relative z-10 flex items-center">
                                                <FiBarChart2 className="mr-2" />
                                                Admin
                                            </span>
                                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform ${isActive('/admin') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                                } transition-transform duration-300`}></span>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="hidden md:flex items-center space-x-3">
                        {/* Notification Icon */}
                        {status === 'authenticated' && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-white/50 transition-all duration-300 relative"
                                >
                                    <FiBell className="h-5 w-5" />
                                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                                </button>

                                {showNotifications && (
                                    <div
                                        ref={notificationRef}
                                        className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-xl bg-white/80 backdrop-blur-xl ring-1 ring-white/20 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-gray-100/50">
                                            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            <div className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                                                        <FiBookOpen className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-gray-900">New course available</p>
                                                        <p className="text-xs text-gray-500 mt-1">Advanced React Patterns is now available</p>
                                                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                                                        <FiAward className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-gray-900">Course completed</p>
                                                        <p className="text-xs text-gray-500 mt-1">You've completed JavaScript Fundamentals</p>
                                                        <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2 border-t border-gray-100/50">
                                            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2">
                                                View all notifications
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Cart Icon */}
                        {status === 'authenticated' && (
                            <Link href="/cart" className="p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-white/50 transition-all duration-300 relative">
                                <FiShoppingCart className="h-5 w-5" />
                                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                            </Link>
                        )}

                        {/* User Menu */}
                        {status === 'loading' ? (
                            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                        ) : status === 'authenticated' ? (
                            <div className="relative">
                                <button
                                    ref={userAvatarRef}
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 overflow-hidden"
                                >
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg">
                                        {session.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <FiChevronDown className={`ml-1 h-4 w-4 text-gray-700 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {showUserMenu && (
                                    <div
                                        ref={userMenuRef}
                                        className="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-xl bg-white/80 backdrop-blur-xl ring-1 ring-white/20 overflow-hidden"
                                    >
                                        <div className="py-1">
                                            <div className="px-4 py-3 border-b border-gray-100/50">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold mr-3">
                                                        {session.user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{session.user.name}</div>
                                                        <div className="text-xs text-gray-500 truncate">{session.user.email}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/50 flex items-center transition-colors">
                                                <FiUser className="mr-3 h-4 w-4" />
                                                Profile
                                            </Link>
                                            <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/50 flex items-center transition-colors">
                                                <FiSettings className="mr-3 h-4 w-4" />
                                                Settings
                                            </Link>
                                            <Link href="/certificates" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/50 flex items-center transition-colors">
                                                <FiAward className="mr-3 h-4 w-4" />
                                                Certificates
                                            </Link>
                                            <Link href="/learning-history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/50 flex items-center transition-colors">
                                                <FiClock className="mr-3 h-4 w-4" />
                                                Learning History
                                            </Link>
                                            <button
                                                onClick={handleSignOut}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/50 flex items-center transition-colors"
                                            >
                                                <FiLogOut className="mr-3 h-4 w-4" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link href="/login" className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600/50 rounded-xl hover:bg-blue-50/50 backdrop-blur-sm transition-all duration-300">
                                    Log in
                                </Link>
                                <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-300"
                        >
                            {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                ref={mobileMenuRef}
                className="md:hidden bg-white/80 backdrop-blur-xl border-t border-gray-200/50 overflow-hidden"
                style={{ height: 0, opacity: 0 }}
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link href="/" className={`mobile-menu-item block px-3 py-2 rounded-xl text-base font-medium transition-all duration-300 ${isActive('/')
                        ? 'bg-blue-100/70 text-blue-700 backdrop-blur-sm'
                        : 'text-gray-700 hover:bg-gray-100/50'
                        }`}>
                        <div className="flex items-center">
                            <FiHome className="mr-2" />
                            Home
                        </div>
                    </Link>
                    <Link href="/courses" className={`mobile-menu-item block px-3 py-2 rounded-xl text-base font-medium transition-all duration-300 ${isActive('/courses')
                        ? 'bg-blue-100/70 text-blue-700 backdrop-blur-sm'
                        : 'text-gray-700 hover:bg-gray-100/50'
                        }`}>
                        Courses
                    </Link>
                    <Link href="/instructors" className={`mobile-menu-item block px-3 py-2 rounded-xl text-base font-medium transition-all duration-300 ${isActive('/instructors')
                        ? 'bg-blue-100/70 text-blue-700 backdrop-blur-sm'
                        : 'text-gray-700 hover:bg-gray-100/50'
                        }`}>
                        Instructors
                    </Link>

                    {status === 'authenticated' && (
                        <>
                            <Link href="/dashboard" className={`mobile-menu-item block px-3 py-2 rounded-xl text-base font-medium transition-all duration-300 ${isActive('/dashboard')
                                ? 'bg-blue-100/70 text-blue-700 backdrop-blur-sm'
                                : 'text-gray-700 hover:bg-gray-100/50'
                                }`}>
                                Dashboard
                            </Link>
                            <Link href="/my-courses" className={`mobile-menu-item block px-3 py-2 rounded-xl text-base font-medium transition-all duration-300 ${isActive('/my-courses')
                                ? 'bg-blue-100/70 text-blue-700 backdrop-blur-sm'
                                : 'text-gray-700 hover:bg-gray-100/50'
                                }`}>
                                My Courses
                            </Link>

                            {session?.user?.role === 'admin' && (
                                <Link href="/admin" className={`mobile-menu-item block px-3 py-2 rounded-xl text-base font-medium transition-all duration-300 ${isActive('/admin')
                                    ? 'bg-blue-100/70 text-blue-700 backdrop-blur-sm'
                                    : 'text-gray-700 hover:bg-gray-100/50'
                                    }`}>
                                    <div className="flex items-center">
                                        <FiBarChart2 className="mr-2" />
                                        Admin
                                    </div>
                                </Link>
                            )}
                        </>
                    )}

                    {status === 'authenticated' ? (
                        <>
                            <div className="border-t border-gray-200/50 pt-2">
                                <div className="px-3 py-2 text-sm text-gray-700">
                                    <div className="font-medium">{session.user.name}</div>
                                    <div className="text-gray-500 truncate">{session.user.email}</div>
                                </div>
                                <Link href="/profile" className="mobile-menu-item block px-3 py-2 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-100/50 transition-all duration-300">
                                    <div className="flex items-center">
                                        <FiUser className="mr-2" />
                                        Profile
                                    </div>
                                </Link>
                                <Link href="/settings" className="mobile-menu-item block px-3 py-2 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-100/50 transition-all duration-300">
                                    <div className="flex items-center">
                                        <FiSettings className="mr-2" />
                                        Settings
                                    </div>
                                </Link>
                                <Link href="/certificates" className="mobile-menu-item block px-3 py-2 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-100/50 transition-all duration-300">
                                    <div className="flex items-center">
                                        <FiAward className="mr-2" />
                                        Certificates
                                    </div>
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="mobile-menu-item block w-full text-left px-3 py-2 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-100/50 transition-all duration-300"
                                >
                                    <div className="flex items-center">
                                        <FiLogOut className="mr-2" />
                                        Sign out
                                    </div>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="border-t border-gray-200/50 pt-2 flex space-x-2 px-3">
                            <Link href="/login" className="flex-1 text-center px-4 py-2 text-base font-medium text-blue-600 border border-blue-600/50 rounded-xl hover:bg-blue-50/50 backdrop-blur-sm transition-all duration-300">
                                Log in
                            </Link>
                            <Link href="/register" className="flex-1 text-center px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;