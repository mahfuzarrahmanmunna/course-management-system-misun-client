// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";

// Configure NextAuth
const handler = NextAuth({
    providers: [
        // Credentials Provider for email/password login
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    await dbConnect();
                    const usersCollection = await dbConnect('users');

                    // Find user by email
                    const user = await usersCollection.findOne({ email: credentials.email });

                    if (!user) {
                        throw new Error("Invalid email or password");
                    }

                    // Compare passwords
                    const isPasswordMatched = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordMatched) {
                        throw new Error("Invalid email or password");
                    }

                    // Return user object (without password)
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role || "student", // Default to student if role is not set
                        avatar: user.avatar
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    throw new Error(error.message || "Authentication failed");
                }
            }
        }),

        // Google OAuth Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),

        // GitHub OAuth Provider
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "read:user user:email"
                }
            }
        })
    ],

    // Session configuration
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    // JWT configuration
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    // Pages configuration
    pages: {
        signIn: "/login",
        signUp: "/register",
        error: "/auth/error",
        verifyRequest: "/auth/verify-request",
        newUser: "/auth/new-user"
    },

    // Callbacks
    callbacks: {
        // JWT callback - called whenever a JWT is created or updated
        async jwt({ token, user, account, profile }) {
            // Persist additional user info to token
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.avatar = user.avatar;
            }

            // Handle OAuth providers
            if (account && user) {
                // Check if user exists in database
                await dbConnect();
                const usersCollection = await dbConnect('users');
                let existingUser = await usersCollection.findOne({ email: user.email });

                if (!existingUser) {
                    // Create new user for OAuth
                    const newUser = {
                        name: user.name,
                        email: user.email,
                        avatar: user.image || user.avatar,
                        role: "student", // Default role for OAuth users
                        provider: account.provider,
                        providerId: account.providerAccountId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };

                    const result = await usersCollection.insertOne(newUser);

                    token.id = result.insertedId.toString();
                    token.role = newUser.role;
                    token.avatar = newUser.avatar;
                } else {
                    // Update existing user with OAuth info if needed
                    if (!existingUser.avatar && (user.image || user.avatar)) {
                        await usersCollection.updateOne(
                            { _id: existingUser._id },
                            {
                                $set: {
                                    avatar: user.image || user.avatar,
                                    updatedAt: new Date()
                                }
                            }
                        );
                    }

                    token.id = existingUser._id.toString();
                    token.role = existingUser.role || "student";
                    token.avatar = existingUser.avatar;
                }
            }

            return token;
        },

        // Session callback - called whenever a session is checked
        async session({ session, token }) {
            // Add custom properties to session
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.avatar = token.avatar;
            }

            return session;
        },

        // Sign-in callback - called after successful sign-in
        async signIn({ user, account, profile, credentials, email }) {
            // Allow sign-in for all providers
            return true;
        },

        // Redirect callback - called after sign-in/out
        async redirect({ url, baseUrl, token }) {
            // If it's a relative URL, construct the full URL
            if (url.startsWith("/")) return `${baseUrl}${url}`;

            // If it's an absolute URL on the same origin, allow it
            else if (new URL(url).origin === baseUrl) return url;

            // Default redirect based on user role
            if (token?.role === 'admin') {
                return `${baseUrl}/admin/dashboard`;
            }

            return `${baseUrl}/student/dashboard`;
        }
    },

    // Debug mode (set to false in production)
    debug: process.env.NODE_ENV === "development",

    // Secret for JWT signing
    secret: process.env.NEXTAUTH_SECRET,

    // Trust host for NextAuth.js
    trustHost: true
});

export { handler as GET, handler as POST };