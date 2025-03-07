import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Element } from "react-scroll";
import { Button } from "@/components/ui/button";

export function PersonaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
            Möt en av Våra Användare
          </motion.h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <motion.img
              src="/lovable-uploads/23886c31-4d07-445c-bf13-eee4b2127d40.png" // Replace with your image path
              alt="Persona"
              className="w-64 h-64 rounded-full object-cover shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center md:text-left max-w-lg"
            >
              <p className="text-xl text-gray-700 mb-4">
                Anna, en passionerad lärare som ständigt söker nya sätt att utvecklas men blir överväldigad av administrativt arbete och planering.
              </p>
              <p className="text-lg text-gray-600">
                Med OLE kan Anna effektivisera sitt arbete, dela resurser med kollegor och hitta ny inspiration – allt för att Anna ska kunna göra det hon älskar.
              </p>
            </motion.div>
          </div>
          {/* Call-to-Action Button */}
          <div className="flex justify-center mt-12">
                      <Button
            variant="primary"
              size="lg"
              className="text-lg px-8 btn-animated"
              onClick={() => window.location.href = "/login?register=true"}
            >
              Gå med nu
            </Button>
          </div>
        </div>
      </section>
    </Element>
  );
}
