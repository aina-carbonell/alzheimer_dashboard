import { motion } from "framer-motion";
import { ReactNode } from "react";

interface InfoCardProps {
    title: string;
    children: ReactNode;
    icon?: ReactNode;
    borderColor?: string;
    delay?: number;
}

export const InfoCard = ({ title, children, icon, borderColor = "border-primary0", delay = 0 }: InfoCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`bg-card rounded-xl p-6 shadow-card border ${borderColor} card-hover`}
        >
            <div className="flex items-center gap-3 mb-4">
                {icon && <span className="text-2xl">{icon}</div>}
                <h3 className="font-display font-semibold text-lg">{title}</h3>
            </div>
            <div className="text-muted-foreground">{children}</div>
        </motion.div>
    );
};