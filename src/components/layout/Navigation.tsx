import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Users, GraduationCap, TrendingUp, FileText, Home, Menu, X, BarChart3, BrainCircuit } from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", label: "Inici", icon: Home },
  { path: "/atrofia", label: "Atròfia Cerebral", icon: Brain },
  { path: "/genere", label: "Gènere", icon: Users },
  { path: "/educacio", label: "Educació", icon: GraduationCap },
  { path: "/edat", label: "Edat", icon: TrendingUp },
  { path: "/distribucions", label: "Distribucions", icon: BarChart3 },
  { path: "/deeplearning", label: "DeepLearning", icon: BrainCircuit },
  { path: "/conclusions", label: "Conclusions", icon: FileText },
];

export const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg hidden sm:block">Alzheimer OASIS-1</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 rounded-lg transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 gradient-bg rounded-lg"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <span className={`relative flex items-center gap-2 text-sm font-medium ${
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden py-4 border-t border-border"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive ? "gradient-bg text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </div>
    </nav>
  );
};
