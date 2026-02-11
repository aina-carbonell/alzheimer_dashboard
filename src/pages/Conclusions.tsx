import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, Brain, Users, GraduationCap, TrendingUp, ArrowRight, Lightbulb, BarChart3, ScatterChart, LineChart, Target, MousePointer2, Palette, Layout } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { InfoCard } from "@/components/cards/InfoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const findings = [
  {
    number: 1,
    title: "Atròfia Cerebral vs Deteriorament Cognitiu",
    icon: "🧬",
    finding: "Correlació positiva significativa (r ≈ 0.42). Major volum cerebral → millors puntuacions cognitives.",
    implication: "El nWBV és un bon biomarcador per a la monitorització clínica i investigació.",
    chartUsed: "Scatter plot",
    chartJustification: "Ideal per visualitzar correlacions entre dues variables quantitatives, permetent identificar patrons i valors atípics.",
    path: "/atrofia",
    color: "border-brain",
  },
  {
    number: 2,
    title: "Diferències per Gènere",
    icon: "⚧",
    finding: "S'observen diferències en la prevalença de demència entre homes i dones.",
    implication: "Important per a estudis epidemiològics i estratègies de prevenció específiques.",
    chartUsed: "Barres agrupades",
    chartJustification: "Permet comparar directament el nombre de casos per diagnòstic, separant clarament per gènere.",
    path: "/genere",
    color: "border-gender-female",
  },
  {
    number: 3,
    title: "Rol de l'Educació",
    icon: "🎓",
    finding: "L'educació superior s'associa amb menor taxa de demència.",
    implication: "Suporta la teoria de la 'reserva cognitiva' i la importància de l'educació com a factor protector.",
    chartUsed: "Barres apilades 100%",
    chartJustification: "Mostra proporcions relatives independentment de la mida del grup, revelant patrons en la distribució de diagnòstics.",
    path: "/educacio",
    color: "border-education",
  },
  {
    number: 4,
    title: "Evolució amb l'Edat",
    icon: "📈",
    finding: "La taxa de demència augmenta exponencialment amb l'edat.",
    implication: "L'edat és el principal factor de risc no modificable per a l'Alzheimer.",
    chartUsed: "Gràfic de línia/àrea",
    chartJustification: "Excel·lent per visualitzar tendències al llarg d'un interval continu com l'edat.",
    path: "/edat",
    color: "border-age",
  },
];

const designPrinciples = [
  {
    title: "Consistència Visual",
    icon: <Palette className="w-5 h-5" />,
    points: [
      "Colors consistents per a categories de diagnòstic a totes les visualitzacions",
      "Tipografia jeràrquica amb font display per títols i system fonts per text",
      "Sistema de tokens CSS per temes coherents (HSL)"
    ],
  },
  {
    title: "Composició i Layout",
    icon: <Layout className="w-5 h-5" />,
    points: [
      "Estructura de pàgina consistent amb navegació, header i contingut",
      "Ús de graelles responsives per adaptar-se a diferents dispositius",
      "Espai blanc adequat per millorar la llegibilitat"
    ],
  },
  {
    title: "Suport a la Comprensió",
    icon: <Target className="w-5 h-5" />,
    points: [
      "Títols descriptius i subtítols que contextualitzen cada visualització",
      "Llegendes clares integrades en els gràfics",
      "Panels d'interpretació al costat de cada gràfic"
    ],
  },
];

const interactionSummary = [
  {
    technique: "Filtres globals",
    description: "Rang d'edat, gènere i diagnòstic aplicables a totes les visualitzacions",
    benefit: "Permet explorar subconjunts específics de dades",
  },
  {
    technique: "Tooltips informatius",
    description: "Informació detallada en hover sobre cada element del gràfic",
    benefit: "Detall a demanda sense sobrecarregar la vista principal",
  },
  {
    technique: "Tabs de navegació",
    description: "Canvi entre diferents variables o vistes dins de cada pàgina",
    benefit: "Organitza múltiples visualitzacions relacionades",
  },
  {
    technique: "Animacions de transició",
    description: "Fade-in progressiu i transicions suaus en canviar dades",
    benefit: "Guia l'atenció i millora la percepció de canvis",
  },
  {
    technique: "Selector de color",
    description: "Canvi de codificació de color en scatter plots (diagnòstic, gènere)",
    benefit: "Múltiples perspectives sobre les mateixes dades",
  },
];

