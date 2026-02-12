import { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  LineChart,
  Line
} from "recharts";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/cards/StatCard";
import { InfoCard } from "@/components/cards/InfoCard";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { useFilters } from "@/context/FilterContext";
import { GraduationCap, TrendingDown, Brain, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { diagnosisLabels, diagnosisToNumeric, CONSTANTS } from "@/types/patient";

const Educacio = () => {
  const { filteredPatients } = useFilters();

  const educationLevels = {
    0: "Sense educació",
    1: "Primària incompleta",
    2: "Primària completa",
    3: "Secundària",
    4: "Universitària",
    5: "Postgrau"
  };

  const educationStats = useMemo(() => {
    const withEducation = filteredPatients.filter(p => p.education !== null && p.education !== undefined);
    
    const levels = [0, 1, 2, 3, 4, 5].map(level => {
      const patients = withEducation.filter(p => p.education === level);
      const withMMSE = patients.filter(p => p.mmse !== null);
      
      return {
        level,
        label: educationLevels[level as keyof typeof educationLevels],
        count: patients.length,
        demented: patients.filter(p => p.diagnosis !== 'NonDemented').length,
        dementiaRate: patients.length > 0 
          ? Math.round((patients.filter(p => p.diagnosis !== 'NonDemented').length / patients.length) * 100)
          : 0,
        avgMMSE: withMMSE.length > 0
          ? Math.round((withMMSE.reduce((s, p) => s + p.mmse!, 0) / withMMSE.length) * 10) / 10
          : null,
        avgNWBV: patients.length > 0
          ? Math.round((patients.reduce((s, p) => s + p.nWBV, 0) / patients.length) * 1000) / 1000
          : 0,
        avgAge: patients.length > 0
          ? Math.round(patients.reduce((s, p) => s + p.age, 0) / patients.length)
          : 0
      };
    }).filter(l => l.count > 0);

    const avgEducation = withEducation.reduce((s, p) => s + p.education!, 0) / withEducation.length;
    const highEducation = withEducation.filter(p => p.education! >= 3);
    const lowEducation = withEducation.filter(p => p.education! < 3);

    return {
      levels,
      avgEducation: Math.round(avgEducation * 10) / 10,
      highEdDementiaRate: highEducation.length > 0
        ? Math.round((highEducation.filter(p => p.diagnosis !== 'NonDemented').length / highEducation.length) * 100)
        : 0,
      lowEdDementiaRate: lowEducation.length > 0
        ? Math.round((lowEducation.filter(p => p.diagnosis !== 'NonDemented').length / lowEducation.length) * 100)
        : 0,
      totalWithEducation: withEducation.length
    };
  }, [filteredPatients]);

  const scatterData = useMemo(() => {
    return filteredPatients
      .filter(p => p.education !== null && p.mmse !== null)
      .map(p => ({
        education: p.education,
        mmse: p.mmse,
        nWBV: p.nWBV,
        demented: p.diagnosis !== 'NonDemented' ? 1 : 0
      }));
  }, [filteredPatients]);

  const protectionDiff = educationStats.lowEdDementiaRate - educationStats.highEdDementiaRate;

  return (
    <PageLayout
      title="Educació i Reserva Cognitiva"
      subtitle="Impacte del nivell educatiu en la progressió de l'Alzheimer"
      icon="📚"
      gradient="education"
    >
      <div className="flex gap-6">
        <FilterSidebar />
        
        <div className="flex-1">
          {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              value={educationStats.totalWithEducation}
              label="Pacients amb dades"
              icon={<GraduationCap className="w-5 h-5" />}
              gradient="education"
              delay={0.1}
            />
            <StatCard
              value={educationStats.avgEducation}
              label="Nivell educatiu mitjà"
              icon={<BookOpen className="w-5 h-5" />}
              gradient="primary"
              delay={0.2}
            />
            <StatCard
              value={`${educationStats.highEdDementiaRate}%`}
              label="Demència (Alta ed.)"
              icon={<Brain className="w-5 h-5" />}
              gradient="brain"
              delay={0.3}
            />
            <StatCard
              value={`${protectionDiff}%`}
              label="Efecte protector"
              icon={<TrendingDown className="w-5 h-5" />}
              gradient="age"
              delay={0.4}
            />
          </section>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Charts */}
            <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-card">
              <Tabs defaultValue="dementia">
                <TabsList className="mb-6">
                  <TabsTrigger value="dementia">Taxa Demència</TabsTrigger>
                  <TabsTrigger value="mmse">MMSE per Nivell</TabsTrigger>
                  <TabsTrigger value="scatter">Correlació</TabsTrigger>
                </TabsList>

                <TabsContent value="dementia">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={educationStats.levels} 
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="label" 
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: any) => [`${value}%`, 'Taxa demència']}
                        />
                        <Bar 
                          dataKey="dementiaRate" 
                          fill="#22c55e" 
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </TabsContent>

                <TabsContent value="mmse">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={educationStats.levels.filter(l => l.avgMMSE !== null)} 
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="label" 
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis domain={[20, 30]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="avgMMSE"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>
                </TabsContent>

                <TabsContent value="scatter">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="education" 
                          name="Educació" 
                          domain={[0, 5]}
                          tickFormatter={(v) => educationLevels[v as keyof typeof educationLevels]?.split(' ')[0] || v}
                        />
                        <YAxis dataKey="mmse" name="MMSE" domain={[15, 30]} />
                        <ZAxis dataKey="demented" range={[50, 200]} />
                        <Tooltip
                          cursor={{ strokeDasharray: '3 3' }}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Scatter 
                          name="Pacients" 
                          data={scatterData} 
                          fill="#8b5cf6"
                          fillOpacity={0.6}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Analysis Panel */}
            <div className="space-y-6">
              <InfoCard title="Hipòtesi de Reserva Cognitiva" icon="🧠" borderColor="border-education" delay={0.3}>
                <div className="text-sm space-y-2">
                  <p>
                    La <strong>reserva cognitiva</strong> suggereix que major educació 
                    i estimulació intel·lectual creen més connexions neuronals.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Això podria permetre al cervell compensar millor els danys 
                    causats per l'Alzheimer, retardant l'aparició de símptomes.
                  </p>
                </div>
              </InfoCard>

              <InfoCard title="Dades Clau" icon="📊" borderColor="border-primary" delay={0.4}>
                <ul className="text-sm space-y-2">
                  <li>• Diferència de {protectionDiff}% entre alta i baixa educació</li>
                  <li>• MMSE més alt en grups amb més educació</li>
                  <li>• Correlació positiva educació-cognició</li>
                </ul>
              </InfoCard>

              <InfoCard title="Limitacions" icon="⚠️" borderColor="border-destructive" delay={0.5}>
                <p className="text-sm">
                  Cal considerar que:
                </p>
                <ul className="text-xs mt-2 space-y-1 text-muted-foreground">
                  <li>• Correlació no implica causalitat</li>
                  <li>• Factors socioeconòmics associats</li>
                  <li>• Variabilitat en qualitat educativa</li>
                  <li>• Possible biaix de supervivència</li>
                </ul>
              </InfoCard>

              <InfoCard title="Justificació del Gràfic" icon="📋" borderColor="border-secondary" delay={0.6}>
                <div className="text-sm space-y-2">
                  <p className="font-medium text-primary">Barres + Scatter</p>
                  <p className="text-muted-foreground text-xs">
                    <strong>Barres:</strong> Comparar taxes entre nivells educatius discrets.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    <strong>Scatter:</strong> Visualitzar correlació entre variables contínues.
                  </p>
                </div>
              </InfoCard>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Educacio;