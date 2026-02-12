import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface MethodologyCardProps {
  chartType: string;
  chartIcon: string;
  dataType: string;
  expressiveness: string[];
  effectiveness: string[];
  source?: string;
  delay?: number;
}

export const MethodologyCard = ({
  chartType,
  chartIcon,
  dataType,
  expressiveness,
  effectiveness,
  source = "From Data to Viz",
  delay = 0,
}: MethodologyCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="glass-card border-l-4 border-l-primary h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{chartIcon}</span>
              <CardTitle className="text-base font-display">{chartType}</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              {dataType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-primary mb-2">Expressivitat</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Representa correctament la naturalesa de les dades:
            </p>
            <ul className="space-y-1">
              {expressiveness.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <Check className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-secondary mb-2">Efectivitat</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Facilita la comprensió i comparació:
            </p>
            <ul className="space-y-1">
              {effectiveness.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <Check className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground italic">
              Font: {source}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
