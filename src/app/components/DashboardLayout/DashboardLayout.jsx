// src/app/components/DashboardLayout.jsx
"use client"
import { useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiHome,
    FiBook,
    FiFileText,
    FiTrendingUp,
    FiSettings,
    FiUsers,
    FiBarChart2,
    FiBell,
    FiLogOut,
    FiMenu,
    FiX,
    FiChevronDown,
    FiGrid,
    FiUser,
    FiCalendar,
    FiAward,
    FiClock,
    FiMessageSquare,
    FiHelpCircle,
    FiMail,
    FiLock,
    FiDatabase,
    FiShield,
    FiGlobe,
    FiTag,
    FiShoppingCart,
    FiDollarSign,
    FiActivity,
    FiPackage,
    FiStar,
    FiEdit,
    FiTrash2,
    FiPlus,
    FiSearch,
    FiFilter,
    FiDownload,
    FiUpload,
    FiCheck,
    FiAlertCircle,
    FiInfo,
    FiExternalLink
} from 'react-icons/fi';

const DashboardLayout = ({ children, userRole }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    // Student navigation items
    const studentNavItems = [
        {
            title: "Dashboard",
            icon: FiHome,
            path: "/student/dashboard",
            color: "text-blue-500"
        },
        {
            title: "My Courses",
            icon: FiBook,
            path: "/student/courses",
            color: "text-green-500"
        },
        {
            title: "Assignments",
            icon: FiFileText,
            path: "/student/assignments",
            color: "text-purple-500"
        },
        {
            title: "Progress",
            icon: FiTrendingUp,
            path: "/student/progress",
            color: "text-orange-500"
        },
        {
            title: "Schedule",
            icon: FiCalendar,
            path: "/student/schedule",
            color: "text-pink-500"
        },
        {
            title: "Achievements",
            icon: FiAward,
            path: "/student/achievements",
            color: "text-yellow-500"
        },
        {
            title: "Messages",
            icon: FiMessageSquare,
            path: "/student/messages",
            color: "text-indigo-500"
        },
        {
            title: "Settings",
            icon: FiSettings,
            path: "/student/settings",
            color: "text-gray-500"
        }
    ];

    // Admin navigation items
    const adminNavItems = [
        {
            title: "Dashboard",
            icon: FiGrid,
            path: "/admin/dashboard",
            color: "text-blue-500"
        },
        {
            title: "User Management",
            icon: FiUsers,
            path: "/admin/users",
            color: "text-green-500"
        },
        {
            title: "Course Management",
            icon: FiBook,
            path: "/admin/courses",
            color: "text-purple-500"
        },
        {
            title: "Analytics",
            icon: FiBarChart2,
            path: "/admin/analytics",
            color: "text-orange-500"
        },
        {
            title: "Notifications",
            icon: FiBell,
            path: "/admin/notifications",
            color: "text-pink-500"
        },
        {
            title: "System Settings",
            icon: FiSettings,
            path: "/admin/settings",
            color: "text-gray-500"
        },
        {
            title: "Reports",
            icon: FiFileText,
            path: "/admin/reports",
            color: "text-indigo-500"
        },
        {
            title: "Security",
            icon: FiShield,
            path: "/admin/security",
            color: "text-red-500"
        }
    ];

    const navItems = userRole === 'admin' ? adminNavItems : studentNavItems;

    const handleSignOut = () => {
        signOut({ callbackUrl: "/" });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <Link href="/" className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-2 mr-3">
                            <FiGrid className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold text-gray-800">CourseMaster</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <FiX className="h-6 w-6" />
                    </button>
                </div>

                {/* User Profile Section */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                                {session?.user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-6 flex-1 px-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${isActive
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 ${isActive ? item.color : 'text-gray-400 group-hover:text-gray-500'}`} />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
                    <button
                        onClick={handleSignOut}
                        className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 w-full transition-colors duration-150"
                    >
                        <FiLogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-sm border-b border-gray-200 z-10">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <FiMenu className="h-6 w-6" />
                        </button>

                        <div className="flex items-center space-x-4">
                            {/* Search Bar */}
                            <div className="hidden md:block relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Notifications */}
                            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <FiBell className="h-6 w-6" />
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                                        {session?.user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <FiChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                                </button>

                                {profileDropdownOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
                                        <div className="py-1">
                                            <Link
                                                href={`/${userRole}/profile`}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Your Profile
                                            </Link>
                                            <Link
                                                href={`/${userRole}/settings`}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Settings
                                            </Link>
                                            <button
                                                onClick={handleSignOut}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default DashboardLayout;