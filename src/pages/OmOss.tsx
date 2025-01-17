import { LandingPageHeader } from "@/components/landingPage/LandingPageHeader";
import { Button } from "@/components/ui/button";

export default function OmOss() {
  return (
    <div>
      {/* Header */}
      <LandingPageHeader />

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

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Om Oss
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
            Oss Lärare Emellan är en plattform skapad för lärare.
            Vårt mål är att förena och stärka Sveriges lärarkår genom att
            erbjuda en gemenskap där erfarenheter, resurser och inspiration kan
            delas. Vi tror på kraften av samarbete och innovation för att
            förbättra utbildningen och göra lärarens vardag enklare och mer
            givande.
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
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Gå med i Oss Lärare Emellan idag och upplev kraften av samarbete.
            Tillsammans kan vi forma framtidens utbildning.
          </p>
            <button
            className="bg-[color:var(--ole-green)] text-white text-lg font-medium px-8 py-4 rounded-lg hover:bg-[color:var(--hover-green)] hover:scale-105 shadow-md hover:shadow-lg transition-transform duration-300 ease-in-out"
            onClick={() => window.location.href = "/login?register=true"}
          >
            Bli medlem nu
          </button>
        </div>
      </section>
    </div>
  );
}
