import { Helmet } from "react-helmet";
import { LandingPageHeader } from "@/components/landingPage/LandingPageHeader";
import { Button } from "@/components/ui/button";
import { PersonaSection } from "@/components/landingPage/PersonaSection";
import { CTASection } from "@/components/landingPage/CTASection";
import { LinkedInBanner } from "@/components/landingPage/LinkedInBanner";


export default function OmOss() {
    return (
        <>
            <Helmet>
                <title>Om Oss | Oss Lärare Emellan - Gemenskap för Sveriges lärare</title>
                <meta
                    name="description"
                    content="Läs om Oss Lärare Emellan. Vår vision är att stärka och förena Sveriges lärare genom innovation, samarbete och delning av resurser."
                />
                <meta
                    name="keywords"
                    content="lärare, utbildning, gemenskap, samarbete, undervisning, inspiration, Sverige"
                />
                <link rel="canonical" href="https://www.osslarareemellan.se/omoss" />
                <script type="application/ld+json">
                    {`
        {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "Om Oss",
            "description": "Lär dig mer om Oss Lärare Emellan, en plattform skapad för att förena och stärka Sveriges lärare genom delning av resurser, samarbete och inspiration.",
            "url": "https://www.osslarareemellan.se/omoss"
        }
        `}
                </script>
            </Helmet>

            <div>
                {/* Header */}
                <LandingPageHeader />

               

                <main>
                    {/* Vision Section */}
                    <section className="py-20 bg-sage-50 mt-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                                Vår Vision
                            </h2>
                            <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
                                Vi strävar efter att skapa en miljö där lärare inte bara samarbetar
                                utan också inspireras att växa tillsammans. Vi tror på kraften av
                                gemenskap och innovation för att möta de ständigt föränderliga
                                behoven inom utbildning.
                            </p>
                            <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto mt-8 leading-relaxed">
                                Vår vision är att varje lärare i Sverige ska ha tillgång till de
                                verktyg, resurser och nätverk de behöver för att lyckas i sin roll
                                och ge sina elever bästa möjliga förutsättningar.
                            </p>
                        </div>
                    </section>

                    {/* Team Section */}
                    <PersonaSection
                        disableReadMore={true}
                        showContactAtCursor={true}
                    />
                    
                    {/* About Us Section */}
                    <section className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
                                Om Oss
                            </h1>
                            <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
                                Oss Lärare Emellan är en plattform skapad för lärare. Vårt mål är att
                                förena och stärka Sveriges lärarkår genom att erbjuda en gemenskap där
                                erfarenheter, resurser och inspiration kan delas. Vi tror på kraften
                                av samarbete och innovation för att förbättra utbildningen och göra
                                lärarens vardag enklare och mer givande.
                            </p>

                            <div className="mt-12 flex flex-col items-center">
                                <p className="text-lg text-gray-600 text-center max-w-4xl mb-8">
                                    Plattformen är byggd med användarvänlighet i åtanke. Vi erbjuder
                                    funktioner som resursdelning, diskussioner och möjligheten att
                                    nätverka med andra lärare över hela Sverige. Tillsammans bygger vi
                                    framtidens utbildning.
                                </p>
                                <p className="text-lg text-gray-600 text-center max-w-4xl">
                                    Vi förstår att varje lärare möter unika utmaningar, och därför är
                                    vår vision att skapa en plats där dessa utmaningar kan mötas med
                                    gemensam kunskap och stöd. Oavsett om du behöver idéer för din
                                    nästa lektion, vill hitta nya undervisningsmetoder eller bara vill
                                    utbyta erfarenheter med andra engagerade lärare – Oss Lärare
                                    Emellan är här för dig.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Call to Action */}
                    <LinkedInBanner />
                </main>
            </div>
        </>
    );
}
