import { Helmet } from "react-helmet";
import { LandingPageHeader } from "@/components/landingPage/LandingPageHeader";
import { Button } from "@/components/ui/button";
import { PersonaSection } from "@/components/landingPage/PersonaSection";

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
            </Helmet>

            <div>
                {/* Header */}
                <LandingPageHeader />

                <div className="absolute w-full h-full z-10" aria-hidden="true">
                    <svg
                        className="absolute inset-0 w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 800 800"
                    >
                        {/* SVG paths go here */}
                        <path
                            d="M700 500 C770 430, 870 430, 870 550 C870 670, 770 720, 700 670 C630 620, 630 550, 700 500 Z"
                            fill="#b97375"
                            opacity="1"
                            transform="translate(400 -200)"
                        />
                        <path
                            d="M670 180 C700 150, 800 150, 800 250 C800 350, 600 400, 650 350 C500 200, 600 250, 650 200 Z"
                            fill="#1b7895"
                            opacity="1"
                            transform="translate(480 0)"
                        />
                        <path
                            d="M600 500 C580 480, 550 520, 580 540 C610 560, 630 520, 610 500 C590 480, 600 500, 600 500 Z"
                            fill="#b97375"
                            opacity="1"
                            transform="translate(420 -220)"
                        />
                        <path
                            d="M120 80 C100 60, 80 120, 120 140 C160 160, 180 120, 160 100 C140 80, 140 80, 120 80 Z"
                            fill="#1b7895"
                            opacity="1"
                            transform="translate(-450 350)"
                        />
                        <path
                            d="M100 150 C50 100, 50 350, 150 400 C250 450, 300 350, 250 250 C200 200, 150 200, 100 150 Z"
                            fill="#1b7895"
                            opacity="1"
                            transform="translate(-550 300)"
                        />
                        <path
                            d="M50 600 C0 550, 0 650, 100 700 C200 750, 250 650, 200 600 C150 550, 100 550, 50 600 Z"
                            fill="#b97375"
                            opacity="1"
                            transform="translate(-500 50)"
                        />
                    </svg>
                </div>

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
                    <section className="py-20 bg-gradient-to-r from-green-50 to-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h2 className="text-3xl font-bold text-gray-800 mb-8">
                                Vill du vara en del av vår gemenskap?
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                Gå med i <strong><span className="text-[var(--primary)]">Oss Lärare Emellan</span></strong> och
                                upplev kraften av <strong><span className="text-[var(--primary)]">samarbete</span></strong>.
                            </p>
                            <button
                                className="bg-[color:var(--ole-green)] text-white text-lg font-medium px-8 py-4 rounded-lg hover:bg-[color:var(--hover-green)] hover:scale-105 shadow-md hover:shadow-lg transition-transform duration-300 ease-in-out"
                                onClick={() => window.location.href = "/login?register=true"}
                            >
                                Bli medlem nu
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
