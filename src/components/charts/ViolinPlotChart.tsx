import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFilters } from "@/contexts/FilterContext";
import { diagnosisLabels, Patient } from "@/data/alzheimerData";
import { motion } from "framer-motion";

interface ViolinPlotChartProps {
  variable: "mmse" | "nWBV";
  title: string;
  description: string;
}

interface ViolinData {
  diagnosis: string;
  densityPath: string;
  median: number;
  q1: number;
  q3: number;
  color: string;
  bgColor: string;
  n: number;
}

const diagnosisColors: Record<Patient['diagnosis'], string> = {
  NonDemented: '#22c55e',
  VeryMildDemented: '#facc15',
  MildDemented: '#f97316',
  ModerateDemented: '#ef4444',
};

const diagnosisBgColors: Record<Patient['diagnosis'], string> = {
  NonDemented: 'rgba(34, 197, 94, 0.25)',
  VeryMildDemented: 'rgba(250, 204, 21, 0.25)',
  MildDemented: 'rgba(249, 115, 22, 0.25)',
  ModerateDemented: 'rgba(239, 68, 68, 0.25)',
};

// Gaussian kernel density estimation
const kernelDensity = (values: number[], bandwidth: number, min: number, max: number, steps: number = 50): { value: number; density: number }[] => {
  if (values.length === 0) return [];
  
  const result: { value: number; density: number }[] = [];
  const stepSize = (max - min) / steps;
  
  for (let i = 0; i <= steps; i++) {
    const x = min + i * stepSize;
    let density = 0;
    
    for (const v of values) {
      const z = (x - v) / bandwidth;
      density += Math.exp(-0.5 * z * z) / (bandwidth * Math.sqrt(2 * Math.PI));
    }
    density /= values.length;
    
    result.push({ value: x, density });
  }
  
  return result;
};

const getQuartiles = (values: number[]): { median: number; q1: number; q3: number } => {
  if (values.length === 0) return { median: 0, q1: 0, q3: 0 };
  
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
  
  return { median, q1, q3 };
};

