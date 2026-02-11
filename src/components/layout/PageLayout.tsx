import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Navigation } from "./Navigation";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  gradient?: "primary" | "brain" | "gender" | "education" | "age" | "conclusion";
}

const gradientClasses = {
  primary: "from-primary to-secondary",
  brain: "from-brain to-secondary",
  gender: "from-gender-female to-destructive",
  education: "from-education to-cyan-400",
  age: "from-age to-teal-400",
  conclusion: "from-pink-400 to-yellow-400",
};

export const PageLayout = ({ children, title, subtitle, icon, gradient = "primary" }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <header className="text-center mb-12">
            {icon && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientClasses[gradient]} mb-4`}
              >
                <span className="text-3xl text-white">{icon}</span>
              </motion.div>
            )}
            <h1 className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r ${gradientClasses[gradient]} bg-clip-text text-transparent`}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </header>
          
          {children}
        </motion.div>
      </main>
    </div>
  );
};