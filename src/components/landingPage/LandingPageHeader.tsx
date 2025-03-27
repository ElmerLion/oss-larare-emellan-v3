import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link as ScrollLink } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export function LandingPageHeader() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleNavigate = (path: string) => {
        navigate(path);
        window.scrollTo(0, 0);
        setMenuOpen(false);
    };

    const handleBetaTestClick = () => {
        // If we're not on the home page, navigate there.
        if (window.location.pathname !== "/") {
            navigate("/");
            // Delay scrolling to allow the home page to render
            setTimeout(() => {
                const ctaElement = document.getElementById("cta");
                if (ctaElement) {
                    ctaElement.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        } else {
            const ctaElement = document.getElementById("cta");
            if (ctaElement) {
                ctaElement.scrollIntoView({ behavior: "smooth" });
            }
        }
        setMenuOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Title */}
                    <ScrollLink to="hero" smooth duration={500} className="cursor-pointer">
                        <div className="flex items-center gap-2 group">
                            <button onClick={() => handleNavigate("/")} className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-sage-300 rounded-full flex items-center justify-center transform transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg">
                                    <img
                                        src="/Images/OLELogga.png"
                                        alt="OLE Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300 whitespace-nowrap">
                                    Oss Lärare Emellan
                                </span>
                            </button>
                        </div>
                    </ScrollLink>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => handleNavigate("/funktioner")}
                            className="px-3 py-1 border border-transparent hover:border-[color:var(--ole-green)] transition-colors duration-300 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Hur Funkar Det
                        </button>
                        <button
                            onClick={() => handleNavigate("/omoss")}
                            className="px-3 py-1 border border-transparent hover:border-[color:var(--ole-green)] transition-colors duration-300 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Om Oss
                        </button>
                        <button
                            onClick={() => handleNavigate("/kontakt")}
                            className="px-3 py-1 border border-transparent hover:border-[color:var(--ole-green)] transition-colors duration-300 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Kontakta Oss
                        </button>
                        <button
                            onClick={handleBetaTestClick}
                            className="px-3 py-1 border border-transparent hover:border-[color:var(--ole-green)] transition-colors duration-300 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Bli Beta-testare
                        </button>
                        <Button
                            variant="outline"
                            className="border-[color:var(--hover-green)] hover:bg-sage-50 btn-animated btn-outline"
                            onClick={() => handleNavigate("/login")}
                        >
                            Logga in
                        </Button>
                        <Button
                            className="bg-[color:var(--ole-green)] border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)] btn-animated btn-solid text-white"
                            onClick={() => handleNavigate("/login?register=true")}
                        >
                            Registrera
                        </Button>
                    </div>

                    {/* Mobile Navigation Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white shadow-sm">
                    <div className="px-4 pt-4 pb-2 space-y-1">
                        <button
                            onClick={() => handleNavigate("/funktioner")}
                            className="block w-full text-left px-3 py-2 border border-transparent hover:border-[color:var(--ole-green)] transition-colors duration-300 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Hur Funkar Det
                        </button>
                        <button
                            onClick={() => handleNavigate("/omoss")}
                            className="block w-full text-left px-3 py-2 border border-transparent hover:border-[color:var(--ole-green)] transition-colors duration-300 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Om Oss
                        </button>
                        <button
                            onClick={() => handleNavigate("/kontakt")}
                            className="block w-full text-left px-3 py-2 border border-transparent hover:border-[color:var(--ole-green)] transition-colors duration-300 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Kontakta Oss
                        </button>
                        <button
                            onClick={handleBetaTestClick}
                            className="block w-full text-left px-3 py-2 border border-transparent hover:border-[color:var(--ole-green)] transition-colors duration-300 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Bli Beta-testare
                        </button>
                        <button
                            onClick={() => handleNavigate("/login")}
                            className="block w-full text-left px-3 py-2 border border-transparent hover:border-[color:var(--hover-green)] transition-colors duration-300 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Logga in
                        </button>
                        <button
                            onClick={() => handleNavigate("/login?register=true")}
                            className="block w-full text-left px-3 py-2 bg-[color:var(--ole-green)] text-white border border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)] transition-colors duration-300 text-sm"
                        >
                            Registrera
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

export default LandingPageHeader;
