import { Element } from "react-scroll";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LandingPageHeader } from "@/components/landingPage/LandingPageHeader";

const features = [
  {
    title: "Dela Resurser",
    description: "Dela och upptäck lektionsplaner och resurser för att förbättra din undervisning. Genom att dela dina bästa lektionsplaner och material kan du hjälpa andra lärare och samtidigt få tillgång till en mängd resurser som kan förbättra din egen undervisning.",
    image: "../Images/share-resources.png",
  },
  {
    title: "Bygg Nätverk",
    description: "Anslut med andra lärare, utbyt idéer och samarbeta över hela Sverige. Att skapa kontakt med andra pedagoger gör att du kan få nya perspektiv, utveckla innovativa lösningar och hitta samarbetspartners för gemensamma projekt.",
    image: "../Images/networking.png",
  },
  {
    title: "Delta i Diskussioner",
    description: "Håll dig uppdaterad med pedagogiska metoder genom diskussioner och forum. Genom att aktivt delta i samtal om undervisningsmetoder och utmaningar får du insikter i hur andra hanterar liknande situationer.",
    image: "../Images/discussions.png",
  },
  {
    title: "Anpassa Innehåll",
    description: "Filtrera och anpassa innehåll baserat på dina ämnen och intressen. Med skräddarsydda funktioner kan du lätt hitta resurser och diskussioner som är relevanta för dig. Genom att anpassa ditt flöde säkerställer du att du får den mest värdefulla informationen direkt, utan att behöva leta igenom irrelevant material.",
    image: "../Images/customize-content.png",
  },
];

export default function FeatureSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
  <div className="mt-16">
  <LandingPageHeader />
      <section ref={ref} className="py-20 bg-gradient-to-r from-sage-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-16"
          >
            Vad kan du göra med <span className="text-[var(--ole-green)]">Oss Lärare Emellan?</span>
          </motion.h2>
          <div className="border-t border-[var(--secondary)] my-10" />

          <div className="space-y-16">
            {features.map((feature, index) => (
              <>
                <FeatureItem
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  image={feature.image}
                  isInView={isInView}
                  reversed={index % 2 === 1}
                />
                {index < features.length - 1 && <div className="border-t border-[var(--secondary)] my-10" />}
              </>
            ))}
          </div>
        </div>
      </section>
        </div>
  );
}

const FeatureItem = ({ title, description, image, isInView, reversed }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.1 }}
      whileHover={{ scale: 1.05 }}
      className={`flex flex-col md:flex-row items-center gap-10 transition-transform duration-100 ${reversed ? "md:flex-row-reverse" : ""}`}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="md:w-1/2"
      >
        <img src={image} alt={title} className="w-full rounded-lg shadow-lg" />
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="md:w-1/2"
      >
        <h3 className="text-2xl font-semibold text-[var(--ole-green)] mb-4">{title}</h3>
        <p className="text-xl leading-relaxed">{description}</p>
      </motion.div>
    </motion.div>
  );
};