export const ViolinPlotChart = ({ variable, title, description }: ViolinPlotChartProps) => {
  const { filteredPatients } = useFilters();

  const violinData = useMemo((): ViolinData[] => {
    const diagnoses: Patient['diagnosis'][] = ['NonDemented', 'VeryMildDemented', 'MildDemented'];
    
    const allValues = filteredPatients
      .filter(p => p[variable] !== null)
      .map(p => p[variable] as number);
    
    if (allValues.length === 0) return [];
    
    const globalMin = Math.min(...allValues);
    const globalMax = Math.max(...allValues);
    const range = globalMax - globalMin;
    const bandwidth = range * 0.08;
    
    return diagnoses.map(diagnosis => {
      const values = filteredPatients
        .filter(p => p.diagnosis === diagnosis && p[variable] !== null)
        .map(p => p[variable] as number);
      
      if (values.length === 0) return null;
      
      const density = kernelDensity(values, bandwidth, globalMin - range * 0.1, globalMax + range * 0.1);
      const maxDensity = Math.max(...density.map(d => d.density));
      
      const stats = getQuartiles(values);
      
      // Create violin path (mirrored density)
      const maxWidth = 80;
      const chartHeight = 320;
      const scaleX = (d: number) => (d / maxDensity) * maxWidth;
      const scaleY = (v: number) => ((v - (globalMin - range * 0.1)) / (range * 1.2)) * chartHeight;
      
      // Build path - right side first (top to bottom), then left side (bottom to top)
      let pathData = `M 0,${chartHeight + 30 - scaleY(density[0].value)}`;
      
      // Right side (top to bottom)
      for (const point of density) {
        pathData += ` L ${scaleX(point.density)},${chartHeight + 30 - scaleY(point.value)}`;
      }
      
      // Left side (bottom to top)
      for (let i = density.length - 1; i >= 0; i--) {
        pathData += ` L ${-scaleX(density[i].density)},${chartHeight + 30 - scaleY(density[i].value)}`;
      }
      
      pathData += ' Z';
      
      return {
        diagnosis: diagnosisLabels[diagnosis],
        densityPath: pathData,
        median: stats.median,
        q1: stats.q1,
        q3: stats.q3,
        color: diagnosisColors[diagnosis],
        bgColor: diagnosisBgColors[diagnosis],
        n: values.length,
      };
    }).filter(Boolean) as ViolinData[];
  }, [filteredPatients, variable]);

  const allValues = filteredPatients
    .filter(p => p[variable] !== null)
    .map(p => p[variable] as number);
  
  if (allValues.length === 0) return null;
  
  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);
  const range = globalMax - globalMin;
  const displayMin = globalMin - range * 0.1;
  const displayMax = globalMax + range * 0.1;
  const displayRange = displayMax - displayMin;

  const chartHeight = 320;
  const scaleY = (value: number) => ((value - displayMin) / displayRange) * chartHeight;

  const chartWidth = violinData.length * 200 + 120;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <svg
            width="100%"
            height={420}
            viewBox={`0 0 ${chartWidth} 420`}
            preserveAspectRatio="none"
            className="block mx-auto"
            style={{ minWidth: chartWidth }}
          >
            {/* Y-axis */}
            <line x1={60} y1={30} x2={60} y2={chartHeight + 30} stroke="hsl(var(--border))" strokeWidth={1} />
            
            {/* Y-axis ticks and labels */}
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((tick, i) => {
              const value = displayMin + displayRange * tick;
              const y = chartHeight + 30 - tick * chartHeight;
              return (
                <g key={i}>
                  <line x1={55} y1={y} x2={60} y2={y} stroke="hsl(var(--border))" strokeWidth={1} />
                  <text x={50} y={y + 4} textAnchor="end" fontSize={11} fill="hsl(var(--muted-foreground))">
                    {variable === 'mmse' ? value.toFixed(0) : value.toFixed(3)}
                  </text>
                </g>
              );
            })}

            {/* Violin plots */}
            {violinData.map((data, index) => {
              const plotLeft = 160;
              const plotRight = chartWidth - 80;
              const step =
                violinData.length > 1 ? (plotRight - plotLeft) / (violinData.length - 1) : 0;
              const x = plotLeft + index * step;

              const medianY = chartHeight + 30 - scaleY(data.median);
              const q1Y = chartHeight + 30 - scaleY(data.q1);
              const q3Y = chartHeight + 30 - scaleY(data.q3);

              return (
                <g key={data.diagnosis} transform={`translate(${x}, 0)`}>
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.15, duration: 0.4 }}
                  >
                    {/* Violin shape */}
                    <path
                      d={data.densityPath}
                      fill={data.bgColor}
                      stroke={data.color}
                      strokeWidth={2.5}
                    />

                    {/* IQR Box */}
                    <rect
                      x={-12}
                      y={q3Y}
                      width={24}
                      height={Math.max(q1Y - q3Y, 2)}
                      fill={data.color}
                      rx={4}
                    />

                    {/* Median line */}
                    <line
                      x1={-16}
                      y1={medianY}
                      x2={16}
                      y2={medianY}
                      stroke="white"
                      strokeWidth={3}
                    />

                    {/* Label */}
                    <text
                      x={0}
                      y={chartHeight + 55}
                      textAnchor="middle"
                      fontSize={12}
                      fill="hsl(var(--foreground))"
                      fontWeight={500}
                    >
                      {data.diagnosis.split(' ')[0]}
                    </text>
                    {data.diagnosis.split(' ').length > 1 && (
                      <text
                        x={0}
                        y={chartHeight + 70}
                        textAnchor="middle"
                        fontSize={12}
                        fill="hsl(var(--foreground))"
                        fontWeight={500}
                      >
                        {data.diagnosis.split(' ').slice(1).join(' ')}
                      </text>
                    )}
                  </motion.g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend with stats */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {violinData.map((data) => (
            <div
              key={data.diagnosis}
              className="p-3 rounded-lg bg-muted/30 text-center"
            >
              <div className="text-xs text-muted-foreground mb-1">{data.diagnosis}</div>
              <div className="text-sm font-medium" style={{ color: data.color }}>
                n={data.n} | Med: {variable === 'mmse' ? data.median.toFixed(1) : data.median.toFixed(3)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
