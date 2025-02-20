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
import { PersonaSection } from "@/components/landingPage/PersonaSection";
import { CTASection } from "@/components/landingPage/CTASection";



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

        <PersonaSection />

      {/* Features Section */}
        <FeatureSection></FeatureSection>

        {/* Testimonials Section */}


      {/* CTA Section */}
    <CTASection />
    </div>
  );
};


export default Index;
