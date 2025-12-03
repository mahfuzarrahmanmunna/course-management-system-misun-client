// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/dbConnect';

export async function POST(request) {
    try {
        // Parse the request body
        const { name, email, password } = await request.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Connect to the database
        const usersCollection = await dbConnect('users');

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with role set to "student"
        const newUser = {
            name,
            email,
            password: hashedPassword,
            role: 'student', // Default role
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Insert the new user into the database
        const result = await usersCollection.insertOne(newUser);

        // Return success response with user data for auto-login
        const { password: _, ...userWithoutPassword } = newUser;
        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    _id: result.insertedId,
                    ...userWithoutPassword
                },
                // Include redirect URL based on role
                redirectUrl: newUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}