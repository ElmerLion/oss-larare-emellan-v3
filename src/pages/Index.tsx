import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link as ScrollLink, Element } from "react-scroll";
import { FeatureSection } from "@/components/landingPage/FeatureSection";
import { TestimonialsSection } from "@/components/landingPage/TestimonialsSection";
import { AboutSection } from "@/components/landingPage/AboutSection";
import { HeroSection } from "@/components/landingPage/HeroSection";
import { LandingPageHeader } from "@/components/landingPage/LandingPageHeader"


const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white flex flex-col relative cursor-default">

      {/* Header */}
      <LandingPageHeader></LandingPageHeader>

      {/* Hero Section */}
        <HeroSection></HeroSection>

      {/* About Section */}
        <AboutSection></AboutSection>

      {/* Features Section */}
        <FeatureSection></FeatureSection>

        {/* Testimonials Section */}
        <TestimonialsSection></TestimonialsSection>

      {/* CTA Section */}
    <Element name="cta" id="cta">
      <section className="py-20 bg-gradient-to-r from-sage-50 via-white to-sage-50 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 left-1/4 w-20 h-20 rounded-full bg-green-100 blur-xl opacity-50"></div>
          <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full bg-sage-200 blur-2xl opacity-40"></div>

          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Är du redo att börja?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Gå med i <strong><span className="text-[var(--ole-green)]">Oss Lärare Emellan</span></strong> och upplev kraften av <strong><span className="text-[var(--ole-green)]">samarbete</span></strong>.
          </p>
          <button
            className="bg-[color:var(--ole-green)] text-white text-lg font-medium px-8 py-4 rounded-lg hover:bg-[color:var(--hover-green)] hover:scale-105 shadow-md hover:shadow-lg transition-transform duration-300 ease-in-out"
            onClick={() => window.location.href = "/login?register=true"}
          >
            Registrera dig nu
          </button>
        </div>
      </section>
    </Element>
    </div>
  );
};


export default Index;
