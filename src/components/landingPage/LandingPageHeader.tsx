import { Button } from "@/components/ui/button";
import { Link as ScrollLink } from "react-scroll";
import { useNavigate } from "react-router-dom";

export function LandingPageHeader() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <ScrollLink to="hero" smooth duration={500} className="cursor-pointer">
            <div className="flex items-center gap-2 group">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 bg-sage-300 rounded-full flex items-center justify-center transform transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg">
                  <img
                    src="/Images/OLELogga.png"
                    alt="OLE Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                  Oss Lärare Emellan
                </span>
              </button>
            </div>
          </ScrollLink>

          {/* Buttons for navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/funktioner")}
              className="px-3 py-1 border border-transparent hover:border-[color:var(--ole-green)] transition-colors duration-300 text-sm text-gray-600 hover:text-gray-900"
            >
              Hur Funkar Det
            </button>
            <button
              onClick={() => navigate("/omoss")}
              className="px-3 py-1 border border-transparent hover:border-[color:var(--ole-green)] transition-colors duration-300 text-sm text-gray-600 hover:text-gray-900"
            >
              Om Oss
            </button>
            {/* NEW Kontakt Button */}
            <button
              onClick={() => navigate("/kontakt")}
              className="px-3 py-1 border border-transparent hover:border-[color:var(--ole-green)] transition-colors duration-300 text-sm text-gray-600 hover:text-gray-900"
            >
              Kontakt
            </button>

            <Button
              variant="outline"
              className="border-[color:var(--hover-green)] hover:bg-sage-50 btn-animated btn-outline"
              onClick={() => navigate("/login")}
            >
              Logga in
            </Button>
            <Button
              className="bg-[color:var(--ole-green)] border-[color:var(--hover-green)] hover:bg-[color:var(--hover-green)] btn-animated btn-solid text-white"
              onClick={() => window.location.href = "/login?register=true"}
            >
              Registrera
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default LandingPageHeader;
