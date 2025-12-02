"use client"
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiPlay, FiBookOpen, FiUsers, FiAward, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const Banner = () => {
    const bannerRef = useRef(null);
    const headlineRef = useRef(null);
    const subheadlineRef = useRef(null);
    const ctaButtonRef = useRef(null);
    const statsRef = useRef([]);
    const featuresRef = useRef([]);
    const imageRef = useRef(null);
    const particlesRef = useRef([]);

    useGSAP(() => {
        // Initial animation for banner elements
        gsap.fromTo(headlineRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: "power3.out" }
        );

        gsap.fromTo(subheadlineRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.4, ease: "power3.out" }
        );

        gsap.fromTo(ctaButtonRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: "power3.out" }
        );

        gsap.fromTo(imageRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.2, delay: 0.3, ease: "power3.out" }
        );

        // Stagger animation for stats
        gsap.fromTo(statsRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.8, ease: "power2.out" }
        );

        // Stagger animation for features
        gsap.fromTo(featuresRef.current,
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, delay: 1, ease: "power2.out" }
        );

        // Floating animation for particles
        particlesRef.current.forEach((particle, index) => {
            gsap.to(particle, {
                y: -20,
                duration: 2 + index * 0.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: index * 0.2
            });
        });

        // Parallax effect on scroll
        gsap.to(imageRef.current, {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
                trigger: bannerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // Clean up ScrollTrigger on component unmount
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    const stats = [
        { number: "10,000+", label: "Students" },
        { number: "500+", label: "Courses" },
        { number: "98%", label: "Satisfaction" },
        { number: "50+", label: "Instructors" }
    ];

    const features = [
        { icon: <FiBookOpen className="h-5 w-5" />, text: "Expert-led courses" },
        { icon: <FiUsers className="h-5 w-5" />, text: "Interactive learning" },
        { icon: <FiAward className="h-5 w-5" />, text: "Industry certifications" }
    ];

    return (
        <section ref={bannerRef} className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500 rounded-full filter blur-3xl"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        ref={el => particlesRef.current[i] = el}
                        className="absolute bg-white rounded-full opacity-60"
                        style={{
                            width: `${Math.random() * 10 + 5}px`,
                            height: `${Math.random() * 10 + 5}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    ></div>
                ))}
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-center lg:text-left z-10">
                        <h1 ref={headlineRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
                            Master New Skills with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">CourseMaster</span>
                        </h1>

                        <p ref={subheadlineRef} className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
                            Unlock your potential with our expert-led courses. Learn at your own pace, anywhere, anytime.
                        </p>

                        <div ref={ctaButtonRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 sm:mb-10">
                            <Link href="/courses" className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center">
                                Explore Courses
                                <FiArrowRight className="ml-2" />
                            </Link>

                            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 flex items-center justify-center border border-blue-200">
                                <FiPlay className="mr-2" />
                                Watch Demo
                            </button>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 mb-8 sm:mb-10">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    ref={el => featuresRef.current[index] = el}
                                    className="flex items-center text-gray-700"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                        {feature.icon}
                                    </div>
                                    <span className="text-sm sm:text-base">{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    ref={el => statsRef.current[index] = el}
                                    className="text-center"
                                >
                                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.number}</div>
                                    <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Image/Illustration */}
                    <div className="relative z-10 flex justify-center lg:justify-end">
                        <div ref={imageRef} className="relative w-full max-w-md sm:max-w-lg">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-blue-400 to-indigo-600 p-8 sm:p-12 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 flex items-center justify-center">
                                            <FiBookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Start Learning Today</h3>
                                        <p className="text-white text-opacity-90 text-sm sm:text-base">Join thousands of students already learning with CourseMaster</p>
                                    </div>
                                </div>

                                {/* Card elements for visual interest */}
                                <div className="p-4 sm:p-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <FiCheckCircle className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">Lifetime Access</p>
                                                <p className="text-xs text-gray-500">Once enrolled, forever access</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <FiAward className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">Certificate</p>
                                                <p className="text-xs text-gray-500">Earn certificates upon completion</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-lg opacity-70 transform rotate-12 hidden sm:block"></div>
                            {/* <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-70 transform -rotate-12 hidden sm:block"></div> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;