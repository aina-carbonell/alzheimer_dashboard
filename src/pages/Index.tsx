import { motion } from "framer-motion";
import { Brain, Users, GraduationCap, TrendingUp, Database, Activity, FileSpreadsheet, MousePointer2, Sliders, Eye, Target, BarChart3, ScatterChart, LineChart } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/cards/StatCard";
import { QuestionCard } from "@/components/cards/QuestionCard";
import { InfoCard } from "@/components/cards/InfoCard";
import { MethodologyCard } from "@/components/cards/MethodologyCard";
import { InteractionCard } from "@/components/cards/InteractionCard";
import { patients, datasetInfo } from "@/data/alzheimerData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const questions = [
  {
    number: 1,
    title: "Atròfia Cerebral vs Deteriorament Cognitiu",
    description: "Anàlisi de la correlació entre la disminució del volum cerebral i les puntuacions cognitives.",
    objective: "Demostrar visualment la correlació entre la disminució del volum cerebral i les puntuacions cognitives més baixes, per ajudar els especialistes a identificar marcadors de progressió de la malaltia.",
    relationship: "Distribució i Correlació entre dues variables quantitatives (volum cerebral i puntuació cognitiva)",
    chartType: "Gràfic de dispersió (Scatter plot)",
    icon: "🧬",
    path: "/atrofia",
    gradient: "bg-gradient-to-br from-brain to-secondary",
  },
  {
    number: 2,
    title: "Diferències per Gènere",
    description: "Comparació de la prevalença dels diagnòstics entre homes i dones.",
    objective: "Presentar una comparació clara de la prevalença dels diagnòstics entre homes i dones, per informar tant els investigadors com el públic general sobre possibles disparitats de gènere.",
    relationship: "Comparació de categories (diagnòstic) a través d'un altre grup categòric (gènere)",
    chartType: "Gràfic de barres agrupades",
    icon: "⚧",
    path: "/genere",
    gradient: "bg-gradient-to-br from-gender-female to-destructive",
  },
  {
    number: 3,
    title: "Rol de l'Educació",
    description: "Exploració de la relació entre el nivell educatiu i el diagnòstic.",
    objective: "Explorar si existeix una relació entre el nivell educatiu i el diagnòstic, per tal d'oferir als investigadors una via per analitzar possibles factors protectors.",
    relationship: "Comparació de la distribució d'una categoria (diagnòstic) a través d'una variable ordinal (nivell educatiu)",
    chartType: "Gràfic de barres apilades al 100%",
    icon: "🎓",
    path: "/educacio",
    gradient: "bg-gradient-to-br from-education to-cyan-400",
  },
  {
    number: 4,
    title: "Evolució amb l'Edat",
    description: "Il·lustració de la progressió de la malaltia en funció de l'edat.",
    objective: "Il·lustrar la progressió de la malaltia en funció de l'edat, proporcionant a estudiants i públic una comprensió més clara de la cronologia de l'Alzheimer.",
    relationship: "Tendència d'una variable quantitativa (puntuació cognitiva) al llarg d'una altra variable quantitativa contínua (edat)",
    chartType: "Gràfic de línies / àrea amb tendència",
    icon: "📈",
    path: "/edat",
    gradient: "bg-gradient-to-br from-age to-teal-400",
  },
];

const methodologies = [
  {
    chartType: "Gràfic de Dispersió",
    chartIcon: "📊",
    dataType: "2 vars. quantitatives",
    expressiveness: [
      "Cada punt representa un pacient individual",
      "Posició en X/Y mostra valors reals de nWBV i MMSE",
      "Color codifica categoria de diagnòstic"
    ],
    effectiveness: [
      "Identifica patrons, tendències i valors atípics immediatament",
      "Permet calcular i visualitzar correlacions",
      "Facilita comparació entre grups de diagnòstic"
    ]
  },
  {
    chartType: "Barres Agrupades",
    chartIcon: "📈",
    dataType: "2 vars. categòriques",
    expressiveness: [
      "Altura de barra proporcional al recompte",
      "Agrupació per gènere dins de cada diagnòstic",
      "Color diferencia homes i dones"
    ],
    effectiveness: [
      "Comparació directa entre grups adjacents",
      "Lectura intuïtiva de magnituds absolutes",
      "Patrons de diferència fàcilment identificables"
    ]
  },
  {
    chartType: "Barres Apilades 100%",
    chartIcon: "📉",
    dataType: "Ordinal + Categòrica",
    expressiveness: [
      "Proporcions relatives, no absolutes",
      "Cada barra representa un nivell educatiu",
      "Segments mostren distribució de diagnòstics"
    ],
    effectiveness: [
      "Compara distribucions independentment de la mida del grup",
      "Identifica tendències en proporcions",
      "Evita biaixos per diferències en mida mostral"
    ]
  },
  {
    chartType: "Gràfic de Línia/Àrea",
    chartIcon: "📈",
    dataType: "Tendència temporal",
    expressiveness: [
      "L'eix X representa l'edat com interval continu",
      "L'eix Y mostra la variable d'interès",
      "L'àrea emfatitza l'acumulació de risc"
    ],
    effectiveness: [
      "Visualitza tendències al llarg del temps/edat",
      "Identifica punts d'inflexió i patrons",
      "Facilita comparació de trajectòries"
    ]
  }
];

