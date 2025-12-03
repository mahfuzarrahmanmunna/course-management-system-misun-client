// src/app/admin/dashboard/layout.js
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
    FaHome,
    FaBook,
    FaUsers,
    FaClipboardList,
    FaChartBar,
    FaCog,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaGraduationCap,
    FaBell,
    FaSearch,
    FaPlus,
    FaEdit
} from 'react-icons/fa';

const AdminDashboardLayout = ({ children }) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Admin navigation links
    const adminNavLinks = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: <FaHome /> },
        { href: '/admin/dashboard/add-course', label: 'Add Course', icon: <FaPlus /> },
        { href: '/admin/dashboard/manage-courses', label: 'Manage Courses', icon: <FaEdit /> },
        { href: '/admin/dashboard/enrollments', label: 'Enrollments', icon: <FaUsers /> },
        { href: '/admin/dashboard/assignments', label: 'Assignment Review', icon: <FaClipboardList /> },
        { href: '/admin/dashboard/analytics', label: 'Analytics', icon: <FaChartBar /> },
        { href: '/admin/dashboard/settings', label: 'Settings', icon: <FaCog /> },
    ];

    // Redirect to login if not authenticated or not an admin
    React.useEffect(() => {
        if (status === 'loading') {
            return; // Do nothing while loading
        }
        if (!session || session.user.role !== 'admin') {
            router.push('/login');
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">Loading Admin Dashboard...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== 'admin') {
        return null; // Will redirect in useEffect
    }

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search functionality
        console.log('Searching for:', searchQuery);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar for desktop */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-indigo-900">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <FaGraduationCap className="text-white text-2xl mr-2" />
                            <Link href="/admin/dashboard" className="text-xl font-bold text-white">
                                CourseMaster
                            </Link>
                        </div>
                        <div className="mt-8 flex-1 flex flex-col">
                            <nav className="flex-1 px-2 space-y-1">
                                {adminNavLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-indigo-800"
                                    >
                                        <span className="mr-3 text-indigo-300 group-hover:text-white">
                                            {link.icon}
                                        </span>
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
                            <div className="flex-shrink-0 w-full group block">
                                <div className="flex items-center">
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">
                                            {session?.user?.name || 'Admin User'}
                                        </p>
                                        <p className="text-xs font-medium text-indigo-300">
                                            Administrator
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/login' })}
                                    className="mt-3 w-full text-left text-sm font-medium text-indigo-300 hover:text-white flex items-center"
                                >
                                    <FaSignOutAlt className="mr-2" />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 flex z-40">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-900">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="sr-only">Close sidebar</span>
                                <FaTimes className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            <div className="flex-shrink-0 flex items-center px-4">
                                <FaGraduationCap className="text-white text-2xl mr-2" />
                                <Link href="/admin/dashboard" className="text-xl font-bold text-white">
                                    CourseMaster
                                </Link>
                            </div>
                            <nav className="mt-5 px-2 space-y-1">
                                {adminNavLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-indigo-800"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="mr-4 text-indigo-300 group-hover:text-white">
                                            {link.icon}
                                        </span>
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
                            <div className="flex-shrink-0 w-full group block">
                                <div className="flex items-center">
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">
                                            {session?.user?.name || 'Admin User'}
                                        </p>
                                        <p className="text-xs font-medium text-indigo-300">
                                            Administrator
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/login' })}
                                    className="mt-3 w-full text-left text-sm font-medium text-indigo-300 hover:text-white flex items-center"
                                >
                                    <FaSignOutAlt className="mr-2" />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0 w-14"></div>
                </div>
            )}

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top header */}
                <header className="bg-white shadow-sm border-b border-gray-200 z-10">
                    <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <button
                                className="md:hidden mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <FaBars className="h-6 w-6" />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Admin Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Search bar */}
                            <form onSubmit={handleSearch} className="hidden md:block">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FaSearch className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </form>

                            {/* Notifications */}
                            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <span className="sr-only">View notifications</span>
                                <FaBell className="h-6 w-6" />
                            </button>

                            {/* User profile dropdown */}
                            <div className="relative">
                                <div className="flex items-center space-x-3">
                                    <div className="hidden md:block text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {session?.user?.name || 'Admin User'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Administrator
                                        </p>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                        <span className="text-white font-medium">
                                            {session?.user?.name?.charAt(0) || 'A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto bg-gray-100">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {/* Page header */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session?.user?.name || 'Admin'}</h1>
                                <p className="mt-1 text-sm text-gray-600">Heres what is happening with your platform today.</p>
                            </div>

                            {/* Page content */}
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;