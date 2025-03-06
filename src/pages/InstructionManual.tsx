// src/pages/InstructionManual.tsx
import React from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Footer } from "@/components/Footer";

export default function InstructionManual() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8">
        {/* Overview */}
        <section id="overview" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Instruktionsmanual</h1>
          <p className="text-gray-700">
            Välkommen till Oss Lärare Emellan! Denna plattform är utformad för att
            underlätta samarbete mellan lärare genom att dela resurser, delta i
            forumdiskussioner, skicka meddelanden och mycket mer.
          </p>
        </section>

        {/* Navigation */}
        <section id="navigation" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-2 -mt-2">Navigering</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Hur det fungerar</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Sidomenyn ger snabb åtkomst till alla huvudsektioner.</li>
              <li>På mobila enheter används en hamburgerknapp för att visa sidomenyn.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Vad du kan göra</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Navigera snabbt mellan Hem, Profil, Forum, Meddelanden, Resurser, etc.</li>
              <li>Använd snabblänkarna för att komma direkt till den funktion du vill använda.</li>
            </ul>
          </div>
        </section>

        {/* Profile */}
        <section id="profile" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-2 -mt-2">Profil</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Hur det fungerar</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Din profilsida visar dina personliga uppgifter och statistik som nedladdningar och profilbesök.</li>
              <li>Du kan redigera din profil för att uppdatera intressen, ämnen och andra detaljer.</li>
              <li>Allting på din profil är offentligt och kan visas av andra medlemmar.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Vad du kan göra</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Uppdatera din profil med information om dina kompetenser och intressen.</li>
              <li>Visa andra dina resurser och engagera dig med kollegor.</li>
            </ul>
          </div>
        </section>

        {/* Forum */}
        <section id="forum" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-2 -mt-2">Forum & Samtal</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Hur det fungerar</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Klicka på "Starta ett nytt samtal" för att inleda ett samtal.</li>
              <li>Skriv din fråga och en beskrivning samt lägg till taggar (max 5) som matchar dina intressen.</li>
              <li>Alla på plattformen kan se samtal som skapas.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Vad du kan göra</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Samtala om aktuella ämnen, dela idéer, och få feedback från andra lärare.</li>
              <li>Bidra med dina tankar inom teknik, nyheter, undervisning, och mycket mer.</li>
              <li>Se vad andra samtalar om.</li>
            </ul>
          </div>
        </section>

        {/* Resources */}
        <section id="resources" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-2 -mt-2">Resurser</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Hur det fungerar</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Klicka på "Dela Resurs" för att ladda upp material som lektioner, prov, anteckningar och annat.</li>
              <li>Resurserna presenteras baserat på dina valda ämnen och utbildningsnivå.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Vad du kan göra</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Ladda upp och dela dina undervisningsmaterial med dina kollegor.</li>
              <li>Få inspiration genom att utforska material som andra har delat.</li>
            </ul>
          </div>
        </section>

        {/* Messages */}
        <section id="messages" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-2 -mt-2">Meddelanden & Grupper</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Hur det fungerar</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Skicka och ta emot meddelanden från alla på plattformen.</li>
              <li>Se de användare du lagt till som kontakter.</li>
              <li>Olästa meddelanden visas tydligt i sidomenyn.</li>
              <li>Alla medlemmar kan skapa grupper för att hitta lärare med liknande intressen.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Vad du kan göra</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Kommunicera med kollegor och dela idéer via meddelanden.</li>
              <li>Organisera dina konversationer för enkel åtkomst.</li>
              <li>Skapa en grupp  inom ditt ämne och dela med dig av kunskaper och lär känna lärare som jobbar med samma ämnen som dig.</li>
              <li>Dela med dig av dina egna resurser eller ladda upp en fil och skicka till en annan användare.</li>
            </ul>
          </div>
        </section>

        {/* Feedback */}
        <section id="feedback" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-2 -mt-2">Feedback</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Hur det fungerar</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Använd feedbackfunktionen för att skicka dina synpunkter till oss.</li>
              <li>Ditt meddelande skickas direkt till oss.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Vad du kan göra</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Ge oss förslag på förbättringar och nya funktioner.</li>
              <li>Hjälp oss att göra plattformen bättre med din feedback.</li>
            </ul>
          </div>
        </section>

        {/* Settings */}
        <section id="settings" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-2 -mt-2">Inställningar</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Hur det fungerar</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Hantera ditt konto, ändra lösenord, och uppdatera dina intressen och ämnen.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Vad du kan göra</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Redigera din profil och anpassa dina preferenser.</li>
              <li>Uppdatera dina intressen, ämnen och andra personliga uppgifter.</li>
              <li>Radera ditt konto och all tillhörande data.</li>
            </ul>
          </div>
        </section>

        {/* Library */}
        <section id="library" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-2 -mt-2">Bibliotek</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Hur det fungerar</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Spara inlägg och resurser i ditt bibliotek för att enkelt hitta dem senare.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Vad du kan göra</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Organisera dina sparade inlägg och resurser i olika listor.</li>
              <li>Hantera och sortera dina sparade objekt för snabb åtkomst.</li>
            </ul>
          </div>
        </section>

        {/* Getting Started */}
        <section id="getting-started" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Komma igång</h2>
          <div className="mb-4">
            <p className="text-gray-700">
              För att komma igång, registrera dig eller logga in. När du är inloggad kan du
              navigera via sidomenyn, skapa diskussioner, ladda upp resurser, skicka meddelanden,
              och hantera ditt konto.
            </p>
          </div>
        </section>

        {/* Support */}
        <section id="support" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Behöver du hjälp?</h2>
          <div>
            <p className="text-gray-700">
              Skicka dina frågor direkt till oss via feedbackfunktionen eller kontakta oss på{" "}
              <a
                              href="mailto:info@osslarareemellan.se"
                className="text-[var(--ole-green)] hover:underline"
              >
                info@osslarareemellan.se
              </a>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
