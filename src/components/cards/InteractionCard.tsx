import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface InteractionCardProps {
    title: string;
    icon: ReactNode;
    description: string;
    techniques: { name: string; description: string }[];
    delay?: number;
}

export const InteractionCard = ({ 
    title, 
    icon, 
    description, 
    techniques, 
    delay = 0 
}: InteractionCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay }}
        >
            <Card className="glass-card h-full">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                            {icon}
                        </div>
                        <CardTitle className="text-base font-display">{title}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                    {techniques.map((tech, i) => (
                        <div 
                            key={i} 
                            className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                            <Badge variant="secondary" className="text-xs mb-2">
                                {tech.name}
                            </Badge>
                            <p className="text-xs text-muted-foreground">{tech.description}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    );
};