const interactionTechniques = [
  {
    title: "Filtres Globals",
    icon: <Sliders className="w-5 h-5 text-primary" />,
    description: "Permeten explorar subconjunts específics de dades",
    techniques: [
      { name: "Rang d'edat", description: "Slider dual per seleccionar intervals d'edat específics" },
      { name: "Gènere", description: "Checkboxes per incloure/excloure grups de gènere" },
      { name: "Diagnòstic", description: "Selecció múltiple de categories diagnòstiques" }
    ]
  },
  {
    title: "Interacció Directa",
    icon: <MousePointer2 className="w-5 h-5 text-secondary" />,
    description: "Feedback immediat en interactuar amb les visualitzacions",
    techniques: [
      { name: "Tooltips", description: "Informació detallada en hover sobre cada element" },
      { name: "Highlight", description: "Èmfasi visual en elements seleccionats" },
      { name: "Llegenda interactiva", description: "Clic per filtrar categories específiques" }
    ]
  },
  {
    title: "Animacions",
    icon: <Eye className="w-5 h-5 text-age" />,
    description: "Transicions suaus que guien l'atenció",
    techniques: [
      { name: "Fade-in progressiu", description: "Elements apareixen seqüencialment per facilitar la lectura" },
      { name: "Transicions de dades", description: "Canvis animats en aplicar filtres" },
      { name: "Hover effects", description: "Feedback visual immediat en interacció" }
    ]
  }
];

