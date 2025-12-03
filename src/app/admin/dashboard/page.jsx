// src/app/admin/dashboard/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
    FaBook,
    FaUsers,
    FaUserGraduate,
    FaChartBar,
    FaPlus,
    FaEye,
    FaClock,
    FaDollarSign,
    FaClipboardList,
    FaChartLine,
    FaStar,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';

const AdminPage = () => {
    const router = useRouter();
    const { data: session, status } = 'useSession';
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        totalInstructors: 0,
        totalRevenue: 0,
        pendingAssignments: 0,
        recentEnrollments: 0
    });
    const [recentCourses, setRecentCourses] = useState([]);
    const [recentEnrollments, setRecentEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Redirect non-admins
    // useEffect(() => {
    //     if (status === 'loading') return;
    //     if (!session || session.user.role !== 'admin') {
    //         router.push('/login');
    //     }
    // }, [session, status, router]);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // In a real application, you would fetch this data from your API
                // For now, we'll use mock data
                setStats({
                    totalCourses: 42,
                    totalStudents: 1250,
                    totalInstructors: 18,
                    totalRevenue: 45780,
                    pendingAssignments: 23,
                    recentEnrollments: 47
                });

                setRecentCourses([
                    { id: 1, title: 'Introduction to React', instructor: 'John Doe', enrollments: 125, createdAt: '2023-11-15' },
                    { id: 2, title: 'Advanced JavaScript', instructor: 'Jane Smith', enrollments: 98, createdAt: '2023-11-14' },
                    { id: 3, title: 'UI/UX Design Fundamentals', instructor: 'Mike Johnson', enrollments: 87, createdAt: '2023-11-13' },
                    { id: 4, title: 'Python for Data Science', instructor: 'Sarah Williams', enrollments: 156, createdAt: '2023-11-12' },
                    { id: 5, title: 'Digital Marketing Mastery', instructor: 'David Brown', enrollments: 73, createdAt: '2023-11-11' }
                ]);

                setRecentEnrollments([
                    { id: 1, studentName: 'Alice Johnson', courseTitle: 'Introduction to React', enrollmentDate: '2023-11-15T10:30:00Z', status: 'active' },
                    { id: 2, studentName: 'Bob Smith', courseTitle: 'Advanced JavaScript', enrollmentDate: '2023-11-15T09:15:00Z', status: 'active' },
                    { id: 3, studentName: 'Charlie Brown', courseTitle: 'UI/UX Design Fundamentals', enrollmentDate: '2023-11-14T16:45:00Z', status: 'active' },
                    { id: 4, studentName: 'Diana Prince', courseTitle: 'Python for Data Science', enrollmentDate: '2023-11-14T14:20:00Z', status: 'pending' },
                    { id: 5, studentName: 'Ethan Hunt', courseTitle: 'Digital Marketing Mastery', enrollmentDate: '2023-11-13T11:10:00Z', status: 'active' }
                ]);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchDashboardData();
        }
    }, [status]);

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== 'admin') {
        return null; // Will redirect in useEffect
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatDateTime = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-600">Welcome back, {session?.user?.name || 'Admin'}. Here's what's happening with your platform today.</p>
                </div>
                <div className="flex space-x-3">
                    <Link href="/admin/dashboard/add-course" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <FaPlus className="mr-2" />
                        Add New Course
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                <FaBook className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">{stats.totalCourses}</div>
                                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                            <FaArrowUp className="self-center mr-1" />
                                            12%
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <Link href="/admin/dashboard/courses" className="font-medium text-indigo-700 hover:text-indigo-900">
                                View all courses
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                <FaUsers className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">{stats.totalStudents.toLocaleString()}</div>
                                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                            <FaArrowUp className="self-center mr-1" />
                                            8%
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <Link href="/admin/dashboard/students" className="font-medium text-indigo-700 hover:text-indigo-900">
                                View all students
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                                <FaUserGraduate className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Instructors</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">{stats.totalInstructors}</div>
                                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                            <FaArrowUp className="self-center mr-1" />
                                            5%
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <Link href="/admin/dashboard/instructors" className="font-medium text-indigo-700 hover:text-indigo-900">
                                View all instructors
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                                <FaDollarSign className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">${stats.totalRevenue.toLocaleString()}</div>
                                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                            <FaArrowUp className="self-center mr-1" />
                                            18%
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <Link href="/admin/dashboard/revenue" className="font-medium text-indigo-700 hover:text-indigo-900">
                                View revenue details
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                                <FaClipboardList className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Assignments</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">{stats.pendingAssignments}</div>
                                        <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                                            <FaArrowUp className="self-center mr-1" />
                                            3
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <Link href="/admin/dashboard/assignments" className="font-medium text-indigo-700 hover:text-indigo-900">
                                Review assignments
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                <FaClock className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Recent Enrollments</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">{stats.recentEnrollments}</div>
                                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                            <FaArrowUp className="self-center mr-1" />
                                            7%
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <Link href="/admin/dashboard/enrollments" className="font-medium text-indigo-700 hover:text-indigo-900">
                                View all enrollments
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Courses Table */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Courses</h3>
                        <Link href="/admin/dashboard/courses" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            View all
                        </Link>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            {recentCourses.map((course, index) => (
                                <div key={course.id} className={`${index !== 0 ? 'border-t border-gray-200' : ''} bg-white px-4 py-5 hover:bg-gray-50 sm:px-6`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-indigo-600 truncate">{course.title}</p>
                                            <p className="text-sm text-gray-500">By {course.instructor} • {course.enrollments} students</p>
                                        </div>
                                        <div className="flex-shrink-0 text-sm text-gray-500">
                                            {formatDate(course.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                {/* Recent Enrollments Table */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Enrollments</h3>
                        <Link href="/admin/dashboard/enrollments" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            View all
                        </Link>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            {recentEnrollments.map((enrollment, index) => (
                                <div key={enrollment.id} className={`${index !== 0 ? 'border-t border-gray-200' : ''} bg-white px-4 py-5 hover:bg-gray-50 sm:px-6`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{enrollment.studentName}</p>
                                            <p className="text-sm text-gray-500">Enrolled in {enrollment.courseTitle}</p>
                                        </div>
                                        <div className="flex-shrink-0 flex items-center">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${enrollment.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {enrollment.status}
                                            </span>
                                            <span className="ml-2 text-sm text-gray-500">
                                                {formatDateTime(enrollment.enrollmentDate)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link href="/admin/dashboard/add-course" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <FaPlus className="mr-2" />
                            Add Course
                        </Link>
                        <Link href="/admin/dashboard/courses" className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <FaEye className="mr-2" />
                            View Courses
                        </Link>
                        <Link href="/admin/dashboard/enrollments" className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <FaUsers className="mr-2" />
                            Manage Enrollments
                        </Link>
                        <Link href="/admin/dashboard/assignments" className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <FaClipboardList className="mr-2" />
                            Review Assignments
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;