import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFilters } from "@/contexts/FilterContext";
import { diagnosisLabels, Patient } from "@/data/alzheimerData";
import { motion } from "framer-motion";

interface BoxPlotChartProps {
  variable: "mmse" | "nWBV";
  title: string;
  description: string;
}

interface BoxPlotData {
  diagnosis: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
  color: string;
  bgColor: string;
  diagnosisKey: Patient['diagnosis'];
}

const getQuartiles = (values: number[]): { min: number; q1: number; median: number; q3: number; max: number; outliers: number[] } => {
  if (values.length === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [] };
  
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  
  const median = n % 2 === 0 
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
    : sorted[Math.floor(n / 2)];
  
  const lowerHalf = sorted.slice(0, Math.floor(n / 2));
  const upperHalf = sorted.slice(Math.ceil(n / 2));
  
  const q1 = lowerHalf.length % 2 === 0
    ? (lowerHalf[lowerHalf.length / 2 - 1] + lowerHalf[lowerHalf.length / 2]) / 2
    : lowerHalf[Math.floor(lowerHalf.length / 2)];
  
  const q3 = upperHalf.length % 2 === 0
    ? (upperHalf[upperHalf.length / 2 - 1] + upperHalf[upperHalf.length / 2]) / 2
    : upperHalf[Math.floor(upperHalf.length / 2)];
  
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  const outliers = sorted.filter(v => v < lowerBound || v > upperBound);
  const nonOutliers = sorted.filter(v => v >= lowerBound && v <= upperBound);
  
  return {
    min: nonOutliers.length > 0 ? Math.min(...nonOutliers) : sorted[0],
    q1,
    median,
    q3,
    max: nonOutliers.length > 0 ? Math.max(...nonOutliers) : sorted[sorted.length - 1],
    outliers,
  };
};

const diagnosisColors: Record<Patient['diagnosis'], string> = {
  NonDemented: '#22c55e',
  VeryMildDemented: '#facc15',
  MildDemented: '#f97316',
  ModerateDemented: '#ef4444',
};

const diagnosisBgColors: Record<Patient['diagnosis'], string> = {
  NonDemented: 'rgba(34, 197, 94, 0.2)',
  VeryMildDemented: 'rgba(250, 204, 21, 0.2)',
  MildDemented: 'rgba(249, 115, 22, 0.2)',
  ModerateDemented: 'rgba(239, 68, 68, 0.2)',
};

export const BoxPlotChart = ({ variable, title, description }: BoxPlotChartProps) => {
  const { filteredPatients } = useFilters();

  const boxPlotData = useMemo((): BoxPlotData[] => {
    const diagnoses: Patient['diagnosis'][] = ['NonDemented', 'VeryMildDemented', 'MildDemented'];
    
    return diagnoses.map(diagnosis => {
      const values = filteredPatients
        .filter(p => p.diagnosis === diagnosis && p[variable] !== null)
        .map(p => p[variable] as number);
      
      const stats = getQuartiles(values);
      
      return {
        diagnosis: diagnosisLabels[diagnosis],
        ...stats,
        color: diagnosisColors[diagnosis],
        bgColor: diagnosisBgColors[diagnosis],
        diagnosisKey: diagnosis,
      };
    }).filter(d => d.max > 0);
  }, [filteredPatients, variable]);

  const allValues = filteredPatients
    .filter(p => p[variable] !== null)
    .map(p => p[variable] as number);
  
  const globalMin = Math.min(...allValues) * 0.95;
  const globalMax = Math.max(...allValues) * 1.05;
  const range = globalMax - globalMin;

  const scaleY = (value: number) => {
    return ((value - globalMin) / range) * 200;
  };

  const boxWidth = 60;
  const chartWidth = boxPlotData.length * 120 + 80;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <svg width={chartWidth} height={280} className="mx-auto">
            {/* Y-axis */}
            <line x1={50} y1={20} x2={50} y2={230} stroke="hsl(var(--border))" strokeWidth={1} />
            
            {/* Y-axis ticks and labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
              const value = globalMin + range * tick;
              const y = 230 - tick * 200;
              return (
                <g key={i}>
                  <line x1={45} y1={y} x2={50} y2={y} stroke="hsl(var(--border))" strokeWidth={1} />
                  <text x={40} y={y + 4} textAnchor="end" fontSize={10} fill="hsl(var(--muted-foreground))">
                    {variable === 'mmse' ? value.toFixed(0) : value.toFixed(3)}
                  </text>
                </g>
              );
            })}

            {/* Box plots */}
            {boxPlotData.map((data, index) => {
              const x = 100 + index * 120;
              const minY = 230 - scaleY(data.min);
              const q1Y = 230 - scaleY(data.q1);
              const medianY = 230 - scaleY(data.median);
              const q3Y = 230 - scaleY(data.q3);
              const maxY = 230 - scaleY(data.max);

              return (
                <motion.g
                  key={data.diagnosis}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Whiskers */}
                  <line x1={x} y1={minY} x2={x} y2={q1Y} stroke={data.color} strokeWidth={2} />
                  <line x1={x} y1={q3Y} x2={x} y2={maxY} stroke={data.color} strokeWidth={2} />
                  
                  {/* Whisker caps */}
                  <line x1={x - 15} y1={minY} x2={x + 15} y2={minY} stroke={data.color} strokeWidth={2} />
                  <line x1={x - 15} y1={maxY} x2={x + 15} y2={maxY} stroke={data.color} strokeWidth={2} />
                  
                  {/* Box */}
                  <rect
                    x={x - boxWidth / 2}
                    y={q3Y}
                    width={boxWidth}
                    height={q1Y - q3Y}
                    fill={data.bgColor}
                    stroke={data.color}
                    strokeWidth={2.5}
                    rx={4}
                  />
                  
                  {/* Median line */}
                  <line
                    x1={x - boxWidth / 2}
                    y1={medianY}
                    x2={x + boxWidth / 2}
                    y2={medianY}
                    stroke={data.color}
                    strokeWidth={3}
                  />

                  {/* Outliers */}
                  {data.outliers.map((outlier, i) => (
                    <circle
                      key={i}
                      cx={x}
                      cy={230 - scaleY(outlier)}
                      r={4}
                      fill="transparent"
                      stroke={data.color}
                      strokeWidth={2}
                    />
                  ))}

                  {/* Label */}
                  <text
                    x={x}
                    y={255}
                    textAnchor="middle"
                    fontSize={11}
                    fill="hsl(var(--foreground))"
                    fontWeight={500}
                  >
                    {data.diagnosis.split(' ')[0]}
                  </text>
                  {data.diagnosis.split(' ').length > 1 && (
                    <text
                      x={x}
                      y={268}
                      textAnchor="middle"
                      fontSize={11}
                      fill="hsl(var(--foreground))"
                      fontWeight={500}
                    >
                      {data.diagnosis.split(' ').slice(1).join(' ')}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </svg>
        </div>

        {/* Legend with stats */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {boxPlotData.map((data) => (
            <div
              key={data.diagnosis}
              className="p-3 rounded-lg bg-muted/30 text-center"
            >
              <div className="text-xs text-muted-foreground mb-1">{data.diagnosis}</div>
              <div className="text-sm font-medium" style={{ color: data.color }}>
                Mediana: {variable === 'mmse' ? data.median.toFixed(1) : data.median.toFixed(3)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
