import { Element } from "react-scroll";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Element name="testimonials" id="testimonials">
      <section
        ref={ref}
        className="py-20 bg-gradient-to-r from-white to-sage-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-16 text-gray-800"
          >
            Vad säger våra <span className="text-[var(--ole-green)]">användare</span>?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                image: "../lovable-uploads/23886c31-4d07-445c-bf13-eee4b2127d40.png", // Replace with actual image
                name: "Anna Svensson",
                role: "Gymnasielärare",
                review:
                  "Jag sparar flera timmar varje vecka tack vare OLE. Det har verkligen gjort mitt arbete lättare!",
                rating: 5,
              },
              {
                image: "../Images/Danijel.png", // Replace with actual image
                name: "Danjiel Lazarevic",
                role: "Gymnasielärare",
                review: "Att bolla idéer med andra är väldigt utvecklande.",
                rating: 5,
              },
              {
                image: "../lovable-uploads/23886c31-4d07-445c-bf13-eee4b2127d40.png", // Replace with actual image
                name: "Sara Bergström",
                role: "Grundskollärare",
                review:
                  "OLE har förändrat hur jag planerar mina lektioner. Jag älskar att samarbeta med andra lärare!",
                rating: 5,
              },
              {
                image: "../lovable-uploads/e7d324d6-19e4-4218-97a3-91fd2b88597c.png", // Replace with actual image
                name: "Erik Johansson",
                role: "Grundskollärare",
                review:
                  "Fantastisk plattform som gör lärararbete mer effektivt och inspirerande!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <TestimonialCard
                key={index}
                image={testimonial.image}
                name={testimonial.name}
                role={testimonial.role}
                review={testimonial.review}
                rating={testimonial.rating}
                isInView={isInView}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </Element>
  );
}

const TestimonialCard = ({
  image,
  name,
  role,
  review,
  rating,
  isInView,
  index,
}: {
  image: string;
  name: string;
  role: string;
  review: string;
  rating: number;
  isInView: boolean;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
    >
      {/* Profile Picture */}
      <img
        src={image}
        alt={name}
        className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-[var(--ole-green)] object-cover"
      />
      {/* Name and Role */}
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      <p className="text-sm text-gray-500">{role}</p>
      {/* Review */}
      <p className="text-gray-700 mt-4 italic">"{review}"</p>
      {/* Rating */}
      <div className="mt-4">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-yellow-500 text-lg">
            &#9733;
          </span>
        ))}
        {[...Array(5 - rating)].map((_, i) => (
          <span key={i} className="text-gray-300 text-lg">
            &#9733;
          </span>
        ))}
      </div>
    </motion.div>
  );
};
