import { Mail, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission Statement */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/Images/OLELogga.png" alt="OLE Logo" className="h-8 w-auto" />
              <span className="text-gray-600 font-semibold">Oss Lärare Emellan</span>
            </div>
            <p className="text-sm text-gray-500">
              Vi förenar lärare för att förbättra utbildningen i Sverige genom samarbete och inspiration.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-800 font-medium mb-4">Snabblänkar</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                <a href="#about" className="hover:text-green-600">Om Oss</a>
              </li>
              <li>
                <a href="#features" className="hover:text-green-600">Funktioner</a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-green-600">Omdömen</a>
              </li>
              <li>
                <a href="#cta" className="hover:text-green-600">Kontakta Oss</a>
              </li>
              <li>
                <a href="/privacy-policy" className="hover:text-green-600">Integritetspolicy</a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-gray-800 font-medium mb-4">Kontakt</h3>
            <a
              href="mailto:osslarareemellan@gmail.com"
              className="flex items-center gap-2 text-gray-600 hover:text-green-600 text-sm"
            >
              <Mail className="h-5 w-5" />
              <span>osslarareemellan@gmail.com</span>
            </a>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-gray-800 font-medium mb-4">Följ Oss</h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/oss-l%C3%A4rare-emellan/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Oss Lärare Emellan. Alla rättigheter reserverade.</p>
        </div>
      </div>
    </footer>
  );
}
