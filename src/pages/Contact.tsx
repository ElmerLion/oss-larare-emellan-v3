import { LandingPageHeader } from "@/components/landingPage/LandingPageHeader";
import { Mail, Linkedin } from "lucide-react";

export default function Contact() {
  return (
    <div className="relative min-h-screen">
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 800"
        >
          <path
            d="M700 500 C770 430, 870 430, 870 550 C870 670, 770 720, 700 670 C630 620, 630 550, 700 500 Z"
            fill="#b97375"
            opacity="1"
            transform="translate(400 0)"
          />
          <path
            d="M670 180 C700 150, 800 150, 800 250 C800 350, 600 400, 650 350 C500 200, 600 250, 650 200 Z"
            fill="#1b7895"
            opacity="1"
            transform="translate(480 200)"
          />
          <path
            d="M600 500 C580 480, 550 520, 580 540 C610 560, 630 520, 610 500 C590 480, 600 500, 600 500 Z"
            fill="#b97375"
            opacity="1"
            transform="translate(420 -20)"
          />
          <path
            d="M120 80 C100 60, 80 120, 120 140 C160 160, 180 120, 160 100 C140 80, 140 80, 120 80 Z"
            fill="#1b7895"
            opacity="1"
            transform="translate(-500 150)"
          />
          <path
            d="M100 150 C50 100, 50 350, 150 400 C250 450, 300 350, 250 250 C200 200, 150 200, 100 150 Z"
            fill="#1b7895"
            opacity="1"
            transform="translate(-600 100)"
          />
          <path
            d="M50 600 C0 550, 0 650, 100 700 C200 750, 250 650, 200 600 C150 550, 100 550, 50 600 Z"
            fill="#b97375"
            opacity="1"
            transform="translate(-550 -100)"
          />
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <LandingPageHeader />

        {/* Main Content */}
        <main className="flex flex-1 items-center text-center">
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Kontakta Oss</h1>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
              Har du frågor, idéer eller vill du bara komma i kontakt med oss? Hör av dig via
              mejl eller sociala medier. Vi ser fram emot att höra från dig!
            </p>

            <div className="flex flex-col sm:flex-row gap-16 justify-center">
              {/* Email Block */}
              <a
                href="mailto:osslarareemellan@gmail.com"
                className="flex items-start gap-4 transition-transform duration-200 hover:scale-110 hover:text-[color:var(--ole-green)]"
              >
                <div className="p-3 bg-white rounded-full shadow-md">
                  <Mail className="text-[color:var(--ole-green)] h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">E-post</h2>
                  <p className="text-gray-700">osslarareemellan@gmail.com</p>
                </div>
              </a>

              {/* LinkedIn Block */}
              <a
                href="https://www.linkedin.com/company/oss-l%C3%A4rare-emellan/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 transition-transform duration-200 hover:scale-110 hover:text-[color:var(--ole-green)]"
              >
                <div className="p-3 bg-white rounded-full shadow-md">
                  <Linkedin className="text-[color:var(--ole-green)] h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">LinkedIn</h2>
                  <p className="text-gray-700">Oss Lärare Emellan</p>
                </div>
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
