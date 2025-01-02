import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function LandingHeader() {
  const navigate = useNavigate();

  return (
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
  );
}