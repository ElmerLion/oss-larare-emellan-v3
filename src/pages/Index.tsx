import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, MessageCircle, Settings } from "lucide-react";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link as ScrollLink, Element } from "react-scroll";
import Lottie from "lottie-react";
import EducationAnimation from "@/animations/FloatingGuy.json"; // Add your Lottie animation JSON file.


const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white flex flex-col relative">
      {/* SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full -z-9"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800"
      >
        <g fill="none" fillRule="evenodd">
          {/* Center Blob */}
          <circle
            cx="400"
            cy="125"
            r="160"
            fill="url(#blobGradient)"
            opacity="0.4"
          />

          {/* Right Blob */}
          <circle
            cx="600"
            cy="150"
            r="130"
            fill="url(#blobGradient)"
            opacity="0.4"
          />

          {/* Top-Left Blob */}
          <circle
            cx="200"
            cy="75"
            r="120"
            fill="url(#blobGradient)"
            opacity="0.3"
          />
        </g>
        <defs>
          <radialGradient id="blobGradient" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#B0E57C" />
            <stop offset="100%" stopColor="#C9F4E8" />
          </radialGradient>
        </defs>
      </svg>





      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <ScrollLink to="hero" smooth duration={500} className="cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-sage-300 rounded-full flex items-center justify-center">
                  <img src="/Images/OLELogga.png" alt="OLE Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-sm text-gray-600">Oss Lärare Emellan</span>
              </div>
            </ScrollLink>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="border-[color:var(--hover-green)] hover:bg-sage-50"
                onClick={() => navigate("/login")}
              >
                Logga in
              </Button>
              <Button
                className="bg-[color:var(--ole-green)] border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)] text-white"
                onClick={() => navigate("/login?register=true")}
              >
                Registrera
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Element name="hero">
        <section className="relative pt-24 h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10">

          {/* Blobs */}
          {/* Top-Left Blob */}
          <div className="absolute top-10 left-10 -z-9">
            <svg width="180" height="180" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#C9F4E8" d="M44.6,-63.6C55.6,-58.2,59.8,-39.6,62.4,-23.3C65,-7,66.1,7.1,61.4,19.8C56.7,32.6,46.1,44,33.5,49.6C20.8,55.2,5.9,55.1,-7.4,54C-20.8,53,-33.4,51,-43.6,43.8C-53.8,36.6,-61.6,24.1,-65.6,10.5C-69.6,-3.2,-69.8,-18,-61.5,-25.6C-53.2,-33.1,-36.4,-33.3,-24.3,-38.3C-12.2,-43.4,-6.1,-53.1,5.3,-61.3C16.6,-69.4,33.2,-76,44.6,-63.6Z" transform="translate(100 100)" />
            </svg>
          </div>

          {/* Bottom-Right Blob */}
          <div className="absolute bottom-20 right-10 -z-9">
            <svg width="150" height="150" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#C9F4E8" d="M31.3,-52.9C41.3,-44.8,47.8,-33.6,49.6,-22.2C51.4,-10.8,48.4,1,45.1,13.4C41.9,25.8,38.3,38.9,29.4,44.8C20.5,50.7,6.2,49.5,-6.8,47.6C-19.7,45.8,-31.3,43.4,-42.6,36.3C-53.9,29.2,-64.9,17.5,-65.7,5.4C-66.6,-6.7,-57.2,-19.2,-49.6,-30.4C-41.9,-41.6,-36,-51.5,-27.1,-58.2C-18.2,-65,-6.1,-68.5,5.6,-74.1C17.4,-79.7,34.8,-87.7,44.3,-77.5C53.7,-67.3,55.1,-39.9,31.3,-52.9Z" transform="translate(100 100)" />
            </svg>
          </div>

          {/* Center-Left Blob */}
          <div className="absolute top-1/2 left-10 -z-9 transform -translate-y-1/2">
            <svg width="120" height="120" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#C9F4E8" d="M43.3,-64.6C56.8,-60.8,67.6,-47,68.9,-33.4C70.2,-19.8,61.9,-6.3,58.5,8.5C55,23.2,56.3,39.1,47.4,45.4C38.5,51.8,19.3,48.5,1.1,47.1C-17.1,45.7,-34.3,46.1,-42.4,37.8C-50.5,29.5,-49.5,12.4,-50.2,-5.8C-50.8,-24,-53,-43.4,-44.3,-47.7C-35.6,-52.1,-17.8,-41.5,-1.2,-40.1C15.4,-38.7,30.8,-46.5,43.3,-64.6Z" transform="translate(100 100)" />
            </svg>
          </div>

          {/* Top-Right Blob */}
          <div className="absolute top-5 right-32 -z-9">
            <svg width="100" height="100" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#C9F4E8" d="M32.1,-41.7C40.7,-33.8,44.6,-22.8,50.5,-10.4C56.4,2,64.3,15.7,61.6,26.8C58.8,37.8,45.5,46.2,32.3,53.3C19.1,60.3,9.6,65.8,-3.1,69C-15.8,72.1,-31.6,73,-37.3,63.4C-43.1,53.8,-38.9,33.7,-40.1,19.7C-41.2,5.7,-47.8,-2.3,-45.8,-9.7C-43.9,-17.2,-33.4,-24,-24,-31.5C-14.6,-39,-7.3,-47.3,2.4,-50.7C12,-54.2,24.1,-52.4,32.1,-41.7Z" transform="translate(100 100)" />
            </svg>
          </div>

          {/* Bottom-Left Blob */}
          <div className="absolute bottom-5 left-5 -z-9">
            <svg width="90" height="90" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#C9F4E8" d="M26.5,-35.6C34.8,-30.2,38.5,-20.2,41.3,-10.1C44.1,0,46,10.2,42.1,18.8C38.2,27.5,28.6,34.6,19.1,36.7C9.6,38.9,0.2,36.1,-10.8,36.5C-21.7,36.8,-43.3,40.3,-46.1,34.7C-48.9,29,-32.8,14.2,-26.6,4.3C-20.4,-5.6,-24,-11.5,-23.5,-17.8C-23,-24.1,-18.3,-30.8,-11.6,-36.3C-4.9,-41.8,3.9,-46.1,12.4,-47C20.9,-47.8,29,-44.2,26.5,-35.6Z" transform="translate(100 100)" />
            </svg>
          </div>

          {/* Text Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Framtidens Community för Lärare
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xl sm:text-2xl text-gray-600 mb-8"
            >
              Dela kunskap, bygg nätverk och utvecklas tillsammans
            </motion.p>
            <ScrollLink to="about" smooth duration={500} className="cursor-pointer">
              <Button
                size="lg"
                className="bg-[color:var(--ole-green)] border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)] text-white text-lg px-8"
              >
                Läs mer
              </Button>
            </ScrollLink>
          </div>
        </section>
      </Element>

      {/* About Section */}
      <Element name="about">
        <section className="py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Så Här Hjälper OLE Lärare Att Lyckas.</h2>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
              OLE är en digital plattform som hjälper lärare att samarbeta, dela resurser och inspirera varandra för att
              stärka undervisningen i svenska skolor.
            </p>
          </div>
        </section>
      </Element>

      {/* Features Section */}
      <Element name="features">
        <section className="py-20 bg-sage-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16">Vad kan du göra på OLE?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard icon={<BookOpen className="w-8 h-8" />} title="Dela Resurser" description="Dela och upptäck lektionsplaner och resurser" />
              <FeatureCard icon={<Users className="w-8 h-8" />} title="Bygg Nätverk" description="Bygg ett professionellt nätverk med lärare över hela Sverige" />
              <FeatureCard icon={<MessageCircle className="w-8 h-8" />} title="Delta i Diskussioner" description="Delta i diskussioner och håll dig uppdaterad om nya undervisningsmetoder" />
              <FeatureCard icon={<Settings className="w-8 h-8" />} title="Anpassa Innehåll" description="Anpassa innehållet till dina ämnen och intressen" />
            </div>
          </div>
        </section>
      </Element>

      {/* CTA Section */}
      <Element name="cta">
        <section className="py-20 bg-sage-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-8">Redo att börja?</h2>
            <Button
              size="lg"
              className="bg-[color:var(--ole-green)] border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)] text-white text-lg px-8"
              onClick={() => navigate("/login?register=true")}
            >
              Registrera dig nu
            </Button>
          </div>
        </section>
      </Element>
    </div>
  );
};
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-sage-100 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-100 text-sage-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const TestimonialCard = ({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) => {
  return (
    <div className="bg-sage-50 p-6 rounded-lg">
      <p className="text-gray-600 italic mb-4">{quote}</p>
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  );
};

export default Index;
