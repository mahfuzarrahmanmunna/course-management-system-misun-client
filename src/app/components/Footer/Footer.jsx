"use client"
import { useState, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
    FiFacebook, FiTwitter, FiLinkedin, FiInstagram, FiYoutube, FiMail,
    FiPhone, FiMapPin, FiSend, FiChevronRight, FiBookOpen, FiAward,
    FiUsers, FiClock, FiShield, FiHeadphones, FiGlobe, FiArrowUp
} from 'react-icons/fi';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [showScrollTop, setShowScrollTop] = useState(false);
    const footerRef = useRef(null);
    const sectionRefs = useRef([]);
    const socialRefs = useRef([]);
    const scrollButtonRef = useRef(null);

    // GSAP animations
    useGSAP(() => {
        // Animate footer sections on scroll
        gsap.fromTo(sectionRefs.current,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 90%",
                    once: true
                }
            }
        );

        // Animate social icons
        gsap.fromTo(socialRefs.current,
            { scale: 0, rotation: -180 },
            {
                scale: 1,
                rotation: 0,
                duration: 0.5,
                stagger: 0.1,
                delay: 0.5,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 90%",
                    once: true
                }
            }
        );
    }, []);

    // Handle scroll to show/hide scroll-to-top button
    useState(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Handle newsletter submission
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            // Add your newsletter submission logic here
            console.log('Newsletter subscription:', email);
            setEmail('');
            // Show success message
        }
    };

    // Footer sections data
    const quickLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
        { name: 'Press', href: '/press' },
        { name: 'Contact', href: '/contact' }
    ];

    const courseCategories = [
        { name: 'Web Development', href: '/courses/web-development' },
        { name: 'Data Science', href: '/courses/data-science' },
        { name: 'UI/UX Design', href: '/courses/ui-ux-design' },
        { name: 'Mobile Development', href: '/courses/mobile-development' },
        { name: 'Business', href: '/courses/business' },
        { name: 'Marketing', href: '/courses/marketing' }
    ];

    const supportLinks = [
        { name: 'Help Center', href: '/help' },
        { name: 'Documentation', href: '/docs' },
        { name: 'Community Forum', href: '/forum' },
        { name: 'System Status', href: '/status' },
        { name: 'Refund Policy', href: '/refund' },
        { name: 'Accessibility', href: '/accessibility' }
    ];

    const legalLinks = [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'GDPR Compliance', href: '/gdpr' }
    ];

    const socialLinks = [
        { icon: <FiFacebook className="h-5 w-5" />, href: '#', label: 'Facebook' },
        { icon: <FiTwitter className="h-5 w-5" />, href: '#', label: 'Twitter' },
        { icon: <FiLinkedin className="h-5 w-5" />, href: '#', label: 'LinkedIn' },
        { icon: <FiInstagram className="h-5 w-5" />, href: '#', label: 'Instagram' },
        { icon: <FiYoutube className="h-5 w-5" />, href: '#', label: 'YouTube' }
    ];

    const features = [
        { icon: <FiBookOpen className="h-6 w-6" />, title: '10,000+ Courses', description: 'Expert-led courses across various domains' },
        { icon: <FiUsers className="h-6 w-6" />, title: '500+ Instructors', description: 'Learn from industry experts' },
        { icon: <FiAward className="h-6 w-6" />, title: 'Certifications', description: 'Earn recognized certificates' },
        { icon: <FiClock className="h-6 w-6" />, title: 'Lifetime Access', description: 'Learn at your own pace' }
    ];

    return (
        <>
            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    ref={scrollButtonRef}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-40 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                >
                    <FiArrowUp className="h-5 w-5" />
                </button>
            )}

            {/* Main Footer */}
            <footer
                ref={footerRef}
                className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500 rounded-full filter blur-3xl"></div>
                </div>

                {/* Features Section */}
                <div className="relative z-10 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    ref={el => sectionRefs.current[index] = el}
                                    className="text-center"
                                >
                                    <div className="flex justify-center mb-4">
                                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-300">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        {/* Company Info */}
                        <div
                            ref={el => sectionRefs.current[4] = el}
                            className="lg:col-span-2"
                        >
                            <div className="flex items-center mb-4">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-2 mr-3">
                                    <FiBookOpen className="h-6 w-6" />
                                </div>
                                <span className="text-xl font-bold">CourseMaster</span>
                            </div>
                            <p className="text-gray-300 mb-6 max-w-md">
                                Empowering learners worldwide with quality education and expert-led courses. Join our community of lifelong learners today.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-300">
                                    <FiMapPin className="h-5 w-5 mr-3 text-blue-400" />
                                    <span>123 Education Street, Learning City, LC 12345</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <FiPhone className="h-5 w-5 mr-3 text-blue-400" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <FiMail className="h-5 w-5 mr-3 text-blue-400" />
                                    <span>support@coursemaster.com</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div ref={el => sectionRefs.current[5] = el}>
                            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                            <ul className="space-y-3">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                                        >
                                            <FiChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Course Categories */}
                        <div ref={el => sectionRefs.current[6] = el}>
                            <h3 className="text-lg font-semibold mb-6">Course Categories</h3>
                            <ul className="space-y-3">
                                {courseCategories.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                                        >
                                            <FiChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support & Legal */}
                        <div ref={el => sectionRefs.current[7] = el}>
                            <h3 className="text-lg font-semibold mb-6">Support</h3>
                            <ul className="space-y-3 mb-6">
                                {supportLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                                        >
                                            <FiChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className='flex items-center justify-between'>
                        <div
                            ref={el => sectionRefs.current[8] = el}
                            className="mt-16 p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                        >
                            <div className="max-w-3xl mx-auto text-center">
                                <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
                                <p className="text-gray-300 mb-6">
                                    Subscribe to our newsletter for the latest courses, updates, and exclusive offers.
                                </p>
                                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                                    >
                                        <FiSend className="h-5 w-5 mr-2" />
                                        Subscribe
                                    </button>
                                </form>
                            </div>

                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Legal</h3>
                            <ul className="space-y-3">
                                {legalLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                                        >
                                            <FiChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="relative z-10 border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            {/* Copyright */}
                            <div className="mb-4 md:mb-0">
                                <p className="text-gray-400 text-sm">
                                    © {new Date().getFullYear()} CourseMaster. All rights reserved.
                                </p>
                            </div>

                            {/* Social Links */}
                            <div className="flex space-x-4 mb-4 md:mb-0">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        ref={el => socialRefs.current[index] = el}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>

                            {/* Additional Links */}
                            <div className="flex items-center space-x-6">
                                <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center">
                                    <FiGlobe className="h-4 w-4 mr-1" />
                                    Sitemap
                                </Link>
                                <Link href="/accessibility" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center">
                                    <FiShield className="h-4 w-4 mr-1" />
                                    Accessibility
                                </Link>
                                <Link href="/support" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center">
                                    <FiHeadphones className="h-4 w-4 mr-1" />
                                    24/7 Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;