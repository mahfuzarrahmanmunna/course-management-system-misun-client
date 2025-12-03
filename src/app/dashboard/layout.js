// src/app/dashboard/layout.js
'use client'; // This is a client component because it uses hooks

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'; // Import NextAuth hooks
import { FaUserGraduate, FaChalkboardTeacher, FaHome, FaBook, FaChartBar, FaTasks, FaUsers, FaSignOutAlt, FaCog, FaClipboardList } from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
    const router = useRouter();
    const { data: session, status } = useSession(); // Get session and loading status
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    // Redirect to login if the session is loading or there is no session
    React.useEffect(() => {
        if (status === 'loading') {
            return; // Do nothing while loading
        }
        if (!session) {
            router.push('/login');
        }
    }, [session, status, router]);

    // Student navigation links
    const studentNavLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
        { href: '/dashboard/courses', label: 'My Courses', icon: <FaBook /> },
        { href: '/dashboard/assignments', label: 'Assignments', icon: <FaTasks /> },
        { href: '/dashboard/profile', label: 'Profile', icon: <FaCog /> },
    ];

    // Admin navigation links
    const adminNavLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
        { href: '/dashboard/courses', label: 'Course Management', icon: <FaBook /> },
        { href: '/dashboard/enrollments', label: 'Enrollments', icon: <FaUsers /> },
        { href: '/dashboard/assignments', label: 'Assignment Review', icon: <FaClipboardList /> },
        { href: '/dashboard/analytics', label: 'Analytics', icon: <FaChartBar /> },
        { href: '/dashboard/profile', label: 'Profile', icon: <FaCog /> },
    ];

    // Determine which links to show based on the user's role from the session
    const navLinks = session?.user?.role === 'admin' ? adminNavLinks : studentNavLinks;

    // Show a loading indicator while the session is being fetched
    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    // If there is no session, don't render anything (the useEffect will handle the redirect)
    if (!session) {
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar for desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-gray-200">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <Link href="/" className="text-xl font-bold text-indigo-600">
                            CourseMaster
                        </Link>
                    </div>
                    <div className="mt-8 flex-1 flex flex-col">
                        <nav className="flex-1 px-2 pb-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    <span className="mr-3 text-gray-400 group-hover:text-gray-500">
                                        {link.icon}
                                    </span>
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                        <div className="flex-shrink-0 w-full group block">
                            <div className="flex items-center">
                                <div>
                                    {session?.user?.role === 'admin' ? (
                                        <FaChalkboardTeacher className="h-8 w-8 rounded-full bg-indigo-500 text-white p-1" />
                                    ) : (
                                        <FaUserGraduate className="h-8 w-8 rounded-full bg-indigo-500 text-white p-1" />
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700">
                                        {session?.user?.name || 'User'}
                                    </p>
                                    <p className="text-xs font-medium text-gray-500">
                                        {session?.user?.role === 'admin' ? 'Administrator' : 'Student'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })} // Use NextAuth's signOut function
                                className="mt-3 w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center"
                            >
                                <FaSignOutAlt className="mr-2" />
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar (implementation remains the same, just uses session data) */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 flex z-40">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                        {/* ... (mobile sidebar content is very similar to desktop) ... */}
                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            <div className="flex-shrink-0 flex items-center px-4">
                                <Link href="/" className="text-xl font-bold text-indigo-600">CourseMaster</Link>
                            </div>
                            <nav className="mt-5 px-2 space-y-1">
                                {navLinks.map((link) => (
                                    <Link key={link.href} href={link.href} className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50" onClick={() => setSidebarOpen(false)}>
                                        <span className="mr-4 text-gray-400 group-hover:text-gray-500">{link.icon}</span>
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                            <div className="flex-shrink-0 w-full group block">
                                <div className="flex items-center">
                                    <div>
                                        {session?.user?.role === 'admin' ? <FaChalkboardTeacher className="h-8 w-8 rounded-full bg-indigo-500 text-white p-1" /> : <FaUserGraduate className="h-8 w-8 rounded-full bg-indigo-500 text-white p-1" />}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700">{session?.user?.name || 'User'}</p>
                                        <p className="text-xs font-medium text-gray-500">{session?.user?.role === 'admin' ? 'Administrator' : 'Student'}</p>
                                    </div>
                                </div>
                                <button onClick={() => signOut({ callbackUrl: '/login' })} className="mt-3 w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center">
                                    <FaSignOutAlt className="mr-2" /> Sign out
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
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-lg font-semibold text-gray-900">
                            {session?.user?.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
                        </h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Welcome, {session?.user?.name || 'User'}</span>
                            {session?.user?.role === 'admin' ? (
                                <FaChalkboardTeacher className="h-8 w-8 rounded-full bg-indigo-500 text-white p-1" />
                            ) : (
                                <FaUserGraduate className="h-8 w-8 rounded-full bg-indigo-500 text-white p-1" />
                            )}
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;