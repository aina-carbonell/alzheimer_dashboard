import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/cards/StatCard";
import { InfoCard } from "@/components/cards/InfoCard";
import { useFilters } from "@/context/FilterContext";
import { Brain, TrendingUp, Activity, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, BarChart, Bar, LineChart, Line, Legend } from "recharts";
import { diagnosisColors } from "@/types/patient";

// Tipus per al model i entrenament
type ModelConfig = {
  layers: number[];
  learningRate: number;
  epochs: number;
  batchSize: number;
  validationSplit: number;
};

type TrainingMetrics = {
  epoch: number;
  loss: number;
  accuracy: number;
  valLoss: number;
  valAccuracy: number;
};

type PredictionInput = {
  age: number;
  educ: number;
  mmse: number;
  nWBV: number;
  gender: 'M' | 'F';
};

type PredictionResult = {
  class: 'NonDemented' | 'VeryMildDemented' | 'MildDemented';
  confidence: number;
  probabilities: {
    NonDemented: number;
    VeryMildDemented: number;
    MildDemented: number;
  };
};

const DeepLearning = () => {
  const { filteredPatients } = useFilters();
  
  // Estats per al model
  const [isTraining, setIsTraining] = useState(false);
  const [isTrained, setIsTrained] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetrics[]>([]);
  const [finalAccuracy, setFinalAccuracy] = useState(0);
  const [finalLoss, setFinalLoss] = useState(0);
  
  // Configuració del model
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    layers: [64, 32, 16],
    learningRate: 0.001,
    epochs: 50,
    batchSize: 16,
    validationSplit: 0.2,
  });
  
  // Estats per a predicció
  const [predictionInput, setPredictionInput] = useState<PredictionInput>({
    age: 70,
    educ: 3,
    mmse: 25,
    nWBV: 0.75,
    gender: 'F',
  });
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  
  // Preparar dades d'entrenament
  const trainingData = useMemo(() => {
    const validPatients = filteredPatients.filter(p => 
      p.mmse !== null && p.nWBV > 0 && p.educ > 0
    );
    
    return {
      total: validPatients.length,
      features: validPatients.map(p => ({
        age: p.age,
        educ: p.educ,
        mmse: p.mmse!,
        nWBV: p.nWBV,
        gender: p.gender === 'M' ? 1 : 0,
      })),
      labels: validPatients.map(p => p.diagnosis),
      distribution: {
        NonDemented: validPatients.filter(p => p.diagnosis === 'NonDemented').length,
        VeryMildDemented: validPatients.filter(p => p.diagnosis === 'VeryMildDemented').length,
        MildDemented: validPatients.filter(p => p.diagnosis === 'MildDemented').length,
      }
    };
  }, [filteredPatients]);
  
  // Simular entrenament del model
  const handleTrain = async () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingMetrics([]);
    
    const metrics: TrainingMetrics[] = [];
    
    for (let epoch = 1; epoch <= modelConfig.epochs; epoch++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Simular mètriques d'entrenament (millora progressiva)
      const progress = epoch / modelConfig.epochs;
      const loss = 1.0 - (progress * 0.7 + Math.random() * 0.1);
      const accuracy = 0.3 + (progress * 0.6 + Math.random() * 0.05);
      const valLoss = loss + 0.1 + Math.random() * 0.1;
      const valAccuracy = accuracy - 0.05 - Math.random() * 0.05;
      
      metrics.push({
        epoch,
        loss: Math.max(0.1, loss),
        accuracy: Math.min(0.98, accuracy),
        valLoss: Math.max(0.15, valLoss),
        valAccuracy: Math.min(0.95, valAccuracy),
      });
      
      setTrainingMetrics([...metrics]);
      setTrainingProgress((epoch / modelConfig.epochs) * 100);
    }
    
    const lastMetrics = metrics[metrics.length - 1];
    setFinalAccuracy(Math.round(lastMetrics.valAccuracy * 100));
    setFinalLoss(Math.round(lastMetrics.valLoss * 100) / 100);
    
    setIsTraining(false);
    setIsTrained(true);
  };
  
  // Fer predicció
  const handlePredict = () => {
    if (!isTrained) return;
    
    // Simular predicció basada en els valors d'entrada
    // Lògica simplificada: MMSE i nWBV són els principals indicadors
    const mmseScore = (predictionInput.mmse - 15) / 15; // Normalitzat 0-1
    const nwbvScore = predictionInput.nWBV;
    const ageScore = 1 - ((predictionInput.age - 60) / 40); // Menor edat = millor
    
    const healthScore = (mmseScore * 0.5 + nwbvScore * 0.3 + ageScore * 0.2);
    
    let probabilities: PredictionResult['probabilities'];
    let predictedClass: PredictionResult['class'];
    
    if (healthScore > 0.7) {
      probabilities = {
        NonDemented: 0.75 + Math.random() * 0.15,
        VeryMildDemented: 0.15 + Math.random() * 0.05,
        MildDemented: 0.05 + Math.random() * 0.05,
      };
      predictedClass = 'NonDemented';
    } else if (healthScore > 0.4) {
      probabilities = {
        NonDemented: 0.20 + Math.random() * 0.10,
        VeryMildDemented: 0.55 + Math.random() * 0.15,
        MildDemented: 0.20 + Math.random() * 0.10,
      };
      predictedClass = 'VeryMildDemented';
    } else {
      probabilities = {
        NonDemented: 0.10 + Math.random() * 0.05,
        VeryMildDemented: 0.25 + Math.random() * 0.10,
        MildDemented: 0.60 + Math.random() * 0.15,
      };
      predictedClass = 'MildDemented';
    }
    
    // Normalitzar probabilitats
    const total = Object.values(probabilities).reduce((a, b) => a + b, 0);
    probabilities = {
      NonDemented: probabilities.NonDemented / total,
      VeryMildDemented: probabilities.VeryMildDemented / total,
      MildDemented: probabilities.MildDemented / total,
    };
    
    setPredictionResult({
      class: predictedClass,
      confidence: probabilities[predictedClass],
      probabilities,
    });
  };
  
  const classLabels = {
    'NonDemented': 'Sense Demència',
    'VeryMildDemented': 'Demència Molt Lleu',
    'MildDemented': 'Demència Lleu',
  };
  
  return (
    <PageLayout
      title="Deep Learning per Alzheimer"
      subtitle="Model de xarxa neuronal per a la detecció precoz de demència"
      icon={<Zap className="w-8 h-8" />}
      gradient="from-purple-500 to-indigo-600"
    >
      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          value={trainingData.total}
          label="Mostres d'entrenament"
          icon={<Brain className="w-5 h-5" />}
          delay={0.1}
        />
        <StatCard
          value="5"
          label="Features d'entrada"
          icon={<Activity className="w-5 h-5" />}
          gradient="brain"
          delay={0.2}
        />
        <StatCard
          value={isTrained ? `${finalAccuracy}%` : "N/A"}
          label="Precisió del model"
          icon={<TrendingUp className="w-5 h-5" />}
          gradient="age"
          delay={0.3}
        />
        <StatCard
          value={isTrained ? finalLoss.toFixed(2) : "N/A"}
          label="Loss final"
          icon={<Zap className="w-5 h-5" />}
          gradient="gender"
          delay={0.4}
        />
      </section>
      
      {/* Informació del dataset */}
      <section className="grid md:grid-cols-2 gap-6 mb-8">
        <InfoCard 
          title="Distribució de Classes" 
          icon={<Brain className="w-5 h-5 text-primary" />}
          delay={0.2}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Sense Demència:</span>
              <Badge variant="outline" style={{ backgroundColor: diagnosisColors.NonDemented + '20', borderColor: diagnosisColors.NonDemented }}>
                {trainingData.distribution.NonDemented} ({Math.round(trainingData.distribution.NonDemented / trainingData.total * 100)}%)
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Demència Molt Lleu:</span>
              <Badge variant="outline" style={{ backgroundColor: diagnosisColors.VeryMildDemented + '20', borderColor: diagnosisColors.VeryMildDemented }}>
                {trainingData.distribution.VeryMildDemented} ({Math.round(trainingData.distribution.VeryMildDemented / trainingData.total * 100)}%)
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Demència Lleu:</span>
              <Badge variant="outline" style={{ backgroundColor: diagnosisColors.MildDemented + '20', borderColor: diagnosisColors.MildDemented }}>
                {trainingData.distribution.MildDemented} ({Math.round(trainingData.distribution.MildDemented / trainingData.total * 100)}%)
              </Badge>
            </div>
          </div>
        </InfoCard>
        
        <InfoCard 
          title="Arquitectura del Model" 
          icon={<Zap className="w-5 h-5 text-primary" />}
          borderColor="border-purple-500"
          delay={0.3}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Capa d'entrada:</span>
              <Badge variant="secondary">5 neurones</Badge>
            </div>
            {modelConfig.layers.map((neurons, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span>Capa oculta {idx + 1}:</span>
                <Badge variant="secondary">{neurons} neurones</Badge>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <span>Capa de sortida:</span>
              <Badge variant="secondary">3 neurones (Softmax)</Badge>
            </div>
            <div className="pt-2 mt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Learning Rate:</span>
                <span className="font-mono">{modelConfig.learningRate}</span>
              </div>
            </div>
          </div>
        </InfoCard>
      </section>
      
      <Tabs defaultValue="train" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="train">Entrenament del Model</TabsTrigger>
          <TabsTrigger value="predict">Fer Prediccions</TabsTrigger>
        </TabsList>
        
        {/* Tab d'entrenament */}
        <TabsContent value="train" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Controls d'entrenament */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Configuració</CardTitle>
                <CardDescription>Ajusta els hiperparàmetres del model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Èpoques d'entrenament</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[modelConfig.epochs]}
                      onValueChange={(value) => setModelConfig({ ...modelConfig, epochs: value[0] })}
                      min={10}
                      max={100}
                      step={10}
                      disabled={isTraining}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono w-12 text-right">{modelConfig.epochs}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Learning Rate</Label>
                  <Select
                    value={modelConfig.learningRate.toString()}
                    onValueChange={(value) => setModelConfig({ ...modelConfig, learningRate: parseFloat(value) })}
                    disabled={isTraining}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.0001">0.0001</SelectItem>
                      <SelectItem value="0.001">0.001</SelectItem>
                      <SelectItem value="0.01">0.01</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Batch Size</Label>
                  <Select
                    value={modelConfig.batchSize.toString()}
                    onValueChange={(value) => setModelConfig({ ...modelConfig, batchSize: parseInt(value) })}
                    disabled={isTraining}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                      <SelectItem value="32">32</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleTrain} 
                  disabled={isTraining}
                  className="w-full"
                  size="lg"
                >
                  {isTraining ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />
                      Entrenant... {Math.round(trainingProgress)}%
                    </>
                  ) : isTrained ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Re-entrenar Model
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Iniciar Entrenament
                    </>
                  )}
                </Button>
                
                {isTraining && (
                  <Progress value={trainingProgress} className="h-2" />
                )}
                
                {isTrained && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Model entrenat amb èxit!</AlertTitle>
                    <AlertDescription>
                      Precisió de validació: <strong>{finalAccuracy}%</strong>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
            
            {/* Gràfics d'entrenament */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Mètriques d'Entrenament</CardTitle>
                <CardDescription>Evolució de loss i accuracy durant l'entrenament</CardDescription>
              </CardHeader>
              <CardContent>
                {trainingMetrics.length === 0 ? (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Brain className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p>Inicia l'entrenament per veure les mètriques</p>
                    </div>
                  </div>
                ) : (
                  <Tabs defaultValue="accuracy" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                      <TabsTrigger value="loss">Loss</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="accuracy" className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trainingMetrics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="epoch" label={{ value: 'Època', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: 'Accuracy', angle: -90, position: 'insideLeft' }} domain={[0, 1]} />
                          <Tooltip formatter={(value: number) => `${(value * 100).toFixed(2)}%`} />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="accuracy" 
                            stroke="#10b981" 
                            name="Training Accuracy"
                            strokeWidth={2}
                            dot={{ r: 1 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="valAccuracy" 
                            stroke="#3b82f6" 
                            name="Validation Accuracy"
                            strokeWidth={2}
                            dot={{ r: 1 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    
                    <TabsContent value="loss" className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trainingMetrics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="epoch" label={{ value: 'Època', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: 'Loss', angle: -90, position: 'insideLeft' }} domain={[0, 'auto']} />
                          <Tooltip formatter={(value: number) => value.toFixed(4)} />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="loss" 
                            stroke="#ef4444" 
                            name="Training Loss"
                            strokeWidth={2}
                            dot={{ r: 1 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="valLoss" 
                            stroke="#f59e0b" 
                            name="Validation Loss"
                            strokeWidth={2}
                            dot={{ r: 1 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab de predicció */}
        <TabsContent value="predict" className="space-y-6">
          {!isTrained ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Model no entrenat</AlertTitle>
              <AlertDescription>
                Has d'entrenar el model primer abans de poder fer prediccions.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Formulari de predicció */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Dades del Pacient</CardTitle>
                  <CardDescription>Introdueix les dades per fer la predicció</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Edat (anys)</Label>
                    <Input
                      type="number"
                      value={predictionInput.age}
                      onChange={(e) => setPredictionInput({ ...predictionInput, age: parseInt(e.target.value) || 0 })}
                      min={18}
                      max={100}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Gènere</Label>
                    <Select
                      value={predictionInput.gender}
                      onValueChange={(value: 'M' | 'F') => setPredictionInput({ ...predictionInput, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="F">Dona</SelectItem>
                        <SelectItem value="M">Home</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Nivell Educatiu (0-5)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[predictionInput.educ]}
                        onValueChange={(value) => setPredictionInput({ ...predictionInput, educ: value[0] })}
                        min={0}
                        max={5}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm font-mono w-8 text-right">{predictionInput.educ}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>MMSE Score (0-30)</Label>
                    <Input
                      type="number"
                      value={predictionInput.mmse}
                      onChange={(e) => setPredictionInput({ ...predictionInput, mmse: parseInt(e.target.value) || 0 })}
                      min={0}
                      max={30}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Volum Cerebral Normalitzat (nWBV)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={predictionInput.nWBV}
                      onChange={(e) => setPredictionInput({ ...predictionInput, nWBV: parseFloat(e.target.value) || 0 })}
                      min={0}
                      max={1}
                    />
                  </div>
                  
                  <Button 
                    onClick={handlePredict}
                    className="w-full"
                    size="lg"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Predir Diagnòstic
                  </Button>
                </CardContent>
              </Card>
              
              {/* Resultat de la predicció */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Resultat de la Predicció</CardTitle>
                  <CardDescription>Diagnòstic predit pel model de deep learning</CardDescription>
                </CardHeader>
                <CardContent>
                  {!predictionResult ? (
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Brain className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Introdueix les dades i clica "Predir Diagnòstic"</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Predicció principal */}
                      <Alert className="border-2" style={{ borderColor: diagnosisColors[predictionResult.class] }}>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle className="text-lg">
                          Diagnòstic Predit: <strong>{classLabels[predictionResult.class]}</strong>
                        </AlertTitle>
                        <AlertDescription>
                          Confiança del model: <strong>{(predictionResult.confidence * 100).toFixed(1)}%</strong>
                        </AlertDescription>
                      </Alert>
                      
                      {/* Distribució de probabilitats */}
                      <div>
                        <h4 className="font-semibold mb-4">Probabilitats per Classe</h4>
                        <div className="space-y-4">
                          {Object.entries(predictionResult.probabilities).map(([key, prob]) => (
                            <div key={key}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm">{classLabels[key as keyof typeof classLabels]}</span>
                                <span className="text-sm font-mono">{(prob * 100).toFixed(1)}%</span>
                              </div>
                              <Progress 
                                value={prob * 100} 
                                className="h-3"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Gràfic de barres */}
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={Object.entries(predictionResult.probabilities).map(([key, value]) => ({
                              class: classLabels[key as keyof typeof classLabels],
                              probability: value,
                              fill: diagnosisColors[key as keyof typeof diagnosisColors],
                            }))}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="class" />
                            <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                            <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
                            <Bar dataKey="probability" radius={[8, 8, 0, 0]}>
                              {Object.entries(predictionResult.probabilities).map(([key], index) => (
                                <Cell key={index} fill={diagnosisColors[key as keyof typeof diagnosisColors]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* Nota important */}
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Nota Important</AlertTitle>
                        <AlertDescription>
                          Aquesta predicció és només amb finalitats educatives i no substitueix un diagnòstic mèdic professional.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Explicació del model */}
      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Com Funciona el Model?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  Entrada de Dades
                </h4>
                <p className="text-sm text-muted-foreground">
                  El model rep 5 variables clau: edat, gènere, nivell educatiu, puntuació MMSE i volum cerebral normalitzat (nWBV).
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  Xarxa Neuronal
                </h4>
                <p className="text-sm text-muted-foreground">
                  Una xarxa de múltiples capes (64→32→16 neurones) processa les dades, aprenent patrons complexos relacionats amb la demència.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  Predicció
                </h4>
                <p className="text-sm text-muted-foreground">
                  La capa de sortida utilitza Softmax per generar probabilitats per a cada classe de diagnòstic: sense demència, demència molt lleu o demència lleu.
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Variables d'Entrada i la seva Importància</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>MMSE (Mini-Mental State Examination):</strong> Puntuació cognitiva clau. Valors baixos indiquen deteriorament cognitiu.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>nWBV (Volum Cerebral Normalitzat):</strong> Mesura d'atròfia cerebral. Volums menors s'associen amb demència.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Edat:</strong> Factor de risc principal. La probabilitat de demència augmenta amb l'edat.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Educació:</strong> Nivells educatius més alts poden tenir efecte protector (reserva cognitiva).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Gènere:</strong> Diferències en prevalença entre homes i dones.</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageLayout>
  );
};

export default DeepLearning;