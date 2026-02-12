import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  gradient?: "primary" | "brain" | "gender" | "education" | "age";
  delay?: number;
}

const gradientStyles = {
  primary: "from-primary to-secondary",
  brain: "from-brain to-secondary",
  gender: "from-gender-female to-destructive",
  education: "from-education to-cyan-400",
  age: "from-age to-teal-400",
};

export const StatCard = ({ value, label, icon, gradient = "primary", delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`bg-gradient-to-br ${gradientStyles[gradient]} rounded-xl p-6 text-white shadow-primary`}
    >
      <div className="flex items-center justify-between mb-2">
        {icon && <span className="text-2xl opacity-80">{icon}</span>}
      </div>
      <div className="text-3xl md:text-4xl font-bold font-display mb-1">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </motion.div>
  );
};
