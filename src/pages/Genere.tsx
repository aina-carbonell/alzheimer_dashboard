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
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/cards/StatCard";
import { InfoCard } from "@/components/cards/InfoCard";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { useFilters } from "@/context/FilterContext";
import { Users, TrendingUp, Activity, Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { diagnosisLabels, diagnosisToNumeric, CONSTANTS } from "@/types/patient";

const COLORS = {
  female: '#ec4899',
  male: '#3b82f6'
};

const Genere = () => {
  const { filteredPatients } = useFilters();

  const genderStats = useMemo(() => {
    const females = filteredPatients.filter(p => p.gender === 'F');
    const males = filteredPatients.filter(p => p.gender === 'M');

    const calcStats = (patients: typeof filteredPatients) => {
      const withMMSE = patients.filter(p => p.mmse !== null);
      return {
        total: patients.length,
        demented: patients.filter(p => p.diagnosis !== 'NonDemented').length,
        avgAge: patients.reduce((s, p) => s + p.age, 0) / patients.length,
        avgMMSE: withMMSE.length ? withMMSE.reduce((s, p) => s + p.mmse!, 0) / withMMSE.length : 0,
        avgNWBV: patients.reduce((s, p) => s + p.nWBV, 0) / patients.length,
        avgEducation: patients.filter(p => p.education).reduce((s, p) => s + (p.education || 0), 0) / patients.filter(p => p.education).length
      };
    };

    const femaleStats = calcStats(females);
    const maleStats = calcStats(males);

    return {
      female: {
        ...femaleStats,
        dementiaRate: Math.round((femaleStats.demented / femaleStats.total) * 100)
      },
      male: {
        ...maleStats,
        dementiaRate: Math.round((maleStats.demented / maleStats.total) * 100)
      }
    };
  }, [filteredPatients]);

  const comparisonData = useMemo(() => [
    {
      metric: 'Edat mitjana',
      Dones: Math.round(genderStats.female.avgAge),
      Homes: Math.round(genderStats.male.avgAge)
    },
    {
      metric: 'MMSE mitjà',
      Dones: Math.round(genderStats.female.avgMMSE * 10) / 10,
      Homes: Math.round(genderStats.male.avgMMSE * 10) / 10
    },
    {
      metric: 'nWBV mitjà',
      Dones: Math.round(genderStats.female.avgNWBV * 1000) / 1000,
      Homes: Math.round(genderStats.male.avgNWBV * 1000) / 1000
    },
    {
      metric: 'Taxa demència (%)',
      Dones: genderStats.female.dementiaRate,
      Homes: genderStats.male.dementiaRate
    }
  ], [genderStats]);

  const distributionData = [
    { name: 'Dones', value: genderStats.female.total, color: COLORS.female },
    { name: 'Homes', value: genderStats.male.total, color: COLORS.male }
  ];

  const radarData = [
    {
      metric: 'Edat',
      Dones: (genderStats.female.avgAge / 100) * 100,
      Homes: (genderStats.male.avgAge / 100) * 100,
    },
    {
      metric: 'MMSE',
      Dones: (genderStats.female.avgMMSE / 30) * 100,
      Homes: (genderStats.male.avgMMSE / 30) * 100,
    },
    {
      metric: 'Vol. Cerebral',
      Dones: (genderStats.female.avgNWBV / 1) * 100,
      Homes: (genderStats.male.avgNWBV / 1) * 100,
    },
    {
      metric: 'Demència',
      Dones: genderStats.female.dementiaRate,
      Homes: genderStats.male.dementiaRate,
    }
  ];

  return (
    <PageLayout
      title="Diferències per Gènere"
      subtitle="Anàlisi comparativa entre homes i dones amb Alzheimer"
      icon="⚧️"
      gradient="gender"
    >
      <div className="flex gap-6">
        <FilterSidebar />
        
        <div className="flex-1">
          {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              value={genderStats.female.total}
              label="Dones"
              icon={<Users className="w-5 h-5" />}
              gradient="gender"
              delay={0.1}
            />
            <StatCard
              value={genderStats.male.total}
              label="Homes"
              icon={<Users className="w-5 h-5" />}
              gradient="primary"
              delay={0.2}
            />
            <StatCard
              value={`${genderStats.female.dementiaRate}%`}
              label="Demència (Dones)"
              icon={<Brain className="w-5 h-5" />}
              gradient="brain"
              delay={0.3}
            />
            <StatCard
              value={`${genderStats.male.dementiaRate}%`}
              label="Demència (Homes)"
              icon={<Activity className="w-5 h-5" />}
              gradient="education"
              delay={0.4}
            />
          </section>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Charts */}
            <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-card">
              <Tabs defaultValue="comparison">
                <TabsList className="mb-6">
                  <TabsTrigger value="comparison">Comparació</TabsTrigger>
                  <TabsTrigger value="distribution">Distribució</TabsTrigger>
                  <TabsTrigger value="radar">Radar</TabsTrigger>
                </TabsList>

                <TabsContent value="comparison">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="metric" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="Dones" fill={COLORS.female} radius={[8, 8, 0, 0]} />
                        <Bar dataKey="Homes" fill={COLORS.male} radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </TabsContent>

                <TabsContent value="distribution">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                </TabsContent>

                <TabsContent value="radar">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar name="Dones" dataKey="Dones" stroke={COLORS.female} fill={COLORS.female} fillOpacity={0.6} />
                        <Radar name="Homes" dataKey="Homes" stroke={COLORS.male} fill={COLORS.male} fillOpacity={0.6} />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Analysis Panel */}
            <div className="space-y-6">
              <InfoCard title="Observacions Clau" icon="🔍" borderColor="border-gender" delay={0.3}>
                <ul className="text-sm space-y-2">
                  <li>• Les dones representen la majoria dels casos (~{Math.round((genderStats.female.total / filteredPatients.length) * 100)}%)</li>
                  <li>• Diferència en taxa de demència: {Math.abs(genderStats.female.dementiaRate - genderStats.male.dementiaRate)}%</li>
                  <li>• Edat mitjana similar entre gèneres</li>
                </ul>
              </InfoCard>

              <InfoCard title="Hipòtesi Explicativa" icon="💡" borderColor="border-primary" delay={0.4}>
                <p className="text-sm">
                  La major prevalença en dones pot estar relacionada amb:
                </p>
                <ul className="text-xs mt-2 space-y-1 text-muted-foreground">
                  <li>• Major longevitat femenina</li>
                  <li>• Factors hormonals (estrògens)</li>
                  <li>• Diferències en reserva cognitiva</li>
                  <li>• Variabilitat en diagnòstic</li>
                </ul>
              </InfoCard>

              <InfoCard title="Justificació del Gràfic" icon="📋" borderColor="border-secondary" delay={0.5}>
                <div className="text-sm space-y-2">
                  <p className="font-medium text-primary">Gràfic de Barres</p>
                  <p className="text-muted-foreground text-xs">
                    <strong>Expressivitat:</strong> Compara múltiples mètriques entre dos grups.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    <strong>Efectivitat:</strong> Excel·lent per comparacions directes i identificar diferències.
                  </p>
                </div>
              </InfoCard>

              <InfoCard title="Interactivitat" icon="🖱️" borderColor="border-education" delay={0.6}>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• <strong>Tabs:</strong> Canvi entre vistes comparatives</li>
                  <li>• <strong>Tooltips:</strong> Valors exactes per gènere</li>
                  <li>• <strong>Pie Chart:</strong> Proporció visual</li>
                  <li>• <strong>Radar:</strong> Comparació multidimensional</li>
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
