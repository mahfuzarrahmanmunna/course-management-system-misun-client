// src/app/student/dashboard/page.jsx
"use client"
import DashboardLayout from "@/app/components/DashboardLayout/DashboardLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import DashboardLayout from "@/app/components/DashboardLayout";
import {
    FiBook,
    FiFileText,
    FiClock,
    FiTrendingUp,
    FiAward,
    FiCalendar,
    FiPlay,
    FiCheckCircle,
    FiBarChart2,
    FiUsers,
    FiStar,
    FiExternalLink
} from "react-icons/fi";

export default function StudentDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({
        coursesEnrolled: 0,
        assignmentsCompleted: 0,
        hoursLearned: 0,
        achievements: 0
    });
    const [recentCourses, setRecentCourses] = useState([]);
    const [upcomingAssignments, setUpcomingAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "loading") return; // Still loading
        if (!session) {
            router.push("/login");
        } else if (session.user.role === "admin") {
            // Redirect admin users to admin dashboard
            router.push("/admin/dashboard");
        } else {
            // Load student data
            loadStudentData();
        }
    }, [session, status, router]);

    const loadStudentData = async () => {
        // Simulate API call to fetch student data
        setTimeout(() => {
            setStats({
                coursesEnrolled: 5,
                assignmentsCompleted: 12,
                hoursLearned: 24,
                achievements: 8
            });

            setRecentCourses([
                {
                    id: 1,
                    title: "Introduction to React",
                    instructor: "John Doe",
                    progress: 75,
                    thumbnail: "https://picsum.photos/seed/react/400/200.jpg"
                },
                {
                    id: 2,
                    title: "Advanced JavaScript",
                    instructor: "Jane Smith",
                    progress: 60,
                    thumbnail: "https://picsum.photos/seed/javascript/400/200.jpg"
                },
                {
                    id: 3,
                    title: "UI/UX Design Fundamentals",
                    instructor: "Mike Johnson",
                    progress: 30,
                    thumbnail: "https://picsum.photos/seed/design/400/200.jpg"
                }
            ]);

            setUpcomingAssignments([
                {
                    id: 1,
                    title: "React Hooks Assignment",
                    course: "Introduction to React",
                    dueDate: "2023-12-15",
                    priority: "high"
                },
                {
                    id: 2,
                    title: "JavaScript Array Methods",
                    course: "Advanced JavaScript",
                    dueDate: "2023-12-18",
                    priority: "medium"
                },
                {
                    id: 3,
                    title: "Design Thinking Project",
                    course: "UI/UX Design Fundamentals",
                    dueDate: "2023-12-22",
                    priority: "low"
                }
            ]);

            setLoading(false);
        }, 1000);
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!session) {
        return null; // Will redirect in useEffect
    }

    return (
        <DashboardLayout userRole="student">
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user.name}!</h1>
                    <p className="text-blue-100">Continue your learning journey and achieve your goals</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                                <FiBook className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Courses Enrolled</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.coursesEnrolled}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-500">
                                <FiFileText className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Assignments Completed</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.assignmentsCompleted}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                                <FiClock className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Hours Learned</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.hoursLearned}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                                <FiAward className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Achievements</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.achievements}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Courses */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Courses</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentCourses.map((course) => (
                                    <div key={course.id} className="flex items-center space-x-4">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="h-16 w-16 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900">{course.title}</h3>
                                            <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
                                            <div className="mt-1">
                                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                                    <span>Progress</span>
                                                    <span>{course.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full"
                                                        style={{ width: `${course.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="p-2 text-blue-500 hover:text-blue-700">
                                            <FiPlay className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 text-center">
                                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center mx-auto">
                                    View All Courses
                                    <FiExternalLink className="ml-1 h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Assignments */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {upcomingAssignments.map((assignment) => (
                                    <div key={assignment.id} className="border-l-4 border-gray-200 pl-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">{assignment.title}</h3>
                                                <p className="text-sm text-gray-500">{assignment.course}</p>
                                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                                    <FiCalendar className="h-3 w-3 mr-1" />
                                                    Due: {assignment.dueDate}
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {assignment.priority}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 text-center">
                                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center mx-auto">
                                    View All Assignments
                                    <FiExternalLink className="ml-1 h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Learning Activity */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Learning Activity</h2>
                    </div>
                    <div className="p-6">
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <FiBarChart2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Your learning activity chart will appear here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}