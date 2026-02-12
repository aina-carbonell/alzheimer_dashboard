import { PageLayout } from "@/components/layout/PageLayout";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { BoxPlotChart } from "@/components/charts/BoxPlotChart";
import { ViolinPlotChart } from "@/components/charts/ViolinPlotChart";
import { BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFilters } from "@/context/FilterContext";
import { diagnosisLabels, diagnosisToNumeric, CONSTANTS } from "@/types/patient";

const Distribucions = () => {
  const { filteredPatients } = useFilters();

  return (
    <PageLayout
      title="Distribucions per Diagnòstic"
      subtitle="Comparació de les distribucions de MMSE i volum cerebral (nWBV) entre grups de diagnòstic mitjançant box plots i violin plots"
      icon={<BarChart3 className="w-8 h-8" />}
      gradient="brain"
    >
      <div className="flex gap-6">
        <FilterSidebar />
        
        <div className="flex-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="text-base">Justificació dels Gràfics</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <div>
                  <p className="font-medium text-primary mb-1">Box Plot</p>
                  <p className="text-xs">
                    <strong>Expressivitat:</strong> Mostra la distribució estadística amb quartils (Q1, mediana, Q3), 
                    bigotis que representen 1.5×IQR, i outliers com a cercles individuals.
                  </p>
                  <p className="text-xs">
                    <strong>Efectivitat:</strong> Permet comparar ràpidament la centralitat i dispersió entre grups de diagnòstic.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-secondary mb-1">Violin Plot</p>
                  <p className="text-xs">
                    <strong>Expressivitat:</strong> Combina un box plot amb una estimació de densitat de nucli (KDE), 
                    mostrant la forma completa de la distribució de les dades.
                  </p>
                  <p className="text-xs">
                    <strong>Efectivitat:</strong> Revela patrons bimodals o asimetries que un box plot no mostraria.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Tabs defaultValue="mmse" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mmse">MMSE (Puntuació Cognitiva)</TabsTrigger>
              <TabsTrigger value="nwbv">nWBV (Volum Cerebral)</TabsTrigger>
            </TabsList>

            <TabsContent value="mmse" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <BoxPlotChart
                  variable="mmse"
                  title="Box Plot - Distribució MMSE per Diagnòstic"
                  description="Comparació de les puntuacions MMSE (Mini-Mental State Examination) entre grups de diagnòstic"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ViolinPlotChart
                  variable="mmse"
                  title="Violin Plot - Densitat MMSE per Diagnòstic"
                  description="Visualització de la distribució completa de les puntuacions MMSE amb estimació de densitat"
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="nwbv" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <BoxPlotChart
                  variable="nWBV"
                  title="Box Plot - Distribució nWBV per Diagnòstic"
                  description="Comparació del volum cerebral normalitzat entre grups de diagnòstic"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ViolinPlotChart
                  variable="nWBV"
                  title="Violin Plot - Densitat nWBV per Diagnòstic"
                  description="Visualització de la distribució completa del volum cerebral amb estimació de densitat"
                />
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Summary stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Estadístiques del Filtre Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold text-primary">{filteredPatients.length}</div>
                    <div className="text-xs text-muted-foreground">Pacients</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold text-chart-1">
                      {filteredPatients.filter(p => p.diagnosis === 'NonDemented').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Sense demència</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold text-chart-2">
                      {filteredPatients.filter(p => p.diagnosis === 'VeryMildDemented').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Molt Lleu</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold text-chart-3">
                      {filteredPatients.filter(p => p.diagnosis === 'MildDemented').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Lleu</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Distribucions;
