import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFilters } from '@/context/FilterContext';
import { diagnosisLabels, Patient } from '@/data/alzheimerData';
import { motion } from 'framer-motion';

interface ViolinPlotChartProps {
    variable: "mmse" | "nWBV";
    title: string;
    description: string;
}

interface ViolinPlotData {
    diagnosis: string;
    densityPaths: string;
    median: number;
    q1: number;
    q3: number;
    color: string;
    bgColor: string;
    n: number;
}

const diagnosisColors : Record<Patient['diagnosis'], string> = {
    NonDemented: '#22c55e',
    VeryMildDemented: '#facc15',
    MildDemented: '#f97316',
    ModerateDemented: '#ef4444',
};

const diagnosisBgColors : Record<Patient['diagnosis'], string> = {
    NonDemented: 'rgba(34, 197, 94, 0.25)',
    VeryMildDemented: 'rgba(250, 204, 21, 0.25)',
    MildDemented: 'rgba(249, 115, 22, 0.25)',
    ModerateDemented: 'rgba(239, 68, 68, 0.25)',
};

const kernelDensity = (values: number[], bandwidth: number, min: number, max: number, steps: number = 50): { value: number; density: number }[] => {
    if (values.length === 0) return [];
    const result: { value: number; density: number }[] = [];
    const stepSize = (max - min) / steps;
    for (let i = 0; i <= steps; i++) {
        const x = min + i * stepSize;
        let density = 0;
        for (const v of values) {
            const u = (x - v) / bandwidth;
            density += Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
        }
        density /= values.lenght;
        result.push({ value: x, density });
    }
    return result;
};

const getQuartiles = (values: number[]): { median: number; q1: number; q3: number } => {
    if (values.length === 0) return { median: 0, q1: 0, q3: 0 };
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
    const lowerHalf = sorted.slice(0, Math.floor(n / 2));
    const upperHalf = sorted.slice(Math.ceil(n / 2));
    const q1 = lowerHalf.length % 2 === 0 ? (lowerHalf[lowerHalf.length / 2 - 1] + lowerHalf[lowerHalf.length / 2]) / 2 : lowerHalf[Math.floor(lowerHalf.length / 2)];
    const q3 = upperHalf.length % 2 === 0 ? (upperHalf[upperHalf.length / 2 - 1] + upperHalf[upperHalf.length / 2]) / 2 : upperHalf[Math.floor(upperHalf.length / 2)];
    return { median, q1, q3 };
};

