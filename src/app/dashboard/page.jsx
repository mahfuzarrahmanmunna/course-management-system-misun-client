// src/app/dashboard/page.jsx
"use client"
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Still loading
        if (!session) {
            router.push("/login");
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold">Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span>Welcome, {session.user.name}</span>
                            <span className="text-sm text-gray-500">Role: {session.user.role}</span>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
                            <p className="text-gray-600 mb-4">
                                You are logged in as {session.user.email} with role: {session.user.role}
                            </p>
                            {session.user.role === 'student' && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">Student Dashboard</h3>
                                    <p>View your courses, assignments, and progress here.</p>
                                </div>
                            )}
                            {session.user.role === 'instructor' && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">Instructor Dashboard</h3>
                                    <p>Manage your courses, create content, and track student progress here.</p>
                                </div>
                            )}
                            {session.user.role === 'admin' && (
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">Admin Dashboard</h3>
                                    <p>Manage users, courses, and system settings here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}