// src/app/dashboard/add-course/page.js

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaSave, FaTimes, FaBook, FaDollarSign, FaTag, FaUser, FaClipboardList, FaImage } from 'react-icons/fa';

export default function AddCoursePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        instructor: '',
        price: 0,
        category: '',
        tags: '',
        thumbnailUrl: '',
        syllabus: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic'); // For multi-step form

    // Redirect non-admins trying to access this page directly
    React.useEffect(() => {
        if (status === 'loading') return; // Wait for session to load
        if (!session || session.user.role !== 'admin') {
            router.push('/dashboard'); // Or a "403 Not Authorized" page
        }
    }, [session, status, router]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Prepare tags for the backend
        const courseData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        };

        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle validation errors or other server errors
                throw new Error(data.message || 'Something went wrong');
            }

            setSuccess('Course created successfully!');
            // Reset form or redirect
            setFormData({
                title: '', description: '', instructor: '', price: 0, category: '', tags: '', thumbnailUrl: '', syllabus: ''
            });
            setTimeout(() => {
                router.push('/dashboard/courses'); // Redirect to course list after a short delay
            }, 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== 'admin') {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Add New Course</h1>
                    <p className="mt-2 text-gray-600">Create a new course for students to enroll in</p>
                </div>

                {/* Error and Success Messages */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Container */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {/* Form Header with Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('basic')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'basic'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Basic Information
                            </button>
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'details'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Course Details
                            </button>
                        </nav>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                            Course Title
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaBook className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                required
                                                className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm  placeholder:text-gray-600 text-gray-800 py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Introduction to Web Development"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-2">
                                            Instructor Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaUser className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="instructor"
                                                name="instructor"
                                                value={formData.instructor}
                                                onChange={handleChange}
                                                required
                                                className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm  placeholder:text-gray-600 text-gray-800 py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Course Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows="4"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        className="block w-full border  placeholder:text-gray-600 text-gray-800 border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Provide a comprehensive description of the course..."
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                            Price ($)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaDollarSign className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                                required
                                                className="pl-10 block w-full border  border-gray-300 rounded-md shadow-sm  placeholder:text-gray-600 text-gray-800 py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="49.99"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            className="block w-full border text-gray-800 border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select a category</option>
                                            <option value="Web Development">Web Development</option>
                                            <option value="Mobile Development">Mobile Development</option>
                                            <option value="Data Science">Data Science</option>
                                            <option value="Design">Design</option>
                                            <option value="Business">Business</option>
                                            <option value="Marketing">Marketing</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('details')}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Next: Course Details
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaTag className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="tags"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleChange}
                                            className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm  placeholder:text-gray-600 text-gray-800 py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="React, JavaScript, Web Development"
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Separate multiple tags with commas</p>
                                </div>

                                <div>
                                    <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                        Thumbnail URL
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaImage className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="url"
                                            id="thumbnailUrl"
                                            name="thumbnailUrl"
                                            value={formData.thumbnailUrl}
                                            onChange={handleChange}
                                            className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm  placeholder:text-gray-600 text-gray-800 py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="https://example.com/course-thumbnail.jpg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="syllabus" className="block text-sm font-medium text-gray-700 mb-2">
                                        Course Syllabus
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <FaClipboardList className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <textarea
                                            id="syllabus"
                                            name="syllabus"
                                            rows="8"
                                            value={formData.syllabus}
                                            onChange={handleChange}
                                            className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm  placeholder:text-gray-600 text-gray-800 py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Module 1: Introduction&#10;Module 2: Basic Concepts&#10;Module 3: Advanced Topics"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('basic')}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Back: Basic Information
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave className="mr-2" />
                                                Create Course
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}