import { LandingPageHeader } from "@/components/landingPage/LandingPageHeader";

export default function Integritetspolicy() {
  return (
    <div>
      {/* Header */}
      <LandingPageHeader />

      {/* Privacy Policy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Integritetspolicy för Oss Lärare Emellan
          </h1>

          <div className="text-lg text-gray-700 space-y-6">
            <p>
              Vi på <span className="font-semibold">Oss Lärare Emellan</span> värnar om din integritet och är måna om att skydda dina personuppgifter. Denna
              integritetspolicy beskriver hur vi samlar in, använder och skyddar information som du delar med oss när
              du använder vår plattform.
            </p>

            <h2 className="text-2xl font-bold mt-6">Vilken information samlar vi in?</h2>
            <p>
              När du registrerar dig eller använder Oss Lärare Emellan kan vi samla in följande information:
            </p>
            <ul className="list-disc pl-6">
              <li>Kontaktuppgifter: Namn och e-postadress.</li>
              <li>
                Kontoaktivitet: Interaktioner på plattformen, som delning av resurser eller deltagande i diskussioner.
              </li>
              <li>
                Teknisk data: Information om enhet och webbläsare, för att förbättra användarupplevelsen.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-6">Hur använder vi informationen?</h2>
            <p>Vi använder den insamlade informationen för följande ändamål:</p>
            <ul className="list-disc pl-6">
              <li>För att skapa och hantera ditt konto.</li>
              <li>För att möjliggöra resursdelning, diskussioner och nätverkande på plattformen.</li>
              <li>För att förbättra vår tjänst baserat på användarnas behov och feedback.</li>
              <li>För att skicka viktiga uppdateringar om plattformen.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6">Delar vi information med tredje part?</h2>
            <p>
              Vi delar inte din personliga information med tredje part, förutom i de fall där det är nödvändigt för att
              driva plattformen, till exempel:
            </p>
            <ul className="list-disc pl-6">
              <li>
                <span className="font-semibold">Supabase:</span> Vi använder Supabase som vår databasleverantör.
                Supabase följer branschens högsta säkerhetsstandarder för att skydda dina uppgifter.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-6">Hur skyddar vi din information?</h2>
            <p>
              Vi vidtar tekniska och organisatoriska åtgärder för att skydda din information mot obehörig åtkomst, förlust
              eller missbruk. Våra samarbetspartners, såsom Supabase, tillämpar också högsta säkerhetsstandarder för att
              säkerställa dataskydd.
            </p>

            <h2 className="text-2xl font-bold mt-6">Dina rättigheter</h2>
            <p>Du har rätt att:</p>
            <ul className="list-disc pl-6">
              <li>Få tillgång till de personuppgifter vi har om dig.</li>
              <li>Rätta felaktig information.</li>
              <li>Begära att vi raderar dina uppgifter, förutsatt att det inte strider mot lagliga krav.</li>
              <li>Begränsa eller invända mot hur vi behandlar dina uppgifter.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6">Cookies och spårning</h2>
            <p>
              Vi använder cookies för att förbättra din användarupplevelse. Genom att fortsätta använda plattformen
              samtycker du till användningen av cookies.
            </p>

            <h2 className="text-2xl font-bold mt-6">Kontakt</h2>
            <p>
              Om du har frågor om denna integritetspolicy eller hur vi hanterar din information, kontakta oss på:
              <br />
              <span className="font-semibold">E-post:</span>{" "}
              <a
                href="mailto:osslarareemellan@gmail.com"
                className="text-green-600 hover:underline"
              >
                osslarareemellan@gmail.com
              </a>
            </p>

            <h2 className="text-2xl font-bold mt-6">Ändringar i policyn</h2>
            <p>
              Vi kan komma att uppdatera denna policy från tid till annan för att återspegla ändringar i våra tjänster
              eller lagkrav. Den senaste versionen av policyn finns alltid tillgänglig på vår webbplats.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
