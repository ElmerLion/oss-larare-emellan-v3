import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Element } from "react-scroll";
import { Button } from "@/components/ui/button";

// Add a prop to control the visibility of the "Läs Mer" button
export function PersonaSection({ disableReadMore = false }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const teamMembers = [
        {
            name: "Emmie",
            description: "Projektledare",
            image: "/Images/Emmie.png",
        },
        {
            name: "Elmer",
            description: "Utvecklare",
            image: "/Images/Elmer.png",
        },
        {
            name: "Amanda",
            description: "Designer",
            image: "/Images/Amanda2.png",
        },
    ];

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
                                className="flex flex-col items-center text-center"
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
                    {/* Render the "Läs Mer" button only if disableReadMore is false */}
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
                </div>
            </section>
        </Element>
    );
}
