import { Element } from "react-scroll";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    title: "Dela Resurser",
    description:
      "Dela och upptäck resurser för att förbättra undervisningen. Hitta inspiration i andras material och dela dina egna idéer.",
    image: "/Images/ResurserMockup.png",
  },
  {
    title: "Bygg Nätverk",
    description:
      "Anslut med andra lärare, utbyt idéer och samarbeta över hela Sverige. Skapa meningsfulla relationer och stärk ditt professionella nätverk.",
    image: "/Images/MeddelandenMockup.png",
  },
  {
    title: "Delta i Samtal",
    description:
      "Håll dig uppdaterad med nya metoder genom samtal och forum. Dela insikter och lär dig från andras erfarenheter i olika ämnen.",
    image: "/Images/ForumMockup.png",
  },
  {
    title: "Anpassa Innehåll",
    description:
      "Filtrera och anpassa innehåll baserat på dina ämnen och intressen. Få en skräddarsydd upplevelse med relevanta resurser och samtal.",
    image: "/Images/HomePageMockup.png",
  },
];

export function FeatureSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Element name="features" id="features">
          <section ref={ref} className="py-20 bg-gradient-to-r from-green-50 via-sage-50 to-green-100 bg-[length:300%_300%] animate-bgMove">

        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-4xl font-bold text-center mb-16 text-gray-800 leading-tight"
          >
            Vad kan du göra med{" "}
            <span className="text-[var(--ole-green)]">Oss Lärare Emellan?</span>
          </motion.h2>

          {/* Reduced vertical gap on small screens */}
          <div className="space-y-4 md:space-y-16">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                index={index}
                title={feature.title}
                description={feature.description}
                image={feature.image}
                reversed={index % 2 === 1}
              />
            ))}
          </div>
        </div>
      </section>
    </Element>
  );
}

function FeatureCard({ index, title, description, image, reversed }) {
  // Set up a ref and useInView for each card individually.
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { once: true, amount: 0.2 });

  return (
      <motion.div
          ref={cardRef}
          initial={{ opacity: 0, x: reversed ? 50 : -50 }}
          animate={isCardInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="flex flex-col md:flex-row items-center justify-between gap-2 lg:gap-8 p-6 rounded-xl transition-all duration-100"
          whileHover={{ scale: 1.05 }}
      >

      {/* Image */}
      <div
        className={`md:w-1/2 flex-shrink-0 ${
          reversed ? "md:order-2" : "md:order-1"
        }`}
      >
        <a href="/funktioner">
          <div className="w-full h-64 lg:h-[400px] rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={image}
              alt={title}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </a>
      </div>

      {/* Text */}
      <div
        className={`md:w-1/2 ${
          reversed ? "md:order-1 md:text-right" : "md:order-2"
        }`}
      >
        <a href="/funktioner">
                  <h3 className="text-3xl md:text-5xl font-semibold text-[var(--ole-green)] mb-4 flex items-center gap-2 ">
                      {index === 0 && "📂"}
                      {index === 1 && "🤝"}
                      {index === 2 && "💬"}
                      {index === 3 && "⚙️"}
                      {title}
                  </h3>

          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            {description}
          </p>
        </a>
      </div>
    </motion.div>
  );
}