const Conclusions = () => {
  return (
    <PageLayout
      title="Conclusions i Resum"
      subtitle="Síntesi de descobriments, metodologia i aprenentatges del projecte de visualització"
      icon="📋"
      gradient="conclusion"
    >
      {/* Main Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white mb-12 shadow-primary"
      >
        <h2 className="font-display text-2xl font-bold mb-4 text-center">
          🧠 Projecte de Visualització de Dades: Alzheimer OASIS-1
        </h2>
        <p className="text-center opacity-90 max-w-3xl mx-auto mb-6">
          Desenvolupament de visualitzacions interactives per explorar i comprendre 
          els patrons en dades d'Alzheimer, responent 4 preguntes clau de recerca
          mitjançant codificacions visuals apropiades i tècniques d'interacció efectives.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Badge className="bg-white/20 text-white border-white/30">192 Pacients</Badge>
          <Badge className="bg-white/20 text-white border-white/30">4 Preguntes</Badge>
          <Badge className="bg-white/20 text-white border-white/30">6 Tipus de Gràfic</Badge>
          <Badge className="bg-white/20 text-white border-white/30">Filtres Globals</Badge>
        </div>
      </motion.div>

      <Tabs defaultValue="findings" className="mb-12">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="findings">Troballes</TabsTrigger>
          <TabsTrigger value="methodology">Metodologia</TabsTrigger>
          <TabsTrigger value="design">Disseny</TabsTrigger>
        </TabsList>

        {/* Findings Tab */}
        <TabsContent value="findings">
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h2 className="font-display text-xl font-bold gradient-text mb-2">
                Resum de Troballes per Pregunta
              </h2>
              <p className="text-sm text-muted-foreground">
                Cada pregunta d'investigació amb la seva troballa principal i justificació metodològica
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {findings.map((finding, i) => (
                <motion.div
                  key={finding.number}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`glass-card h-full border-l-4 ${finding.color}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{finding.icon}</span>
                        <div>
                          <Badge variant="outline" className="mb-1">Pregunta {finding.number}</Badge>
                          <CardTitle className="text-base font-display">{finding.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Troballa</p>
                          <p className="text-sm text-muted-foreground">{finding.finding}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Implicació</p>
                          <p className="text-sm text-muted-foreground">{finding.implication}</p>
                        </div>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs font-semibold text-primary mb-1">📊 {finding.chartUsed}</p>
                        <p className="text-xs text-muted-foreground">{finding.chartJustification}</p>
                      </div>
                      
                      <Link
                        to={finding.path}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        Veure anàlisi completa <ArrowRight className="w-4 h-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Methodology Tab */}
        <TabsContent value="methodology">
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h2 className="font-display text-xl font-bold gradient-text mb-2">
                Codificacions Visuals i Interacció
              </h2>
              <p className="text-sm text-muted-foreground">
                Justificació de les decisions de disseny basades en principis d'expressivitat i efectivitat
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Chart Types */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Tipus de Gràfics Utilitzats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <ScatterChart className="w-5 h-5 text-brain flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Scatter Plot</p>
                      <p className="text-xs text-muted-foreground">
                        Per correlacions nWBV-MMSE. Cada punt = 1 pacient. 
                        Font: From Data to Viz.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-gender-female flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Barres Agrupades</p>
                      <p className="text-xs text-muted-foreground">
                        Per comparar dues categories (gènere × diagnòstic). 
                        Comparació directa de magnituds.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-education flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Barres Apilades 100%</p>
                      <p className="text-xs text-muted-foreground">
                        Per proporcions relatives per nivell educatiu. 
                        Evita biaixos per mida de grup.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <LineChart className="w-5 h-5 text-age flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Línia/Àrea</p>
                      <p className="text-xs text-muted-foreground">
                        Per tendències amb l'edat. L'àrea emfatitza 
                        l'acumulació de risc.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interaction Techniques */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MousePointer2 className="w-5 h-5 text-secondary" />
                    Tècniques d'Interacció
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {interactionSummary.map((item, i) => (
                      <div key={i} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">{item.technique}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{item.description}</p>
                        <p className="text-xs text-primary">→ {item.benefit}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Design Tab */}
        <TabsContent value="design">
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h2 className="font-display text-xl font-bold gradient-text mb-2">
                Qualitat i Consistència del Disseny
              </h2>
              <p className="text-sm text-muted-foreground">
                Principis aplicats per garantir una composició coherent i una presentació professional
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {designPrinciples.map((principle, i) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass-card h-full">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="text-primary">{principle.icon}</span>
                        {principle.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {principle.points.map((point, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Color System */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Paleta de Colors per Diagnòstic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#22c55e]"></div>
                    <div>
                      <p className="text-sm font-medium">Sense demència</p>
                      <p className="text-xs text-muted-foreground">#22c55e</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#facc15]"></div>
                    <div>
                      <p className="text-sm font-medium">Molt Lleu</p>
                      <p className="text-xs text-muted-foreground">#facc15</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#f97316]"></div>
                    <div>
                      <p className="text-sm font-medium">Lleu</p>
                      <p className="text-xs text-muted-foreground">#f97316</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#ef4444]"></div>
                    <div>
                      <p className="text-sm font-medium">Moderada</p>
                      <p className="text-xs text-muted-foreground">#ef4444</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Final Impact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-2xl p-8 shadow-card text-center"
      >
        <h2 className="font-display text-xl font-bold mb-4">🎯 Impacte del Projecte</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Aquest projecte demostra com les visualitzacions interactives poden fer 
          més accessibles les dades clíniques complexes, ajudant tant a investigadors 
          com al públic general a comprendre millor l'Alzheimer i els seus factors de risc.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm">
            <Brain className="w-4 h-4 text-primary" />
            <span>Investigadors</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span>Clínics</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span>Estudiants</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Públic General</span>
          </div>
        </div>

        <div className="border-t pt-6">
          <p className="text-xs text-muted-foreground">
            Projecte desenvolupat amb React, TypeScript, Recharts i Tailwind CSS. 
            Dades: OASIS Cross-sectional MRI Data in Young, Middle Aged, Nondemented and Demented Older Adults.
          </p>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default Conclusions;
