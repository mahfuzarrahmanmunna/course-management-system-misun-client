// src/app/components/LayoutBody.jsx
"use client";
import BottomNavbar from "@/app/components/BottomNavbar/BottomNavbar";
import Footer from "@/app/components/Footer/Footer";
import Navbar from "@/app/components/Navbar/Navbar";
import { usePathname } from "next/navigation";
// import Navbar from "./Navbar/Navbar";
// import BottomNavbar from "./BottomNavbar/BottomNavbar";
// import Footer from "./Footer/Footer";

export default function LayoutBody({ children }) {
    const pathname = usePathname();

    // Check if current path is a dashboard path
    const isDashboardPath = pathname.startsWith('/admin/') || pathname.startsWith('/student/');

    return (
        <>
            {/* Only render Navbar if not on a dashboard path */}
            {!isDashboardPath && <Navbar />}

            <div className="">
                {children}
            </div>

            {/* Only render Footer and BottomNavbar if not on a dashboard path */}
            {!isDashboardPath && <Footer />}
            {!isDashboardPath && <BottomNavbar />}
        </>
    );
}