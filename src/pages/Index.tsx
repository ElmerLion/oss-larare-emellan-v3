import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, MessageCircle, Settings } from "lucide-react";
import { Footer } from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigate("/")} 
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-sage-300 rounded-full flex items-center justify-center">
                <img src="/Images/OLELogga.png" alt="OLE Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-sm text-gray-600">Oss Lärare Emellan</span>
            </button>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="border-sage-200 hover:bg-sage-50"
                onClick={() => navigate("/login")}
              >
                Logga in
              </Button>
              <Button 
                className="bg-sage-400 hover:bg-sage-500 text-white"
                onClick={() => navigate("/login")}
              >
                Registrera
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-sage-300/10 to-sage-400/10 -z-10" />
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Framtidens Community för Lärare
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8">
            Dela kunskap, bygg nätverk och utvecklas tillsammans
          </p>
          <Button
            size="lg"
            className="bg-sage-400 hover:bg-sage-500 text-white text-lg px-8"
            onClick={() => navigate("/login")}
          >
            Registrera dig nu
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Vad är Oss Lärare Emellan?
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
            OLE är en digital plattform som hjälper lärare att samarbeta, dela resurser och
            inspirera varandra för att stärka undervisningen i svenska skolor.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            Vad kan du göra på OLE?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Dela Resurser"
              description="Dela och upptäck lektionsplaner och resurser"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Bygg Nätverk"
              description="Bygg ett professionellt nätverk med lärare över hela Sverige"
            />
            <FeatureCard
              icon={<MessageCircle className="w-8 h-8" />}
              title="Delta i Diskussioner"
              description="Delta i diskussioner och håll dig uppdaterad om nya undervisningsmetoder"
            />
            <FeatureCard
              icon={<Settings className="w-8 h-8" />}
              title="Anpassa Innehåll"
              description="Anpassa innehållet till dina ämnen och intressen"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            Vad säger våra användare?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <TestimonialCard
              quote="Jag sparar flera timmar varje vecka tack vare OLE. Det har verkligen gjort mitt arbete lättare!"
              author="Anna Svensson"
              role="Gymnasielärare"
            />
            <TestimonialCard
              quote="Att bolla idéer med andra är väldigt utvecklade."
              author="Danjiel Lazarevic"
              role="Lärare"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sage-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Redo att börja?</h2>
          <Button
            size="lg"
            className="bg-sage-400 hover:bg-sage-500 text-white text-lg px-8"
            onClick={() => navigate("/login")}
          >
            Registrera dig nu
          </Button>
        </div>
      </section>

      <Footer />
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
