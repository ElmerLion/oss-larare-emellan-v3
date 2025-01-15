import { Mail, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/Images/OLELogga.png" alt="OLE Logo" className="h-8 w-auto" />
            <span className="text-gray-600">Oss Lärare Emellan</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="mailto:osslarareemellan@gmail.com" 
              className="flex items-center gap-2 text-gray-600 hover:text-sage-500"
            >
              <Mail className="h-5 w-5" />
              <span>osslarareemellan@gmail.com</span>
            </a>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-sage-500"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/oss-l%C3%A4rare-emellan/"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-sage-500"
              >
                <Linkedin className="h-5 w-5"/>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}