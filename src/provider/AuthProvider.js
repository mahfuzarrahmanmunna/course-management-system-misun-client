// src/app/components/Providers/Providers.jsx
"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProviders({ children }) {
    return <SessionProvider>{children}</SessionProvider>;
}