import { Element } from "react-scroll";
import { supabase } from "@/integrations/supabase/client";
import React, { useState } from "react";

export function CTASection() {
    const [showPopup, setShowPopup] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");

    return (
        <Element name="cta" id="cta">
            <section className="py-20 bg-gradient-to-r from-sage-50 via-white to-sage-50 relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Subtle Decorative Elements */}
                    <div className="absolute top-0 left-1/4 w-20 h-20 rounded-full bg-green-100 blur-xl opacity-50"></div>
                    <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full bg-sage-200 blur-2xl opacity-40"></div>

                    <h2 className="text-4xl font-bold text-gray-800 mb-8">
                        Jag vill testa OLE!
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Registrera dig som beta-testare för{" "}
                        <strong>
                            <span className="text-[var(--ole-green)]">Oss Lärare Emellan</span>
                        </strong>{" "}
                        och hjälp oss forma framtidens verktyg för lärare.
                    </p>

                    {/* Email Registration Form */}
                    <form
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const email = (e.target as HTMLFormElement).email.value;

                            if (email) {
                                try {
                                    // Check if the email already exists
                                    const { data: existingEmails, error: fetchError } = await supabase
                                        .from("beta_testers")
                                        .select("id")
                                        .eq("email", email);

                                    if (fetchError) {
                                        console.error(fetchError);
                                        alert("Kunde inte kontrollera e-postadressen. Försök igen senare.");
                                        return;
                                    }

                                    if (existingEmails && existingEmails.length > 0) {
                                        alert("Den här e-postadressen är redan registrerad!");
                                        return;
                                    }

                                    // Insert the new beta tester
                                    const { error: insertError } = await supabase
                                        .from("beta_testers")
                                        .insert({ email });

                                    if (insertError && insertError.code === "23505") {
                                        alert("Den här e-postadressen är redan registrerad!");
                                        return;
                                    }

                                    if (insertError) {
                                        console.error(insertError);
                                        alert("Kunde inte registrera dig. Försök igen senare.");
                                        return;
                                    }

                                    // If successful, show the popup
                                    setRegisteredEmail(email);
                                    setShowPopup(true);
                                    (e.target as HTMLFormElement).reset();
                                } catch (err) {
                                    console.error("Server error:", err);
                                    alert("Något gick fel. Försök igen senare.");
                                }
                            }
                        }}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Din e-postadress"
                                className="w-full sm:w-[400px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--ole-green)]"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-[color:var(--ole-green)] text-white font-medium px-16 py-2 text-lg rounded-md hover:bg-[color:var(--hover-green)] hover:scale-105 shadow-md hover:shadow-lg transition-transform duration-300 ease-in-out"
                            >
                                Registrera mig
                            </button>
                        </div>
                    </form>
                </div>

                {/* Success Popup */}
                {showPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Overlay */}
                        <div
                            className="absolute inset-0 bg-black bg-opacity-50"
                            onClick={() => setShowPopup(false)}
                        />
                        {/* Popup Card */}
                        <div className="relative z-10 bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
                            <h3 className="text-xl font-semibold mb-2">
                                Tack för din registrering!
                            </h3>
                            <p className="mb-4">
                                Vi har mottagit din e-postadress <strong>{registeredEmail}</strong>.<br></br>
                                Vi kommer att kontakta dig om vi behöver fler beta testare.
                            </p>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="bg-[color:var(--ole-green)] text-white px-4 py-2 rounded hover:bg-[color:var(--hover-green)] transition-colors"
                            >
                                Stäng
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </Element>
    );
}
