import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/cards/StatCard";
import { InfoCard } from "@/components/cards/InfoCard";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { useFilters } from "@/contexts/FilterContext";
import { GraduationCap, TrendingDown, Shield } from "lucide-react";

const diagnosisColors: Record<string, string> = {
  "Sense demència": "#22c55e",
  "Molt Lleu": "#facc15",
  "Lleu": "#f97316",
};

const Educacio = () => {
  const { filteredPatients } = useFilters();
  
  const data = useMemo(() => {
    const patientsWithEduc = filteredPatients.filter(p => p.education !== null);
    
    const educationLevels = [
      { label: 'Baix (1-2)', min: 1, max: 2 },
      { label: 'Mitjà (3)', min: 3, max: 3 },
      { label: 'Alt (4-5)', min: 4, max: 5 },
    ];
    
    return educationLevels.map(level => {
      const levelPatients = patientsWithEduc.filter(p => p.education! >= level.min && p.education! <= level.max);
      const total = levelPatients.length || 1;
      
      return {
        education: level.label,
        "Sense demència": Math.round((levelPatients.filter(p => p.diagnosis === 'NonDemented').length / total) * 100),
        "Molt Lleu": Math.round((levelPatients.filter(p => p.diagnosis === 'VeryMildDemented').length / total) * 100),
        "Lleu": Math.round((levelPatients.filter(p => p.diagnosis === 'MildDemented').length / total) * 100),
      };
    });
  }, [filteredPatients]);
  
  const patientsWithEduc = filteredPatients.filter(p => p.education !== null);
  const avgEducation = patientsWithEduc.length > 0 
    ? Math.round(patientsWithEduc.reduce((s, p) => s + p.education!, 0) / patientsWithEduc.length * 10) / 10
    : 0;
  
  const highEdPatients = filteredPatients.filter(p => p.education !== null && p.education >= 4);
  const lowEdPatients = filteredPatients.filter(p => p.education !== null && p.education <= 2);
  
  const highEdDementia = highEdPatients.length > 0
    ? Math.round((highEdPatients.filter(p => p.diagnosis !== 'NonDemented').length / highEdPatients.length) * 100)
    : 0;
  const lowEdDementia = lowEdPatients.length > 0
    ? Math.round((lowEdPatients.filter(p => p.diagnosis !== 'NonDemented').length / lowEdPatients.length) * 100)
    : 0;

  return (
    <PageLayout
      title="L'Educació com a Factor Protector"
      subtitle="Anàlisi del rol del nivell educatiu en el risc de demència"
      icon="🎓"
      gradient="education"
    >
      <div className="flex gap-6">
        <FilterSidebar />
        
        <div className="flex-1">
          {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              value={`${avgEducation} anys`}
              label="Educació mitjana"
              icon={<GraduationCap className="w-5 h-5" />}
              gradient="education"
              delay={0.1}
            />
            <StatCard
              value={`${lowEdDementia}%`}
              label="Demència (Ed. Baixa)"
              icon={<TrendingDown className="w-5 h-5" />}
              gradient="gender"
              delay={0.2}
            />
            <StatCard
              value={`${highEdDementia}%`}
              label="Demència (Ed. Alta)"
              icon={<Shield className="w-5 h-5" />}
              gradient="age"
              delay={0.3}
            />
            <StatCard
              value={`${Math.abs(lowEdDementia - highEdDementia)}%`}
              label="Diferència"
              gradient="primary"
              delay={0.4}
            />
          </section>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display font-semibold text-lg mb-6">Distribució de Diagnòstics per Nivell Educatiu (%)</h3>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="education" tick={{ fontSize: 12 }} />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (!payload?.length) return null;
                        return (
                          <div className="bg-card rounded-lg p-3 shadow-lg border">
                            <p className="font-semibold mb-2">Educació: {label}</p>
                            {payload.map((entry: any) => (
                              <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
                                {entry.name}: {entry.value}%
                              </p>
                            ))}
                          </div>
                        );
                      }}
                    />
                    <Legend />
                    <Bar dataKey="Sense demència" name="Sense demència" stackId="a" fill={diagnosisColors["Sense demència"]} />
                    <Bar dataKey="Molt Lleu" name="Molt Lleu" stackId="a" fill={diagnosisColors["Molt Lleu"]} />
                    <Bar dataKey="Lleu" name="Lleu" stackId="a" fill={diagnosisColors["Lleu"]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Analysis Panel */}
            <div className="space-y-6">
              <InfoCard title="Reserva Cognitiva" icon="🧠" borderColor="border-education" delay={0.3}>
                <p className="text-sm">
                  L'educació pot proporcionar una <strong>"reserva cognitiva"</strong> que ajuda 
                  a compensar els canvis cerebrals associats amb l'Alzheimer.
                </p>
              </InfoCard>

              <InfoCard title="Patrons Observats" icon="📊" borderColor="border-secondary" delay={0.4}>
                <ul className="text-sm space-y-2">
                  <li>• Educació alta: {highEdDementia}% taxa de demència</li>
                  <li>• Educació baixa: {lowEdDementia}% taxa de demència</li>
                  <li>• Diferència de {Math.abs(lowEdDementia - highEdDementia)} punts percentuals</li>
                </ul>
              </InfoCard>

              <InfoCard title="Justificació del Gràfic" icon="📋" borderColor="border-age" delay={0.5}>
                <div className="text-sm space-y-2">
                  <p className="font-medium text-primary">Barres Apilades 100%</p>
                  <p className="text-muted-foreground text-xs">
                    <strong>Expressivitat:</strong> Mostra proporcions relatives en lloc d'absolutes. Cada barra representa un nivell educatiu, amb segments que mostren la distribució de diagnòstics.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    <strong>Efectivitat:</strong> Permet comparar distribucions independentment de la mida del grup, evitant biaixos per diferències en mida mostral.
                  </p>
                </div>
              </InfoCard>

              <InfoCard title="Implicacions" icon="💡" borderColor="border-primary" delay={0.6}>
                <p className="text-sm">
                  Aquests resultats suggereixen que les intervencions educatives poden ser 
                  importants per a la prevenció de la demència.
                </p>
              </InfoCard>

              <InfoCard title="Interactivitat" icon="🖱️" borderColor="border-brain" delay={0.7}>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• <strong>Tooltips:</strong> Percentatges detallats en hover</li>
                  <li>• <strong>Llegenda:</strong> Colors consistents amb altres vistes</li>
                  <li>• <strong>Filtres globals:</strong> Edat i gènere</li>
                </ul>
              </InfoCard>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Educacio;