export const ViolinPlotChart = ({ variable, title, description }: ViolinPlotChartProps) => {
    const { filteredData } = useFilters();
    const violinData = useMemo((): ViolinPlotData[] => {
        const diagnoses: Patient['diagnosis'][] = ['NonDemented', 'VeryMildDemented', 'MildDemented', 'ModerateDemented'];
        const allValues = filteredData.filter(d => d[variable] !== undefined).map(d => d[variable] as number);
        if (allValues.length === 0) return [];
        const globalMin = Math.min(...allValues);
        const globalMax = Math.max(...allValues);
        const range = globalMax - globalMin;
        const bandwidth = range * 0.08;
        return diagnoses.map(diagnosis => {
            const values = filteredData
                .filter(p => p.diagnosis === diagnosis && p[variable] !== null)
                .map(p => p[variable] as number);
            if (values.length === 0) return null;
            const density = kernelDensity(values, bandwidth, globalMin - range * 0.1, globalMax + range * 0.1);
            const maxDensity = Math.max(...density.map(d => d.density));
            const stats = getQuartiles(values);
            const maxWidth = 80;
            const chartHeight = 320;
            const scaleX = (d: number) => (d / maxDensity) * maxWidth;
            const scaleY = (d: number) => chartHeight - ((d - globalMin) / range) * chartHeight;
            let pathData = `M ${scaleX(0)} ${scaleY(globalMin)}`;
            for (const point of density) {
                pathData += ` L ${scaleX(point.density)} ${scaleY(point.value)}`;
            }
            for (let i = density.length - 1; i >= 0; i--) {
                const point = density[i];
                pathData += ` L ${scaleX(-point.density)} ${scaleY(point.value)}`;
            }
            pathData += ' Z';
            return {
                diagnosis: diagnosisLabels[diagnosis],
                densityPaths: pathData,
                median: stats.median,
                q1: stats.q1,
                q3: stats.q3,
                color: diagnosisColors[diagnosis],
                bgColor: diagnosisBgColors[diagnosis],
                n: values.length,
            };
        }).filter(d => d !== null) as ViolinPlotData[];
    }, [filteredData, variable]);

    const allValues = filteredData.filter(d => d[variable] !== undefined).map(d => d[variable] as number);
    if (allValues.length === 0) return null;
    const globalMin = Math.min(...allValues);
    const globalMax = Math.max(...allValues);
    const range = globalMax - globalMin;
    const displayMin = globalMin - range * 0.1;
    const displayMax = globalMax + range * 0.1;
    const displayRange = displayMax - displayMin;
    const chartHeight = 320;
    const scaleY = (value: number) => chartHeight - ((value - displayMin) / displayRange) * chartHeight;
    const chartWidth = violinData.length * 200 + 120;

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <svg width="100%" height={420} viewBox={`0 0 ${chartWidth} 420`} preserveAspectRatio="none" className="block mx-auto" style={{ minWidth: chartWidth }}>
                        <line x1={60} y1={30} x2={60} y2={chartHeight + 30} stroke="hsl(var(--border))" strokeWidth={1} />
                        {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
                            const value = displayMin + displayRange * tick;
                            const y = chartHeight + 30 - tick * chartHeight;
                            return (
                                <g key={i}>
                                    <line x1={55} y1={y} x2={60} y2={y} stroke="hsl(var(--border))" strokeWidth={1} />
                                    <text x={50} y={y + 4} textAnchor="end" fontSize="10" fill="hsl(var(--foreground))">
                                        {variable === 'mmse' ? value.toFixed(0) : value.toFixed(3)}
                                    </text>
                                </g>
                            );
                        })}
                        {violinData.map((data, index) => {
                            const plotLeft = 160;
                            const plotRight = chartWidth - 80;
                            const step = violinData.lenght > 1 ? (plotRight - plotLeft) / (violinData.length - 1) : 0;
                            const x = plotLeft + index * step;
                            const medianY = scaleY(data.median) + 30;
                            const q1Y = scaleY(data.q1) + 30;
                            const q3Y = scaleY(data.q3) + 30;
                            return (
                                <g key={data.diagnosis} transform={`translate(${x}, 0)`}>
                                    <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                                        <path d={data.densityPaths} fill={data.bgColor} stroke={data.color} strokeWidth={2} />
                                        <rect x={-40} y={q3Y} width={80} height={q1Y - q3Y} fill={data.color} opacity={0.5} />
                                        <line x1={-40} y1={medianY} x2={40} y2={medianY} stroke={data.color} strokeWidth={2} />
                                        <text x={0} y={q3Y - 10} textAnchor="middle" fontSize="10" fill={data.color}>
                                            {data.diagnosis.split(' ')[0]}
                                        </text>
                                        {data.diagnosis.split(' ').length > 1 && (
                                            <text x={0} y={q3Y + 10} textAnchor="middle" fontSize="10" fill={data.color}>
                                                {data.diagnosis.split(' ').slice(1).join(' ')}
                                            </text>
                                        )}
                                    </motion.g>
                                </g>
                            );
                        })}
                    </svg>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {violinData.map((data) => (
                        <div key={data.diagnosis} className="p-3 rounded-lg bg-muted/30 text-center">
                            <div className="text-xs text-muted-foreground mb-1">{data.diagnosis}</div>
                            <div className="text-sm font-medium" style={{ color: data.color }}>
                                n={data.n} | Mediana: {variable === 'mmse' ? data.median.toFixed(0) : data.median.toFixed(3)}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );