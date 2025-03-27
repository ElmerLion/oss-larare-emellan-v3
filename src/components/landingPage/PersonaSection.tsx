import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Element } from "react-scroll";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin } from "lucide-react";

type PersonaSectionProps = {
    disableReadMore?: boolean;
    showContactAtCursor?: boolean;
};

export function PersonaSection({
    disableReadMore = false,
    showContactAtCursor = false,
}: PersonaSectionProps) {
    const ref = useRef<HTMLHeadingElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    // State to track which member is clicked and where the click happened.
    const [clickedMember, setClickedMember] = useState<number | null>(null);
    const [initialClickPos, setInitialClickPos] = useState({ x: 0, y: 0 });
    const dialogRef = useRef<HTMLDivElement>(null);
    // Ref to ignore the first global click event after opening the dialog.
    const justOpenedRef = useRef(false);

    const teamMembers = [
        {
            name: "Emmie",
            description:
                "Jag ser till att alla projekt rullar på smidigt och organiserat, med fokus på att hålla rätt kurs mot våra mål.",
            image: "/Images/Emmie.png",
            email: "emmie@osslarareemellan.se",
            linkedIn: "https://www.linkedin.com/in/emmienilsson/",
        },
        {
            name: "Elmer",
            description:
                "Det är jag som programmerar och bygger upp OLEs hemsida, att utveckla kreativa lösningar som driver vårt arbete framåt är min specialitet.",
            image: "/Images/Elmer.png",
            email: "elmer@osslarareemellan.se",
            linkedIn: "https://www.linkedin.com/in/elmer-almer-ershagen-838905271/",
        },
        {
            name: "Amanda",
            description:
                "Med ett öga för detaljer skapar jag OLEs designlösningar som gör vår plattform tilltalande och användarvänlig.",
            image: "/Images/Amanda2.png",
            email: "amanda@osslarareemellan.se",
            linkedIn: "https://www.linkedin.com/in/amanda-gunnarsson-nial-a81418327/",
        },
    ];

    const handleMemberClick = (event: React.MouseEvent, index: number) => {
        if (!showContactAtCursor) return;
        // Toggle the dialog if clicking the same member.
        if (clickedMember === index) {
            setClickedMember(null);
        } else {
            setClickedMember(index);
            setInitialClickPos({ x: event.clientX, y: event.clientY });
            justOpenedRef.current = true;
            setTimeout(() => {
                justOpenedRef.current = false;
            }, 50);
        }
        // Prevent propagation so that the global click doesn't immediately close the dialog.
        event.stopPropagation();
    };

    useEffect(() => {
        if (clickedMember === null) return;

        const threshold = 100; // pixels

        const handleGlobalMouseMove = (event: MouseEvent) => {
            const dx = event.clientX - initialClickPos.x;
            const dy = event.clientY - initialClickPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > threshold) {
                setClickedMember(null);
            }
        };

        const handleGlobalClick = (event: MouseEvent) => {
            if (justOpenedRef.current) return;
            if (
                dialogRef.current &&
                !dialogRef.current.contains(event.target as Node)
            ) {
                setClickedMember(null);
            }
        };

        window.addEventListener("mousemove", handleGlobalMouseMove);
        window.addEventListener("click", handleGlobalClick);

        return () => {
            window.removeEventListener("mousemove", handleGlobalMouseMove);
            window.removeEventListener("click", handleGlobalClick);
        };
    }, [clickedMember, initialClickPos]);

    return (
        <Element name="persona" id="persona">
            <section className="py-20 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        ref={ref}
                        initial={{ opacity: 0, y: -20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="text-4xl font-bold text-center mb-12"
                    >
                        Möt teamet bakom OLE
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center text-center cursor-pointer"
                                onClick={(e) => handleMemberClick(e, index)}
                            >
                                <motion.img
                                    src={member.image}
                                    alt={member.name}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-64 h-64 rounded-full object-cover shadow-lg mb-4"
                                />
                                <motion.h3
                                    whileHover={{ color: "var(--secondary2)" }}
                                    transition={{ duration: 0.3 }}
                                    className="text-2xl font-semibold mb-2"
                                >
                                    {member.name}
                                </motion.h3>
                                <motion.p
                                    whileHover={{ color: "#4A5568" }}
                                    transition={{ duration: 0.3 }}
                                    className="text-lg text-gray-600"
                                >
                                    {member.description}
                                </motion.p>
                            </motion.div>
                        ))}
                    </div>

                    {!disableReadMore && (
                        <div className="flex justify-center mt-12">
                            <Button
                                variant="primary"
                                size="lg"
                                className="text-lg px-8 btn-animated"
                                onClick={() => (window.location.href = "/omoss")}
                            >
                                Läs Mer
                            </Button>
                        </div>
                    )}

                    {showContactAtCursor && clickedMember !== null && (
                        <div
                            ref={dialogRef}
                            className="fixed z-50 bg-white border border-gray-300 rounded-md p-2 shadow-lg flex space-x-2"
                            style={{
                                top: initialClickPos.y + 10,
                                left: initialClickPos.x + 10,
                            }}
                        >
                            <a
                                href={`mailto:${teamMembers[clickedMember].email}`}
                                className="text-blue-500 hover:text-blue-700"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Mail size={20} />
                            </a>
                            <a
                                href={teamMembers[clickedMember].linkedIn}
                                className="text-blue-500 hover:text-blue-700"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Linkedin size={20} />
                            </a>
                        </div>
                    )}
                </div>
            </section>
        </Element>
    );
}
