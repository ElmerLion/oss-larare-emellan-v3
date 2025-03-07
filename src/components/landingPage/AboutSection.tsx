import { motion, useInView } from "framer-motion";
import { Element } from "react-scroll";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function AboutSection() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 }); // Triggers when 20% of the component is in view

  return (
    <Element name="about" id="about">
          <section className="py-20 bg-gradient-to-r from-sage-50 to-white relative z-0 overflow-hidden bg-gradient-to-r from-green-50 via-sage-50 to-green-100 bg-[length:300%_300%] animate-bgMove">
        {/* Background Blobs */}
        <div className="absolute inset-0 -z-10">
          <svg
            className="absolute top-10 left-10 w-40 h-40 opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
          >
            <path
              d="M50,-50C60,-30,80,-20,90,-5C100,10,90,30,70,40C50,50,20,60,5,50C-10,40,-20,20,-40,10C-60,-5,-50,-30,-40,-50C-30,-70,-10,-80,10,-80C30,-80,40,-70,50,-50Z"
              transform="translate(100 100)"
              fill="var(--secondary2)"
            />
          </svg>
          <svg
            className="absolute bottom-10 right-10 w-60 h-60 opacity-40"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
          >
            <path
              d="M40,-50C55,-40,75,-25,75,-5C75,15,55,35,40,50C25,65,5,75,-15,70C-35,65,-55,45,-55,25C-55,5,-35,-15,-20,-35C-5,-55,15,-65,40,-50Z"
              transform="translate(100 100)"
              fill="var(--secondary)"

            />
          </svg>
        </div>

        <div
          ref={ref}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Title with Animation */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-12"
          >
            <span className="text-[var(--ole-green)]">OLE</span> Hjälper{" "}
            <span className="text-[var(--ole-green)]">Lärare</span> Att Lyckas.
          </motion.h2>

          {/* Description with Subtle Animation */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16"
          >
            OLE är en digital plattform som hjälper lärare att{" "}
            <span className="font-semibold text-[var(--ole-green)]">samarbeta</span>,{" "}
            <span className="font-semibold text-[var(--ole-green)]">dela resurser</span> och{" "}
            <span className="font-semibold text-[var(--ole-green)]">inspirera</span>{" "}
            varandra för att stärka undervisningen i svenska skolor.
          </motion.p>

          {/* Call-to-Action */}
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
