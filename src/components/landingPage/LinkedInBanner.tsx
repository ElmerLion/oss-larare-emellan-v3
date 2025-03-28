import React from "react";
import { Linkedin } from "lucide-react";

export function LinkedInBanner(): JSX.Element {
    return (
        <section className="py-12 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-blue-800 mb-4">Håll dig uppdaterad</h2>
                <p className="text-lg text-blue-700 mb-6">
                    Följ oss på LinkedIn för att ta del av våra senaste nyheter, uppdateringar och följ vår resa.
                </p>
                <a
                    href="https://www.linkedin.com/company/oss-l%C3%A4rare-emellan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-800 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Linkedin size={20} />
                    Besök vår LinkedIn
                </a>
            </div>
        </section>
    );
}
