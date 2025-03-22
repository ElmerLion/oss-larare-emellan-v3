import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link as ScrollLink, Element } from "react-scroll";
import { FeatureSection } from "@/components/landingPage/FeatureSection";
import { TestimonialsSection } from "@/components/landingPage/TestimonialsSection";
import { AboutSection } from "@/components/landingPage/AboutSection";
import { HeroSection } from "@/components/landingPage/HeroSection";
import { LandingPageHeader } from "@/components/landingPage/LandingPageHeader";
import { PersonaSection } from "@/components/landingPage/PersonaSection";
import { CTASection } from "@/components/landingPage/CTASection";

const Index = () => {
    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>Oss L�rare Emellan | Gemenskap f�r Sveriges l�rare</title>
                <meta
                    name="description"
                    content="V�lkommen till Oss L�rare Emellan � din portal f�r att uppt�cka resurser, n�tverka med kollegor och f� inspiration f�r en b�ttre undervisning. Utforska v�rt community idag."
                />
                <meta
                    name="keywords"
                    content="l�rare, utbildning, undervisning, community, Sverige, resurser, n�tverk"
                />
                <link rel="canonical" href="https://www.osslarareemellan.se" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white flex flex-col relative cursor-default">
                {/* Header */}
                <LandingPageHeader />

                {/* Hero Section */}
                <HeroSection />

                {/* About Section */}
                <AboutSection />

                {/* Features Section */}
                <FeatureSection />

                <PersonaSection />

                {/* Testimonials Section */}
                <TestimonialsSection />

                {/* CTA Section */}
                <CTASection />
            </div>
        </>
    );
};

export default Index;
