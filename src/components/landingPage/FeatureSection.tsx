import { Element } from "react-scroll";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CTASection } from "@/components/landingPage/CTASection";

const features = [
  {
    title: "Dela Resurser",
    description:
      "Dela och upptäck resurser för att förbättra undervisningen. Hitta inspiration i andras material och dela dina egna idéer.",
    image: "/Images/share-resources.png",
  },
  {
    title: "Bygg Nätverk",
    description:
      "Anslut med andra lärare, utbyt idéer och samarbeta över hela Sverige. Skapa meningsfulla relationer och stärk ditt professionella nätverk.",
    image: "/Images/networking.png",
  },
  {
    title: "Delta i Diskussioner",
    description:
      "Håll dig uppdaterad med nya metoder genom diskussioner och forum. Dela insikter och lär dig från andras erfarenheter i olika ämnen.",
    image: "/Images/discussions.png",
  },
  {
    title: "Anpassa Innehåll",
    description:
      "Filtrera och anpassa innehåll baserat på dina ämnen och intressen. Få en skräddarsydd upplevelse med relevanta resurser och diskussioner.",
    image: "/Images/customize-content.png",
  },
];


export function FeatureSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Element name="features" id="features">
      <section ref={ref} className="py-20 bg-gradient-to-r from-green-50 via-sage-50 to-green-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-16 text-gray-800"
          >
            Vad kan du göra med{" "}
            <span className="text-[var(--ole-green)]">Oss Lärare Emellan?</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                image={feature.image}
                isInView={isInView}
                reversed={index % 2 === 1}
              />
            ))}
          </div>
        </div>
      </section>
    </Element>


  );
}

const FeatureCard = ({ title, description, image, isInView, reversed }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.02 }}
      className={`flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-200 ${
        reversed ? "md:flex-row-reverse" : ""
      }`}
    >

      {/* Image Section */}
      <div className="md:w-1/2">
        <a href="/funktioner">
            <img src={image} alt={title} className="w-full h-64 object-cover rounded-lg shadow-md" />
        </a>
      </div>

      {/* Text Section */}
      <div className="md:w-1/2">
        <a href="/funktioner">
            <h3 className="text-2xl font-semibold text-[var(--ole-green)] mb-4">{title}</h3>
            <p className="text-gray-700 leading-relaxed">{description}</p>
        </a>
      </div>
    </motion.div>
  );
};
