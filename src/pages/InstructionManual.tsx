// src/pages/InstructionManual.tsx
import React from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Footer } from "@/components/Footer";

export default function InstructionManual() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <AppSidebar />

            <main className="flex-1 lg:ml-64 p-8">
                <section id="overview" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
                    <h1 className="text-3xl font-bold mb-6">Instruktionsmanual</h1>
                    <p className="text-gray-700">
                        Välkommen till Oss Lärare Emellan! Denna plattform är utformad för att underlätta samarbete mellan lärare genom att dela resurser, delta i forumdiskussioner, skicka meddelanden och mycket mer.
                    </p>
                </section>

                <section id="navigation" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-2 -mt-2">Navigering</h2>
                    <p className="text-gray-700 mb-4">
                        Sidomenyn ger snabb åtkomst till alla huvudsektioner. På mobila enheter används en hamburgerknapp för att visa menyn. Du kan navigera mellan Hem, Profil, Forum, Meddelanden, Resurser med mera via snabblänkar.
                    </p>
                </section>

                <section id="profile" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-2 -mt-2">Profil</h2>
                    <p className="text-gray-700 mb-4">
                        På din profilsida visas dina personliga uppgifter och statistik, exempelvis nedladdningar och profilbesök. Här kan du redigera din profil för att uppdatera intressen, ämnen och kompetenser – all information är synlig för andra medlemmar.
                    </p>
                </section>

                <section id="forum" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-2 -mt-2">Forum & Samtal</h2>
                    <p className="text-gray-700 mb-4">
                        Klicka på "Starta ett nytt samtal" för att inleda en diskussion. Skriv din fråga, beskrivning och lägg till upp till fem relevanta taggar. Alla samtal syns för plattformens medlemmar, vilket möjliggör idéutbyte och feedback.
                    </p>
                </section>

                <section id="resources" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-2 -mt-2">Resurser</h2>
                    <p className="text-gray-700 mb-4">
                        Klicka på "Dela Resurs" för att ladda upp material som lektioner, prov, anteckningar med mera. Resurserna visas baserat på dina valda ämnen och utbildningsnivå, så att du enkelt kan dela dina material och få inspiration av andras.
                    </p>
                </section>

                <section id="feedback" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-2 -mt-2">Feedback</h2>
                    <p className="text-gray-700 mb-4">
                        Använd feedbackfunktionen för att direkt skicka dina synpunkter och förslag till oss. Dina meddelanden hjälper oss att ständigt förbättra plattformen.
                    </p>
                </section>

                <section id="settings" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-2 -mt-2">Inställningar</h2>
                    <p className="text-gray-700 mb-4">
                        Hantera ditt konto genom att ändra lösenord, uppdatera intressen, ämnen och andra personliga uppgifter. Du kan även redigera din profil eller radera kontot och all tillhörande data.
                    </p>
                </section>

                <section id="library" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-2 -mt-2">Bibliotek</h2>
                    <p className="text-gray-700 mb-4">
                        Spara inlägg och resurser i ditt bibliotek för att enkelt hitta dem senare. Organisera och sortera dina sparade objekt i olika listor.
                    </p>
                </section>

                <section id="getting-started" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-2">Komma igång</h2>
                    <p className="text-gray-700 mb-4">
                        Registrera dig eller logga in för att komma igång. När du är inloggad kan du navigera via sidomenyn, skapa diskussioner, ladda upp resurser, skicka meddelanden och hantera ditt konto.
                    </p>
                </section>

                <section id="support" className="mb-8 bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-2">Behöver du hjälp?</h2>
                    <p className="text-gray-700">
                        Skicka dina frågor direkt via feedbackfunktionen eller kontakta oss på{" "}
                        <a href="mailto:info@osslarareemellan.se" className="text-[var(--ole-green)] hover:underline">
                            info@osslarareemellan.se
                        </a>.
                    </p>
                </section>
            </main>
        </div>
    );
}
