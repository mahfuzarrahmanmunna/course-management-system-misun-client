// src/app/admin/users/page.jsx
"use client"
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import DashboardLayout from "@/app/components/DashboardLayout";
import {
    FiUsers,
    FiSearch,
    FiFilter,
    FiPlus,
    FiEdit,
    FiTrash2,
    FiEye,
    FiEyeOff,
    FiChevronDown,
    FiChevronUp,
    FiDownload,
    FiMail,
    FiCalendar,
    FiShield,
    FiCheck,
    FiX,
    FiUser,
    FiUserPlus,
    FiUserMinus,
    FiRefreshCw,
    FiMoreVertical,
    FiAlertCircle,
    FiInfo,
    FiCheckCircle,
    FiXCircle
} from 'react-icons/fi';
import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout';

export default function UserManagement() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // State management
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        status: 'active'
    });

    // Statistics
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        adminUsers: 0,
        studentUsers: 0,
        instructorUsers: 0
    });

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/login");
        } else if (session.user.role !== "admin") {
            router.push("/student/dashboard");
        } else {
            loadUsers();
        }
    }, [session, status, router]);

    const loadUsers = async () => {
        // Simulate API call
        setTimeout(() => {
            const mockUsers = [
                {
                    id: 1,
                    name: "John Doe",
                    email: "john@example.com",
                    role: "student",
                    status: "active",
                    joinDate: "2023-12-01",
                    lastLogin: "2023-12-10",
                    avatar: "https://picsum.photos/seed/john/100/100.jpg",
                    courses: 5,
                    completedCourses: 2
                },
                {
                    id: 2,
                    name: "Jane Smith",
                    email: "jane@example.com",
                    role: "instructor",
                    status: "active",
                    joinDate: "2023-11-28",
                    lastLogin: "2023-12-09",
                    avatar: "https://picsum.photos/seed/jane/100/100.jpg",
                    courses: 3,
                    completedCourses: 0
                },
                {
                    id: 3,
                    name: "Mike Johnson",
                    email: "mike@example.com",
                    role: "student",
                    status: "inactive",
                    joinDate: "2023-11-25",
                    lastLogin: "2023-11-30",
                    avatar: "https://picsum.photos/seed/mike/100/100.jpg",
                    courses: 2,
                    completedCourses: 1
                },
                {
                    id: 4,
                    name: "Sarah Wilson",
                    email: "sarah@example.com",
                    role: "admin",
                    status: "active",
                    joinDate: "2023-11-20",
                    lastLogin: "2023-12-10",
                    avatar: "https://picsum.photos/seed/sarah/100/100.jpg",
                    courses: 0,
                    completedCourses: 0
                },
                {
                    id: 5,
                    name: "Tom Brown",
                    email: "tom@example.com",
                    role: "student",
                    status: "active",
                    joinDate: "2023-11-15",
                    lastLogin: "2023-12-08",
                    avatar: "https://picsum.photos/seed/tom/100/100.jpg",
                    courses: 4,
                    completedCourses: 3
                },
                {
                    id: 6,
                    name: "Emily Davis",
                    email: "emily@example.com",
                    role: "instructor",
                    status: "active",
                    joinDate: "2023-11-10",
                    lastLogin: "2023-12-09",
                    avatar: "https://picsum.photos/seed/emily/100/100.jpg",
                    courses: 2,
                    completedCourses: 0
                },
                {
                    id: 7,
                    name: "Chris Lee",
                    email: "chris@example.com",
                    role: "student",
                    status: "active",
                    joinDate: "2023-11-05",
                    lastLogin: "2023-12-07",
                    avatar: "https://picsum.photos/seed/chris/100/100.jpg",
                    courses: 6,
                    completedCourses: 4
                },
                {
                    id: 8,
                    name: "Lisa Anderson",
                    email: "lisa@example.com",
                    role: "student",
                    status: "inactive",
                    joinDate: "2023-10-30",
                    lastLogin: "2023-11-20",
                    avatar: "https://picsum.photos/seed/lisa/100/100.jpg",
                    courses: 3,
                    completedCourses: 2
                }
            ];

            setUsers(mockUsers);
            setFilteredUsers(mockUsers);

            // Calculate statistics
            const totalUsers = mockUsers.length;
            const activeUsers = mockUsers.filter(u => u.status === 'active').length;
            const inactiveUsers = mockUsers.filter(u => u.status === 'inactive').length;
            const adminUsers = mockUsers.filter(u => u.role === 'admin').length;
            const studentUsers = mockUsers.filter(u => u.role === 'student').length;
            const instructorUsers = mockUsers.filter(u => u.role === 'instructor').length;

            setStats({
                totalUsers,
                activeUsers,
                inactiveUsers,
                adminUsers,
                studentUsers,
                instructorUsers
            });

            setLoading(false);
        }, 1000);
    };

    // Filter and search users
    useEffect(() => {
        let filtered = users;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Role filter
        if (filterRole !== 'all') {
            filtered = filtered.filter(user => user.role === filterRole);
        }

        // Status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(user => user.status === filterStatus);
        }

        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [users, searchTerm, filterRole, filterStatus]);

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === currentUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(currentUsers.map(user => user.id));
        }
    };

    const handleAddUser = () => {
        // Reset form
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'student',
            status: 'active'
        });
        setShowAddModal(true);
    };

    const handleEditUser = (user) => {
        setCurrentUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            confirmPassword: '',
            role: user.role,
            status: user.status
        });
        setShowEditModal(true);
    };

    const handleDeleteUser = (user) => {
        setCurrentUser(user);
        setShowDeleteModal(true);
    };

    const handleToggleUserStatus = (userId) => {
        setUsers(prev =>
            prev.map(user =>
                user.id === userId
                    ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
                    : user
            )
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (showAddModal) {
            // Add new user
            const newUser = {
                id: users.length + 1,
                ...formData,
                joinDate: new Date().toISOString().split('T')[0],
                lastLogin: null,
                avatar: `https://picsum.photos/seed/${formData.name}/100/100.jpg`,
                courses: 0,
                completedCourses: 0
            };
            setUsers(prev => [...prev, newUser]);
            setShowAddModal(false);
        } else if (showEditModal) {
            // Update existing user
            setUsers(prev =>
                prev.map(user =>
                    user.id === currentUser.id
                        ? { ...user, ...formData }
                        : user
                )
            );
            setShowEditModal(false);
        }
    };

    const handleDelete = () => {
        setUsers(prev => prev.filter(user => user.id !== currentUser.id));
        setShowDeleteModal(false);
    };

    const handleBulkAction = (action) => {
        if (action === 'delete') {
            setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
            setSelectedUsers([]);
        } else if (action === 'activate') {
            setUsers(prev =>
                prev.map(user =>
                    selectedUsers.includes(user.id)
                        ? { ...user, status: 'active' }
                        : user
                )
            );
            setSelectedUsers([]);
        } else if (action === 'deactivate') {
            setUsers(prev =>
                prev.map(user =>
                    selectedUsers.includes(user.id)
                        ? { ...user, status: 'inactive' }
                        : user
                )
            );
            setSelectedUsers([]);
        }
    };

    const exportUsers = () => {
        // Simulate export functionality
        alert('Exporting users to CSV...');
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <DashboardLayout userRole="admin">
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                            <p className="text-gray-600 mt-1">Manage users, roles, and permissions</p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex space-x-3">
                            <button
                                onClick={exportUsers}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <FiDownload className="mr-2 h-4 w-4" />
                                Export
                            </button>
                            <button
                                onClick={handleAddUser}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                            >
                                <FiPlus className="mr-2 h-4 w-4" />
                                Add User
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <FiUsers className="h-5 w-5" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Total Users</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <FiCheckCircle className="h-5 w-5" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Active</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.activeUsers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-red-100 text-red-600">
                                <FiXCircle className="h-5 w-5" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Inactive</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.inactiveUsers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <FiShield className="h-5 w-5" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Admins</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.adminUsers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <FiUser className="h-5 w-5" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Students</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.studentUsers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                                <FiUserPlus className="h-5 w-5" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Instructors</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.instructorUsers}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1 max-w-lg">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search users by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <FiFilter className="mr-2 h-4 w-4" />
                                Filters
                                {showFilters ? <FiChevronUp className="ml-2 h-4 w-4" /> : <FiChevronDown className="ml-2 h-4 w-4" />}
                            </button>

                            {selectedUsers.length > 0 && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">
                                        {selectedUsers.length} selected
                                    </span>
                                    <div className="relative">
                                        <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                            <FiMoreVertical className="h-4 w-4" />
                                        </button>
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                            <div className="py-1">
                                                <button
                                                    onClick={() => handleBulkAction('activate')}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Activate Selected
                                                </button>
                                                <button
                                                    onClick={() => handleBulkAction('deactivate')}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Deactivate Selected
                                                </button>
                                                <button
                                                    onClick={() => handleBulkAction('delete')}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                >
                                                    Delete Selected
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {showFilters && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="instructor">Instructor</option>
                                    <option value="student">Student</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.length === currentUsers.length}
                                            onChange={handleSelectAll}
                                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                        />
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Join Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Login
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Courses
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => handleSelectUser(user.id)}
                                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={user.avatar}
                                                        alt={user.name}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'instructor' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.joinDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.lastLogin || 'Never'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.courses} ({user.completedCourses} completed)
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="text-purple-600 hover:text-purple-900 mr-3"
                                            >
                                                <FiEdit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleUserStatus(user.id)}
                                                className={`${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                                                    } mr-3`}
                                            >
                                                {user.status === 'active' ? <FiUserMinus className="h-4 w-4" /> : <FiUserPlus className="h-4 w-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FiTrash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                                    <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
                                    <span className="font-medium">{filteredUsers.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <FiChevronDown className="h-5 w-5 transform rotate-90" />
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1
                                                ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Next</span>
                                        <FiChevronDown className="h-5 w-5 transform -rotate-90" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="mb-4">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Add New User</h3>
                                        <p className="mt-1 text-sm text-gray-500">Create a new user account</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Password</label>
                                            <div className="mt-1 relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    value={formData.password}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                                                >
                                                    {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                            <div className="mt-1 relative">
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    required
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                                                >
                                                    {showConfirmPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Role</label>
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                            >
                                                <option value="student">Student</option>
                                                <option value="instructor">Instructor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Add User
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="mb-4">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Edit User</h3>
                                        <p className="mt-1 text-sm text-gray-500">Update user information</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">New Password (leave blank to keep current)</label>
                                            <div className="mt-1 relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                                                >
                                                    {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Role</label>
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                            >
                                                <option value="student">Student</option>
                                                <option value="instructor">Instructor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Update User
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete User Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <FiAlertCircle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Delete User</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete {currentUser?.name}? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={handleDelete}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}