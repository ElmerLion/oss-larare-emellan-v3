import { BookOpen, Users, MessageCircle, Settings } from "lucide-react";
import { Element } from "react-scroll";
import { motion } from "framer-motion";

export function FeatureSection() {
  return (
    <Element name="features">
      <section className="py-20 bg-gradient-to-r from-green-50 via-sage-50 to-green-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-16 text-gray-800"
          >
            Vad kan du göra med <span className="text-green-600">Oss Lärare Emellan</span>?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-white" />}
              title="Dela Resurser"
              description="Dela och upptäck lektionsplaner och resurser"
              bgColor="bg-green-500"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-white" />}
              title="Bygg Nätverk"
              description="Bygg ett professionellt nätverk med lärare över hela Sverige"
              bgColor="bg-blue-500"
            />
            <FeatureCard
              icon={<MessageCircle className="w-8 h-8 text-white" />}
              title="Delta i Diskussioner"
              description="Delta i diskussioner och håll dig uppdaterad om nya undervisningsmetoder"
              bgColor="bg-purple-500"
            />
            <FeatureCard
              icon={<Settings className="w-8 h-8 text-white" />}
              title="Anpassa Innehåll"
              description="Anpassa innehållet till dina ämnen och intressen"
              bgColor="bg-yellow-500"
            />
          </div>
        </div>
      </section>
    </Element>
  );
}

const FeatureCard = ({
  icon,
  title,
  description,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white p-6 rounded-lg shadow-lg text-center transition transform hover:shadow-2xl"
    >
      <div
        className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${bgColor} text-white mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};
