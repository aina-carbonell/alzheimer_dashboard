import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface QuestionCardProps {
    number: number;
    title: string;
    description: string;
    icon: ReactNode;
    path: string;
    gradient: string;
    delay?: number;
}

export const QuestionCard = ({ number, title, description, icon, path, gradient, delay = 0 }: QuestionCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -8 }}
            className="h-full"
        >
            <Link to={path} className="block h-full">
                <div
                    className={`h-full rounded-2xl p-6 text-white transition-shadow hover:shadow-2xl ${gradient}`}
                    style={{ minHeight: "280px" }}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl">{icon}</span>
                            <span className="text-sm font-medium opacity-80">Pregunta {number}</span>
                        </div>
                        <h3 className="font-display text-xl font-bold mb-3">{title}</h3>
                        <p className="text-sm opacity-90 leading-relaxed flex-grow">{description}</p>
                        <div className="flex items-center gap-2 mt-4 text-sm font-medium">
                            <span>Explorar</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};