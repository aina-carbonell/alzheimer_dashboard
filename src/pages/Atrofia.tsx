import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/cards/StatCard";
import { InfoCard } from "@/components/cards/InfoCard";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { useFilters } from "@/context/FilterContext";
import { diagnosisLabels, diagnosisToNumeric, CONSTANTS } from "@/types/patient";
import { Brain, TrendingUp, Activity } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const diagnosisColors: Record<string, string> = {
  "Sense demència": "#22c55e",
  "Demència Molt Lleu": "#facc15",
  "Demència Lleu": "#f97316",
  "Demència Moderada": "#ef4444",
};

const Atrofia = () => {
  const [colorBy, setColorBy] = useState<"diagnosis" | "age" | "gender">("diagnosis");
  const { filteredPatients } = useFilters();

  const scatterData = useMemo(() => {
    return filteredPatients
      .filter(p => p.mmse !== null)
      .map(p => ({
        nWBV: p.nWBV,
        mmse: p.mmse!,
        age: p.age,
        gender: p.gender,
        diagnosis: diagnosisLabels[p.diagnosis],
      }));
  }, [filteredPatients]);

  // Calculate correlation only for patients with MMSE
  const patientsWithMMSE = filteredPatients.filter(p => p.mmse !== null);
  const n = patientsWithMMSE.length;
  
  const stats = useMemo(() => {
    if (n === 0) return { correlation: 0, avgNWBV: 0, avgMMSE: 0 };
    
    const sumX = patientsWithMMSE.reduce((s, p) => s + p.nWBV, 0);
    const sumY = patientsWithMMSE.reduce((s, p) => s + p.mmse!, 0);
    const sumXY = patientsWithMMSE.reduce((s, p) => s + p.nWBV * p.mmse!, 0);
    const sumX2 = patientsWithMMSE.reduce((s, p) => s + p.nWBV ** 2, 0);
    const sumY2 = patientsWithMMSE.reduce((s, p) => s + p.mmse! ** 2, 0);
    const correlation = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));

    return {
      correlation: isNaN(correlation) ? 0 : correlation,
      avgNWBV: Math.round((sumX / n) * 1000) / 1000,
      avgMMSE: Math.round((sumY / n) * 10) / 10,
    };
  }, [patientsWithMMSE, n]);

  const renderScatter = () => {
    if (colorBy === "diagnosis") {
      return Object.entries(diagnosisColors).map(([diagnosis, color]) => (
        <Scatter
          key={diagnosis}
          name={diagnosis}
          data={scatterData.filter(d => d.diagnosis === diagnosis)}
          fill={color}
        />
      ));
    }
    
    if (colorBy === "gender") {
      return ["M", "F"].map((gender) => (
        <Scatter
          key={gender}
          name={gender === "M" ? "Home" : "Dona"}
          data={scatterData.filter(d => d.gender === gender)}
          fill={gender === "M" ? "#3b82f6" : "#ec4899"}
        />
      ));
    }

    return <Scatter name="Pacients" data={scatterData} fill="#8b5cf6" />;
  };

  return (
    <PageLayout
      title="Atròfia Cerebral vs Deteriorament Cognitiu"
      subtitle="Anàlisi de la relació entre volum cerebral normalitzat (nWBV) i puntuació MMSE"
      icon="🧬"
      gradient="brain"
    >
      <div className="flex gap-6">
        <FilterSidebar />
        
        <div className="flex-1">
          {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              value={stats.correlation.toFixed(2)}
              label="Correlació (r)"
              icon={<TrendingUp className="w-5 h-5" />}
              gradient="brain"
              delay={0.1}
            />
            <StatCard
              value={stats.avgNWBV}
              label="nWBV mitjà"
              icon={<Brain className="w-5 h-5" />}
              gradient="primary"
              delay={0.2}
            />
            <StatCard
              value={stats.avgMMSE}
              label="MMSE mitjà"
              icon={<Activity className="w-5 h-5" />}
              gradient="education"
              delay={0.3}
            />
            <StatCard
              value={n}
              label="Observacions"
              gradient="age"
              delay={0.4}
            />
          </section>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="font-display font-semibold text-lg">Gràfic de Dispersió</h3>
                <Select value={colorBy} onValueChange={(v) => setColorBy(v as typeof colorBy)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Color per..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diagnosis">Per Diagnòstic</SelectItem>
                    <SelectItem value="gender">Per Gènere</SelectItem>
                    <SelectItem value="age">Tots</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      type="number"
                      dataKey="nWBV"
                      name="nWBV"
                      domain={[0.55, 0.85]}
                      label={{ value: "Volum Cerebral Normalitzat (nWBV)", position: "bottom", offset: 40 }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="mmse"
                      name="MMSE"
                      domain={[10, 32]}
                      label={{ value: "MMSE", angle: -90, position: "insideLeft" }}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={({ payload }) => {
                        if (!payload?.length) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="bg-card rounded-lg p-3 shadow-lg border">
                            <p className="font-semibold">{data.diagnosis}</p>
                            <p className="text-sm text-muted-foreground">nWBV: {data.nWBV}</p>
                            <p className="text-sm text-muted-foreground">MMSE: {data.mmse}</p>
                            <p className="text-sm text-muted-foreground">Edat: {data.age} anys</p>
                          </div>
                        );
                      }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <ReferenceLine x={stats.avgNWBV} stroke="#94a3b8" strokeDasharray="5 5" />
                    <ReferenceLine y={stats.avgMMSE} stroke="#94a3b8" strokeDasharray="5 5" />
                    {renderScatter()}
                  </ScatterChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Analysis Panel */}
            <div className="space-y-6">
              <InfoCard title="Interpretació" icon="📊" borderColor="border-brain" delay={0.3}>
                <p className="text-sm">
                  La correlació de <strong>r = {stats.correlation.toFixed(2)}</strong> indica una relació 
                  {stats.correlation > 0.3 ? " positiva moderada" : stats.correlation > 0.1 ? " positiva feble" : " mínima"} 
                  entre el volum cerebral i la funció cognitiva.
                </p>
              </InfoCard>

              <InfoCard title="Conclusió Clínica" icon="🧠" borderColor="border-secondary" delay={0.4}>
                <ul className="text-sm space-y-2">
                  <li>• Major volum cerebral → millors puntuacions MMSE</li>
                  <li>• El nWBV és un potencial biomarcador de progressió</li>
                  <li>• Útil per a la monitorització clínica</li>
                </ul>
              </InfoCard>

              <InfoCard title="Justificació del Gràfic" icon="📋" borderColor="border-age" delay={0.5}>
                <div className="text-sm space-y-2">
                  <p className="font-medium text-primary">Scatter Plot (Gràfic de dispersió)</p>
                  <p className="text-muted-foreground text-xs">
                    <strong>Expressivitat:</strong> Cada punt representa un pacient individual, amb posició que reflecteix valors reals de nWBV (X) i MMSE (Y).
                  </p>
                  <p className="text-muted-foreground text-xs">
                    <strong>Efectivitat:</strong> Permet identificar patrons, tendències i outliers de manera immediata. Recomanat per From Data to Viz per correlacions entre variables quantitatives.
                  </p>
                </div>
              </InfoCard>

              <InfoCard title="Interactivitat" icon="🖱️" borderColor="border-education" delay={0.6}>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• <strong>Tooltips:</strong> Detall de cada pacient en hover</li>
                  <li>• <strong>Color per categoria:</strong> Selector de diagnòstic/gènere</li>
                  <li>• <strong>Línies de referència:</strong> Mitjanes de nWBV i MMSE</li>
                  <li>• <strong>Filtres globals:</strong> Edat, gènere i diagnòstic</li>
                </ul>
              </InfoCard>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Atrofia;
