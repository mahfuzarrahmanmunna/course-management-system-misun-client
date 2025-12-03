// src/app/api/courses/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { dbConnect } from "@/lib/dbConnect";
import { z } from "zod";

// Define a schema for course data validation using Zod
const courseSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long."),
    description: z.string().min(20, "Description must be at least 20 characters long."),
    instructor: z.string().min(2, "Instructor name is required."),
    price: z.number().min(0, "Price must be a positive number."),
    category: z.string().min(2, "Category is required."),
    tags: z.array(z.string()).optional(),
    thumbnailUrl: z.string().url("Invalid thumbnail URL provided.").optional().or(z.literal("")),
    syllabus: z.string().optional(),
});

// This function handles POST requests to /api/courses
export async function POST(request) {
    try {
        // 1. Authorization: Check if the user is an admin
        // We need to get the session using NextAuth's getServerSession
        // Note: You must export your NextAuth options from a shared file for this to work.
        // See the "NextAuth Configuration" section below.
        const session = await getServerSession(/* authOptions */);

        // if (!session || session.user.role !== 'admin') {
        //     return NextResponse.json(
        //         { message: "Unauthorized. Admin access required." },
        //         { status: 403 } // 403 Forbidden is the correct status for this
        //     );
        // }

        // 2. Get and validate the request body
        const body = await request.json();

        // The frontend sends tags as a comma-separated string, so we parse it into an array
        if (body.tags && typeof body.tags === 'string') {
            body.tags = body.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        }

        // Validate the incoming data against our schema
        const validation = courseSchema.safeParse(body);

        if (!validation.success) {
            // If validation fails, return a 400 Bad Request with the error details
            return NextResponse.json(
                { message: "Invalid data provided.", errors: validation.error.errors },
                { status: 400 }
            );
        }

        const courseData = validation.data; // Use the validated data

        // 3. Database Operation: Save the new course to MongoDB
        const coursesCollection = await dbConnect("courses");

        // Add the course to the database
        const result = await coursesCollection.insertOne({
            ...courseData,
            createdAt: new Date(), // Good practice to add a creation timestamp
            enrolledStudents: [], // Initialize with an empty array for enrollments
        });

        // 4. Success Response: Return a success message with the new course ID
        return NextResponse.json(
            { message: "Course created successfully!", courseId: result.insertedId },
            { status: 201 } // 201 Created is the standard for successful resource creation
        );

    } catch (error) {
        // Catch any unexpected errors (e.g., database connection issues)
        console.error("Error creating course:", error);
        return NextResponse.json(
            { message: "An internal server error occurred." },
            { status: 500 } // 500 Internal Server Error
        );
    }
}