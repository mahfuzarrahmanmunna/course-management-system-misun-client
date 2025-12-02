"use client"
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
    FiHome, FiBookOpen, FiSearch, FiUser, FiBarChart2, FiShoppingCart,
    FiPlay, FiAward, FiGrid, FiPlusCircle, FiX, FiArrowLeft, FiTrendingUp,
    FiSettings, FiLogOut, FiHeart, FiBookmark
} from 'react-icons/fi';

const BottomNavbar = () => {
    const [activeTab, setActiveTab] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const navRef = useRef(null);
    const navItemsRef = useRef([]);
    const indicatorRef = useRef(null);
    const moreMenuRef = useRef(null);

    // Set active tab based on current path
    useEffect(() => {
        if (pathname === '/') setActiveTab('home');
        else if (pathname === '/courses') setActiveTab('courses');
        else if (pathname === '/search') setActiveTab('search');
        else if (pathname === '/dashboard' || pathname === '/my-courses') setActiveTab('dashboard');
        else if (pathname === '/profile') setActiveTab('profile');
        else if (pathname === '/admin') setActiveTab('admin');
        else setActiveTab('');
    }, [pathname]);

    useGSAP(() => {
        // Initial entrance animation
        gsap.fromTo(navRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, delay: 0.8, ease: "power3.out" }
        );

        // Stagger animation for nav items
        gsap.fromTo(navItemsRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, delay: 0.9, ease: "power2.out" }
        );
    }, []);

    // Animate indicator when active tab changes
    useEffect(() => {
        if (activeTab && indicatorRef.current) {
            const activeIndex = navItemsRef.current.findIndex(
                item => item.dataset.tab === activeTab
            );

            if (activeIndex !== -1) {
                const activeItem = navItemsRef.current[activeIndex];
                const itemRect = activeItem.getBoundingClientRect();
                const navRect = navRef.current.getBoundingClientRect();

                gsap.to(indicatorRef.current, {
                    x: itemRect.left - navRect.left + itemRect.width / 2 - indicatorRef.current.offsetWidth / 2,
                    width: itemRect.width * 0.6,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        }
    }, [activeTab]);

    // Handle search submission
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setShowSearch(false);
        }
    };

    // Public navigation items
    const publicNavItems = [
        {
            id: 'home',
            label: 'Home',
            icon: <FiHome className="h-5 w-5" />,
            href: '/'
        },
        {
            id: 'courses',
            label: 'Courses',
            icon: <FiBookOpen className="h-5 w-5" />,
            href: '/courses'
        },
        {
            id: 'search',
            label: 'Search',
            icon: <FiSearch className="h-5 w-5" />,
            href: '#',
            action: () => setShowSearch(true)
        }
    ];

    // Authenticated navigation items
    const authNavItems = [
        {
            id: 'home',
            label: 'Home',
            icon: <FiHome className="h-5 w-5" />,
            href: '/'
        },
        {
            id: 'courses',
            label: 'Courses',
            icon: <FiBookOpen className="h-5 w-5" />,
            href: '/courses'
        },
        {
            id: 'dashboard',
            label: 'Learn',
            icon: <FiPlay className="h-5 w-5" />,
            href: '/dashboard'
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: <FiUser className="h-5 w-5" />,
            href: '/profile'
        }
    ];

    // Admin navigation items
    const adminNavItems = [
        {
            id: 'home',
            label: 'Home',
            icon: <FiHome className="h-5 w-5" />,
            href: '/'
        },
        {
            id: 'courses',
            label: 'Courses',
            icon: <FiBookOpen className="h-5 w-5" />,
            href: '/courses'
        },
        {
            id: 'admin',
            label: 'Admin',
            icon: <FiBarChart2 className="h-5 w-5" />,
            href: '/admin'
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: <FiUser className="h-5 w-5" />,
            href: '/profile'
        }
    ];

    // More menu items
    const moreMenuItems = [
        {
            id: 'wishlist',
            label: 'Wishlist',
            icon: <FiHeart className="h-5 w-5" />,
            href: '/wishlist'
        },
        {
            id: 'bookmarks',
            label: 'Bookmarks',
            icon: <FiBookmark className="h-5 w-5" />,
            href: '/bookmarks'
        },
        {
            id: 'trending',
            label: 'Trending',
            icon: <FiTrendingUp className="h-5 w-5" />,
            href: '/trending'
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: <FiSettings className="h-5 w-5" />,
            href: '/settings'
        },
        ...(status === 'authenticated' ? [{
            id: 'logout',
            label: 'Logout',
            icon: <FiLogOut className="h-5 w-5" />,
            action: () => {
                // Add logout logic here
                console.log('Logout clicked');
            }
        }] : [])
    ];

    // Determine which navigation items to show
    let navItems = publicNavItems;
    if (status === 'authenticated') {
        navItems = session?.user?.role === 'admin' ? adminNavItems : authNavItems;
    }

    return (
        <>
            <div className="h-20 md:h-0"></div> {/* Spacer to prevent content overlap */}

            {/* Search Overlay */}
            <SearchOverlay
                isOpen={showSearch}
                onClose={() => setShowSearch(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
            />

            {/* More Menu Overlay */}
            <MoreMenuOverlay
                isOpen={showMoreMenu}
                onClose={() => setShowMoreMenu(false)}
                menuItems={moreMenuItems}
            />

            {/* Professional Glassmorphism Bottom Navbar */}
            <nav
                ref={navRef}
                className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
                style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.1)',
                    height: '80px'
                }}
            >
                {/* Active indicator */}
                <div
                    ref={indicatorRef}
                    className="absolute top-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 shadow-lg"
                    style={{ width: '20px', left: '20px' }}
                ></div>

                <div className="flex justify-around items-center h-full px-2">
                    {navItems.map((item, index) => (
                        <div key={item.id} className="flex flex-col items-center justify-center flex-1 h-full">
                            {item.action ? (
                                <button
                                    ref={el => navItemsRef.current[index] = el}
                                    data-tab={item.id}
                                    className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${activeTab === item.id
                                        ? 'text-blue-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    onClick={item.action}
                                >
                                    <div className={`relative p-3 rounded-2xl transition-all duration-200 ${activeTab === item.id
                                        ? 'bg-blue-100 shadow-md transform scale-110'
                                        : 'hover:bg-gray-100'
                                        }`}>
                                        {item.icon}
                                        {item.id === 'dashboard' && (
                                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full shadow-sm animate-pulse"></span>
                                        )}
                                    </div>
                                    <span className="text-xs mt-1 font-medium">{item.label}</span>
                                </button>
                            ) : (
                                <Link
                                    href={item.href}
                                    ref={el => navItemsRef.current[index] = el}
                                    data-tab={item.id}
                                    className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${activeTab === item.id
                                        ? 'text-blue-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    <div className={`relative p-3 rounded-2xl transition-all duration-200 ${activeTab === item.id
                                        ? 'bg-blue-100 shadow-md transform scale-110'
                                        : 'hover:bg-gray-100'
                                        }`}>
                                        {item.icon}
                                        {item.id === 'dashboard' && (
                                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full shadow-sm animate-pulse"></span>
                                        )}
                                    </div>
                                    <span className="text-xs mt-1 font-medium">{item.label}</span>
                                </Link>
                            )}
                        </div>
                    ))}

                    {/* More menu button */}
                    <div className="flex flex-col items-center justify-center flex-1 h-full">
                        <button
                            ref={el => navItemsRef.current[navItems.length] = el}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${showMoreMenu
                                ? 'text-blue-600'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setShowMoreMenu(true)}
                        >
                            <div className={`p-3 rounded-2xl transition-all duration-200 ${showMoreMenu
                                ? 'bg-blue-100 shadow-md transform scale-110'
                                : 'hover:bg-gray-100'
                                }`}>
                                <FiGrid className="h-5 w-5" />
                            </div>
                            <span className="text-xs mt-1 font-medium">More</span>
                        </button>
                    </div>
                </div>

                {/* Floating Action Button for creating content (admin) */}
                {status === 'authenticated' && session?.user?.role === 'admin' && (
                    <button
                        className="absolute -top-6 right-4 h-14 w-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        style={{
                            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)'
                        }}
                    >
                        <FiPlusCircle className="h-6 w-6" />
                    </button>
                )}
            </nav>
        </>
    );
};

// Enhanced Search Overlay Component
const SearchOverlay = ({ isOpen, onClose, searchQuery, setSearchQuery, handleSearch }) => {
    const overlayRef = useRef(null);
    const searchContainerRef = useRef(null);
    const inputRef = useRef(null);
    const backdropRef = useRef(null);

    useGSAP(() => {
        if (isOpen) {
            // Show the search overlay
            gsap.to(backdropRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });

            gsap.fromTo(searchContainerRef.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, delay: 0.1, ease: "back.out(1.2)" }
            );

            // Focus the input field
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        } else {
            // Hide the search overlay
            gsap.to(backdropRef.current, {
                opacity: 0,
                duration: 0.2,
                ease: "power2.in"
            });

            gsap.to(searchContainerRef.current, {
                y: -50,
                opacity: 0,
                duration: 0.2,
                ease: "power2.in"
            });
        }
    }, [isOpen]);

    // Close search on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div ref={overlayRef} className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
                ref={backdropRef}
                className="absolute inset-0 bg-black bg-opacity-40 opacity-0"
                onClick={onClose}
                style={{
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                }}
            ></div>

            {/* Enhanced Glassmorphism Search Container */}
            <div
                ref={searchContainerRef}
                className="relative"
                style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                }}
            >
                <div className="flex items-center p-4">
                    <button
                        onClick={onClose}
                        className="mr-3 p-3 rounded-full hover:bg-white hover:bg-opacity-60 transition-all duration-200"
                        style={{
                            background: 'rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)'
                        }}
                    >
                        <FiArrowLeft className="h-5 w-5 text-gray-700" />
                    </button>

                    <form onSubmit={handleSearch} className="flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search courses, instructors, topics..."
                            className="w-full px-4 py-3 rounded-full text-gray-800 placeholder:text-xs text-xs placeholder:text-gray-600 focus:outline-none transition-all duration-200"
                            style={{
                                background: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.5)'
                            }}
                        />
                    </form>

                    <button
                        onClick={handleSearch}
                        className="ml-3 p-3 rounded-full text-white transition-all duration-300 transform hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)'
                        }}
                    >
                        <FiSearch className="h-5 w-5" />
                    </button>
                </div>

                {/* Search Suggestions */}
                <div className="px-4 pb-4">
                    <p className="text-sm text-gray-700 mb-3 font-medium">Popular searches:</p>
                    <div className="flex flex-wrap gap-2">
                        {['Web Development', 'Data Science', 'UI/UX Design', 'Mobile Apps'].map((term) => (
                            <button
                                key={term}
                                onClick={() => {
                                    setSearchQuery(term);
                                    handleSearch(new Event('submit'));
                                }}
                                className="px-4 py-2 rounded-full text-xs text-gray-800 font-medium transition-all duration-200 hover:transform hover:scale-105"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.6)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.4)'
                                }}
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// More Menu Overlay Component
const MoreMenuOverlay = ({ isOpen, onClose, menuItems }) => {
    const overlayRef = useRef(null);
    const menuContainerRef = useRef(null);
    const backdropRef = useRef(null);

    useGSAP(() => {
        if (isOpen) {
            // Show the menu overlay
            gsap.to(backdropRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });

            gsap.fromTo(menuContainerRef.current,
                { y: 300, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, delay: 0.1, ease: "back.out(1.2)" }
            );
        } else {
            // Hide the menu overlay
            gsap.to(backdropRef.current, {
                opacity: 0,
                duration: 0.2,
                ease: "power2.in"
            });

            gsap.to(menuContainerRef.current, {
                y: 300,
                opacity: 0,
                duration: 0.2,
                ease: "power2.in"
            });
        }
    }, [isOpen]);

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div ref={overlayRef} className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
                ref={backdropRef}
                className="absolute inset-0 bg-black bg-opacity-40 opacity-0"
                onClick={onClose}
                style={{
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                }}
            ></div>

            {/* Glassmorphism Menu Container */}
            <div
                ref={menuContainerRef}
                className="absolute bottom-20 left-0 right-0"
                style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.1)'
                }}
            >
                <div className="p-4">
                    <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {menuItems.map((item) => (
                            <div key={item.id} className="flex flex-col items-center">
                                {item.action ? (
                                    <button
                                        onClick={item.action}
                                        className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 mb-2"
                                    >
                                        {item.icon}
                                    </button>
                                ) : (
                                    <Link href={item.href} className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 mb-2">
                                        {item.icon}
                                    </Link>
                                )}
                                <span className="text-xs text-gray-700">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BottomNavbar;