const Index = () => {
  const totalPatients = patients.length;
  const avgAge = Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length);
  const dementiaRate = Math.round((patients.filter(p => p.diagnosis !== 'NonDemented').length / patients.length) * 100);
  const patientsWithMMSE = patients.filter(p => p.mmse !== null);
  const avgMMSE = patientsWithMMSE.length > 0 
    ? Math.round(patientsWithMMSE.reduce((sum, p) => sum + p.mmse!, 0) / patientsWithMMSE.length * 10) / 10
    : 0;

  return (
    <PageLayout
      title="Anàlisi Alzheimer OASIS-1"
      subtitle="Visualització interactiva de dades clíniques i neuroimatge per a la investigació de l'Alzheimer"
      icon={<Brain className="w-8 h-8" />}
    >
      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard value={totalPatients} label="Pacients" icon={<Users className="w-5 h-5" />} delay={0.1} />
        <StatCard value={`${avgAge} anys`} label="Edat mitjana" icon={<Activity className="w-5 h-5" />} gradient="brain" delay={0.2} />
        <StatCard value={`${dementiaRate}%`} label="Taxa demència" icon={<Brain className="w-5 h-5" />} gradient="gender" delay={0.3} />
        <StatCard value={avgMMSE} label="MMSE mitjà" icon={<FileSpreadsheet className="w-5 h-5" />} gradient="age" delay={0.4} />
      </section>

      {/* Dataset Info */}
      <section className="grid md:grid-cols-2 gap-6 mb-12">
        <InfoCard title="Sobre el Dataset" icon={<Database className="w-5 h-5 text-primary" />} delay={0.2}>
          <p className="mb-3"><strong>{datasetInfo.fullName}</strong></p>
          <p className="mb-3">{datasetInfo.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline">{totalPatients} pacients</Badge>
            <Badge variant="outline">Neuroimatge MRI</Badge>
            <Badge variant="outline">Dades clíniques</Badge>
          </div>
        </InfoCard>
        
        <InfoCard title="Variables Principals" icon={<FileSpreadsheet className="w-5 h-5 text-primary" />} borderColor="border-secondary" delay={0.3}>
          <ul className="space-y-2">
            {datasetInfo.variables.slice(0, 6).map((v) => (
              <li key={v.name} className="flex items-start gap-2">
                <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded shrink-0">{v.name}</span>
                <span className="text-sm">{v.description}</span>
              </li>
            ))}
          </ul>
        </InfoCard>
      </section>

      {/* Questions Section - Enhanced */}
      <section className="mb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-2xl font-bold gradient-text mb-3">
            Preguntes d'Investigació
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Quatre preguntes clau derivades de l'anàlisi exploratòria del dataset, 
            cadascuna amb objectius específics i visualitzacions adequades.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {questions.map((q, i) => (
            <motion.div
              key={q.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Card className={`glass-card h-full border-l-4 ${q.gradient.includes('brain') ? 'border-l-brain' : q.gradient.includes('gender') ? 'border-l-gender-female' : q.gradient.includes('education') ? 'border-l-education' : 'border-l-age'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{q.icon}</span>
                    <div>
                      <Badge variant="outline" className="mb-1">Pregunta {q.number}</Badge>
                      <CardTitle className="text-lg font-display">{q.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Objectiu</h4>
                    <p className="text-sm text-muted-foreground">{q.objective}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">Relació de Dades</h4>
                    <p className="text-xs bg-muted/50 p-2 rounded">{q.relationship}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground border-0">
                      {q.chartType}
                    </Badge>
                    <a 
                      href={q.path} 
                      className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      Explorar →
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Visual Encoding Justification - NEW */}
      <section className="mb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-2xl font-bold gradient-text mb-3">
            Justificació de Codificacions Visuals
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cada tipus de gràfic ha estat escollit basant-se en principis d'<strong>expressivitat</strong> (representa correctament les dades) 
            i <strong>efectivitat</strong> (facilita la seva comprensió).
          </p>
        </motion.div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">Visió General</TabsTrigger>
            <TabsTrigger value="details">Detall per Gràfic</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Principis d'Expressivitat
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <ScatterChart className="w-4 h-4 text-brain mt-1" />
                        <span><strong>Scatter plot</strong> per correlacions entre variables numèriques</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <BarChart3 className="w-4 h-4 text-gender-female mt-1" />
                        <span><strong>Barres</strong> per comparar magnituds entre categories</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <LineChart className="w-4 h-4 text-age mt-1" />
                        <span><strong>Línies</strong> per mostrar tendències al llarg d'intervals</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-secondary" />
                      Principis d'Efectivitat
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500 mt-1.5"></span>
                        <span><strong>Colors consistents</strong> per diagnòstics a totes les vistes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500 mt-1.5"></span>
                        <span><strong>Eixos clars</strong> amb etiquetes descriptives</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-3 h-3 rounded-full bg-purple-500 mt-1.5"></span>
                        <span><strong>Llegendes integrades</strong> per facilitar la lectura</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {methodologies.map((m, i) => (
                <MethodologyCard key={m.chartType} {...m} delay={i * 0.1} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Interaction Techniques - NEW */}
      <section className="mb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-2xl font-bold gradient-text mb-3">
            Tècniques d'Interacció
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Elements interactius dissenyats per facilitar l'exploració de dades 
            i el descobriment de patrons sense problemes d'usabilitat.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {interactionTechniques.map((tech, i) => (
            <InteractionCard key={tech.title} {...tech} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* Objectives */}
      <section className="bg-card rounded-2xl p-8 shadow-card mb-8">
        <h2 className="font-display text-xl font-bold mb-6">🎯 Objectius del Projecte</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              Per a Investigadors
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Identificar biomarcadors de progressió de la malaltia
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Analitzar factors de risc i protectors
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Explorar patrons en dades clíniques i d'imatge
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" />
              Per al Públic General
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-secondary">•</span>
                Comprendre la progressió de l'Alzheimer
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary">•</span>
                Visualitzar dades complexes de manera intuïtiva
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary">•</span>
                Conscienciar sobre la malaltia i els seus factors
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Navigation prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center py-8"
      >
        <p className="text-muted-foreground mb-4">
          Utilitza la navegació superior per explorar cada pregunta d'investigació amb visualitzacions interactives.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          {questions.map(q => (
            <a
              key={q.number}
              href={q.path}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 hover:bg-muted transition-colors text-sm"
            >
              <span>{q.icon}</span>
              <span>P{q.number}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default Index;
