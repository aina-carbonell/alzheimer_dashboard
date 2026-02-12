import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/cards/StatCard";
import { InfoCard } from "@/components/cards/InfoCard";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { useFilters } from "@/contexts/FilterContext";
import { diagnosisLabels, Patient } from "@/data/alzheimerData";
import { Users } from "lucide-react";

const Genere = () => {
  const { filteredPatients } = useFilters();
  
  const data = useMemo(() => {
    const diagnoses: Patient['diagnosis'][] = ['NonDemented', 'VeryMildDemented', 'MildDemented'];
    
    return diagnoses.map(diagnosis => {
      const male = filteredPatients.filter(p => p.diagnosis === diagnosis && p.gender === 'M').length;
      const female = filteredPatients.filter(p => p.diagnosis === diagnosis && p.gender === 'F').length;
      return { 
        diagnosis: diagnosisLabels[diagnosis], 
        male, 
        female 
      };
    });
  }, [filteredPatients]);
  
  const maleCount = filteredPatients.filter(p => p.gender === 'M').length;
  const femaleCount = filteredPatients.filter(p => p.gender === 'F').length;
  const maleDementia = filteredPatients.filter(p => p.gender === 'M' && p.diagnosis !== 'NonDemented').length;
  const femaleDementia = filteredPatients.filter(p => p.gender === 'F' && p.diagnosis !== 'NonDemented').length;
  const maleDementiaRate = maleCount > 0 ? Math.round((maleDementia / maleCount) * 100) : 0;
  const femaleDementiaRate = femaleCount > 0 ? Math.round((femaleDementia / femaleCount) * 100) : 0;

  return (
    <PageLayout
      title="Diferències per Gènere"
      subtitle="Comparació de la prevalença dels diagnòstics entre homes i dones"
      icon="⚧"
      gradient="gender"
    >
      <div className="flex gap-6">
        <FilterSidebar />
        
        <div className="flex-1">
          {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              value={maleCount}
              label="Homes"
              icon={<Users className="w-5 h-5" />}
              gradient="brain"
              delay={0.1}
            />
            <StatCard
              value={femaleCount}
              label="Dones"
              icon={<Users className="w-5 h-5" />}
              gradient="gender"
              delay={0.2}
            />
            <StatCard
              value={`${maleDementiaRate}%`}
              label="Demència (Homes)"
              gradient="primary"
              delay={0.3}
            />
            <StatCard
              value={`${femaleDementiaRate}%`}
              label="Demència (Dones)"
              gradient="age"
              delay={0.4}
            />
          </section>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display font-semibold text-lg mb-6">Diagnòstics per Gènere</h3>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="diagnosis"
                      tick={{ fontSize: 11 }}
                      angle={-25}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis label={{ value: "Nombre de pacients", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (!payload?.length) return null;
                        return (
                          <div className="bg-card rounded-lg p-3 shadow-lg border">
                            <p className="font-semibold mb-2">{label}</p>
                            {payload.map((entry: any) => (
                              <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
                                {entry.name}: {entry.value} pacients
                              </p>
                            ))}
                          </div>
                        );
                      }}
                    />
                    <Legend />
                    <Bar dataKey="male" name="Homes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="female" name="Dones" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Analysis Panel */}
            <div className="space-y-6">
              <InfoCard title="Comparativa" icon="📊" borderColor="border-gender-female" delay={0.3}>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <div>
                      <p className="font-medium">Homes</p>
                      <p className="text-muted-foreground">{maleDementia} amb demència ({maleDementiaRate}%)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-pink-50 dark:bg-pink-950/30">
                    <div className="w-3 h-3 rounded-full bg-pink-500" />
                    <div>
                      <p className="font-medium">Dones</p>
                      <p className="text-muted-foreground">{femaleDementia} amb demència ({femaleDementiaRate}%)</p>
                    </div>
                  </div>
                </div>
              </InfoCard>

              <InfoCard title="Observacions Clau" icon="🔍" borderColor="border-secondary" delay={0.4}>
                <ul className="text-sm space-y-2">
                  <li>• Les dones tenen {femaleDementiaRate > maleDementiaRate ? "major" : "menor"} taxa de demència</li>
                  <li>• Diferències poden indicar factors biològics o de longevitat</li>
                  <li>• Important per a estudis epidemiològics</li>
                </ul>
              </InfoCard>

              <InfoCard title="Justificació del Gràfic" icon="📋" borderColor="border-education" delay={0.5}>
                <div className="text-sm space-y-2">
                  <p className="font-medium text-primary">Barres Agrupades</p>
                  <p className="text-muted-foreground text-xs">
                    <strong>Expressivitat:</strong> L'altura de cada barra és proporcional al nombre de pacients. L'agrupació per gènere dins de cada diagnòstic permet comparació directa.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    <strong>Efectivitat:</strong> Facilita la lectura intuïtiva de magnituds absolutes i la identificació de patrons de diferència entre gèneres.
                  </p>
                </div>
              </InfoCard>

              <InfoCard title="Interactivitat" icon="🖱️" borderColor="border-age" delay={0.6}>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• <strong>Tooltips:</strong> Detall del nombre de pacients en hover</li>
                  <li>• <strong>Llegenda:</strong> Identificació clara de colors per gènere</li>
                  <li>• <strong>Filtres globals:</strong> Rang d'edat i diagnòstic</li>
                </ul>
              </InfoCard>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Genere;
