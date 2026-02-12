import { useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/cards/StatCard";
import { InfoCard } from "@/components/cards/InfoCard";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { useFilters } from "@/context/FilterContext";
import { TrendingUp, Activity, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { diagnosisLabels, diagnosisToNumeric, CONSTANTS } from "@/types/patient";

const Edat = () => {
  const { filteredPatients } = useFilters();
  
  const data = useMemo(() => {
    const ageGroups = [
      { label: '18-39', min: 18, max: 39 },
      { label: '40-59', min: 40, max: 59 },
      { label: '60-69', min: 60, max: 69 },
      { label: '70-79', min: 70, max: 79 },
      { label: '80+', min: 80, max: 100 },
    ];
    
    return ageGroups.map(group => {
      const groupPatients = filteredPatients.filter(p => p.age >= group.min && p.age <= group.max);
      const withMMSE = groupPatients.filter(p => p.mmse !== null);
      const avgMMSE = withMMSE.length > 0 
        ? withMMSE.reduce((sum, p) => sum + p.mmse!, 0) / withMMSE.length 
        : null;
      const avgNWBV = groupPatients.length > 0
        ? groupPatients.reduce((sum, p) => sum + p.nWBV, 0) / groupPatients.length
        : 0;
      const dementiaRate = groupPatients.length > 0
        ? (groupPatients.filter(p => p.diagnosis !== 'NonDemented').length / groupPatients.length) * 100
        : 0;
      
      return {
        ageGroup: group.label,
        mmse: avgMMSE ? Math.round(avgMMSE * 10) / 10 : null,
        nWBV: Math.round(avgNWBV * 1000) / 1000,
        dementiaRate: Math.round(dementiaRate),
        count: groupPatients.length,
      };
    });
  }, [filteredPatients]);
  
  const youngPatients = filteredPatients.filter(p => p.age < 60);
  const oldPatients = filteredPatients.filter(p => p.age >= 80);
  
  const youngDementia = youngPatients.length > 0
    ? Math.round((youngPatients.filter(p => p.diagnosis !== 'NonDemented').length / youngPatients.length) * 100)
    : 0;
  const oldDementia = oldPatients.length > 0
    ? Math.round((oldPatients.filter(p => p.diagnosis !== 'NonDemented').length / oldPatients.length) * 100)
    : 0;
  
  const dementedPatients = filteredPatients.filter(p => p.diagnosis !== 'NonDemented');
  const avgAgeDemented = dementedPatients.length > 0 
    ? Math.round(dementedPatients.reduce((s, p) => s + p.age, 0) / dementedPatients.length)
    : 0;

  return (
    <PageLayout
      title="Evolució de l'Alzheimer amb l'Edat"
      subtitle="Anàlisi de la progressió de la malaltia al llarg del cicle vital"
      icon="📈"
      gradient="age"
    >
      <div className="flex gap-6">
        <FilterSidebar />
        
        <div className="flex-1">
          {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              value={`${youngDementia}%`}
              label="Demència (<60 anys)"
              icon={<Calendar className="w-5 h-5" />}
              gradient="age"
              delay={0.1}
            />
            <StatCard
              value={`${oldDementia}%`}
              label="Demència (80+ anys)"
              icon={<TrendingUp className="w-5 h-5" />}
              gradient="gender"
              delay={0.2}
            />
            <StatCard
              value={`${avgAgeDemented} anys`}
              label="Edat mitjana (demència)"
              icon={<Activity className="w-5 h-5" />}
              gradient="primary"
              delay={0.3}
            />
            <StatCard
              value={`${oldDementia - youngDementia}%`}
              label="Increment de risc"
              gradient="brain"
              delay={0.4}
            />
          </section>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Charts */}
            <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-card">
              <Tabs defaultValue="dementia">
                <TabsList className="mb-6">
                  <TabsTrigger value="dementia">Taxa Demència</TabsTrigger>
                  <TabsTrigger value="mmse">MMSE Mitjà</TabsTrigger>
                  <TabsTrigger value="nwbv">Volum Cerebral</TabsTrigger>
                </TabsList>

                <TabsContent value="dementia">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <defs>
                          <linearGradient id="colorDementia" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="ageGroup" />
                        <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                        <Tooltip
                          content={({ payload, label }) => {
                            if (!payload?.length) return null;
                            return (
                              <div className="bg-card rounded-lg p-3 shadow-lg border">
                                <p className="font-semibold">Edat: {label}</p>
                                <p className="text-sm text-muted-foreground">
                                  Taxa demència: {payload[0].value}%
                                </p>
                              </div>
                            );
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="dementiaRate"
                          stroke="#ef4444"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorDementia)"
                        />
                      </AreaChart>
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
                      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="ageGroup" />
                        <YAxis domain={[15, 30]} />
                        <Tooltip
                          content={({ payload, label }) => {
                            if (!payload?.length) return null;
                            return (
                              <div className="bg-card rounded-lg p-3 shadow-lg border">
                                <p className="font-semibold">Edat: {label}</p>
                                <p className="text-sm text-muted-foreground">
                                  MMSE mitjà: {payload[0].value}
                                </p>
                              </div>
                            );
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="mmse"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>
                </TabsContent>

                <TabsContent value="nwbv">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="ageGroup" />
                        <YAxis domain={[0.65, 0.8]} />
                        <Tooltip
                          content={({ payload, label }) => {
                            if (!payload?.length) return null;
                            return (
                              <div className="bg-card rounded-lg p-3 shadow-lg border">
                                <p className="font-semibold">Edat: {label}</p>
                                <p className="text-sm text-muted-foreground">
                                  nWBV mitjà: {payload[0].value}
                                </p>
                              </div>
                            );
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="nWBV"
                          stroke="#22c55e"
                          strokeWidth={3}
                          dot={{ fill: "#22c55e", strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Analysis Panel */}
            <div className="space-y-6">
              <InfoCard title="Tendències Clau" icon="📈" borderColor="border-age" delay={0.3}>
                <ul className="text-sm space-y-2">
                  <li>• La taxa de demència augmenta exponencialment amb l'edat</li>
                  <li>• Les puntuacions MMSE disminueixen progressivament</li>
                  <li>• El volum cerebral es redueix amb l'envelliment</li>
                </ul>
              </InfoCard>

              <InfoCard title="Factor Risc Principal" icon="⚠️" borderColor="border-destructive" delay={0.4}>
                <p className="text-sm">
                  L'<strong>edat</strong> és el factor de risc més important per a l'Alzheimer. 
                  La probabilitat de demència es duplica cada 5 anys després dels 65.
                </p>
              </InfoCard>

              <InfoCard title="Justificació del Gràfic" icon="📋" borderColor="border-secondary" delay={0.5}>
                <div className="text-sm space-y-2">
                  <p className="font-medium text-primary">Gràfic de Línia/Àrea</p>
                  <p className="text-muted-foreground text-xs">
                    <strong>Expressivitat:</strong> L'eix X representa l'edat com interval continu. L'eix Y mostra la variable d'interès. L'àrea emfatitza l'acumulació de risc.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    <strong>Efectivitat:</strong> Excel·lent per visualitzar tendències al llarg d'un interval continu, identificar punts d'inflexió i comparar trajectòries.
                  </p>
                </div>
              </InfoCard>

              <InfoCard title="Interactivitat" icon="🖱️" borderColor="border-education" delay={0.6}>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• <strong>Tabs:</strong> Canvi entre taxa demència, MMSE i nWBV</li>
                  <li>• <strong>Tooltips:</strong> Valors exactes per grup d'edat</li>
                  <li>• <strong>Dots actius:</strong> Punts destacats en hover</li>
                  <li>• <strong>Filtres globals:</strong> Gènere i diagnòstic</li>
                </ul>
              </InfoCard>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Edat;
