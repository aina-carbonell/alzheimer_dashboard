# 🧠 Explorador d'Alzheimer amb Deep Learning - Dataset OASIS

Aplicació web interactiva per a l'anàlisi i visualització de dades sobre la malaltia d'Alzheimer utilitzant el dataset OASIS (Open Access Series of Imaging Studies), amb un **model de Deep Learning** per a la detecció precoz.

## 🌟 NOVA FUNCIONALITAT: Deep Learning

### 🤖 Model Predictiu d'Alzheimer
La nova pàgina de **Deep Learning** implementa un model de xarxa neuronal per predir el diagnòstic d'Alzheimer basant-se en dades clíniques:

- **Entrenament interactiu**: Configura hiperparàmetres (epochs, learning rate, batch size) i entrena el model en temps real
- **Visualització de mètriques**: Gràfics d'accuracy i loss durant l'entrenament (training i validation)
- **Prediccions en temps real**: Introdueix dades d'un pacient i obté un diagnòstic predit amb probabilitats
- **Arquitectura**: Xarxa neuronal amb 3 capes ocultes (64→32→16 neurones) i sortida softmax

#### Variables d'entrada del model:
- **Edat** (18-100 anys)
- **Gènere** (M/F)
- **Nivell educatiu** (0-5)
- **MMSE** (Mini-Mental State Examination, 0-30)
- **nWBV** (Volum cerebral normalitzat, 0-1)

#### Classes de sortida:
- **Sense Demència** (NonDemented)
- **Demència Molt Lleu** (VeryMildDemented)
- **Demència Lleu** (MildDemented)

## 📊 Característiques Principals

### Pàgines d'Anàlisi

1. **Dashboard Principal (Index)** 🏠
   - Visió general del dataset
   - Estadístiques globals
   - Navegació cap a les diferents àrees d'anàlisi
   - Insights clau sobre factors de risc

2. **Gènere i Alzheimer** ⚧️
   - Comparació entre homes i dones
   - Gràfics de barres, pie charts i radar
   - Anàlisi de diferències en prevalença
   - Hipòtesis sobre factors hormonals

3. **Edat i Progressió** 📈
   - Evolució de la malaltia per grups d'edat
   - Gràfics d'àrea i línia
   - Taxa de demència per rang d'edat
   - Correlació edat-cognició

4. **Educació i Reserva Cognitiva** 📚
   - Impacte del nivell educatiu
   - Hipòtesi de reserva cognitiva
   - Scatter plots i correlacions
   - Efecte protector de l'educació

5. **Atròfia Cerebral** 🧠
   - Anàlisi del volum cerebral (nWBV)
   - Box plots i violin plots
   - Reducció volumètrica progressiva
   - Relació amb severitat de demència

6. **Distribucions** 📊
   - Visualitzacions estadístiques avançades
   - Histogrames i distribucions
   - Anàlisi de normalitat
   - Outliers i valors atípics

7. **🆕 Deep Learning** 🤖
   - Model de xarxa neuronal per predicció
   - Entrenament interactiu amb visualització de mètriques
   - Prediccions amb probabilitats per classe
   - Explicació de l'arquitectura i funcionament

8. **Conclusions** 📝
   - Resum de trobades principals
   - Limitacions de l'estudi
   - Implicacions clíniques
   - Futures línies de recerca

## 🛠️ Tecnologies Utilitzades

- **React 18** + **TypeScript** - Framework principal
- **Vite** - Build tool i dev server
- **TailwindCSS** - Estilització
- **shadcn/ui** - Components UI
- **Recharts** - Visualitzacions de dades
- **Framer Motion** - Animacions
- **React Router** - Navegació
- **Papaparse** - Parsing CSV
- **Lucide React** - Iconografia

## 📁 Estructura del Projecte

```
src/
├── components/
│   ├── cards/           # Components de targetes (Stats, Info, Question)
│   ├── charts/          # Gràfics personalitzats (BoxPlot, Violin)
│   ├── filters/         # Sistema de filtres
│   ├── layout/          # Components de layout (Navigation, PageLayout)
│   └── ui/              # Components shadcn/ui
├── contexts/
│   └── FilterContext.tsx    # Context per filtres globals
├── hooks/
│   └── useAlzheimerData.ts  # Hook per carregar dades
├── pages/
│   ├── Index.tsx            # Dashboard principal
│   ├── Genere.tsx           # Anàlisi per gènere
│   ├── Edat.tsx             # Anàlisi per edat
│   ├── Educacio.tsx         # Anàlisi educatiu
│   ├── Atrofia.tsx          # Anàlisi volum cerebral
│   ├── Distribucions.tsx    # Distribucions estadístiques
│   ├── DeepLearning.tsx     # Model de Deep Learning
│   └── Conclusions.tsx      # Conclusions finals
├── lib/
│   └── utils.ts             # Utilitats
└── data/
    └── oasis_dataset.csv    # Dataset original
```

## 🚀 Instal·lació i Ús

### Prerequisits
- Node.js >= 18
- npm o yarn

### Passos

1. **Clonar el repositori**
```bash
git clone [url-del-repo]
cd alzheimer-explorer
```

2. **Instal·lar dependències**
```bash
npm install
```

3. **Executar en mode desenvolupament**
```bash
npm run dev
```

4. **Build per producció**
```bash
npm run build
```

5. **Preview del build**
```bash
npm run preview
```

## 📊 Dataset OASIS

El dataset conté **192 pacients** amb les següents variables:

### Variables Demogràfiques
- **ID**: Identificador únic del pacient
- **M/F**: Gènere (Male/Female)
- **Hand**: Lateralitat (Right/Left)
- **Age**: Edat (18-96 anys)
- **Educ**: Nivell educatiu (0-5)
- **SES**: Estatus socioeconòmic (1-5)

### Variables Clíniques
- **MMSE**: Mini-Mental State Examination (0-30)
- **CDR**: Clinical Dementia Rating (0, 0.5, 1, 2)
- **eTIV**: Volum intracranial estimat
- **nWBV**: Volum cerebral normalitzat (0-1)
- **ASF**: Factor d'escala atlas
- **class**: Diagnòstic (NonDemented, VeryMildDemented, MildDemented)

## 🎨 Característiques d'UX

### Interactivitat
- ✅ Filtres globals (gènere, diagnòstic)
- ✅ Tooltips informatius
- ✅ Tabs per canviar entre visualitzacions
- ✅ Animacions amb Framer Motion
- ✅ Responsive design
- ✅ Entrenament interactiu de models
- ✅ Prediccions en temps real

### Accessibilitat
- ✅ Paleta de colors contrastada
- ✅ Labels descriptius
- ✅ Navegació per teclat
- ✅ ARIA attributes

### Rendiment
- ✅ Lazy loading de components
- ✅ Memoització de càlculs
- ✅ Optimització de re-renders
- ✅ Code splitting

## 🤖 Model de Deep Learning

### Arquitectura
```
Input Layer (5 neurones)
    ↓
Hidden Layer 1 (64 neurones) + ReLU
    ↓
Hidden Layer 2 (32 neurones) + ReLU
    ↓
Hidden Layer 3 (16 neurones) + ReLU
    ↓
Output Layer (3 neurones) + Softmax
```

### Hiperparàmetres Configurables
- **Èpoques**: 10-100 (per defecte: 50)
- **Learning Rate**: 0.0001, 0.001, 0.01 (per defecte: 0.001)
- **Batch Size**: 8, 16, 32 (per defecte: 16)
- **Validation Split**: 20%

### Mètriques Visualitzades
- **Accuracy** (training i validation)
- **Loss** (training i validation)
- **Probabilitats per classe**
- **Confiança de la predicció**

## ⚠️ Avís Important

El model de Deep Learning implementat en aquesta aplicació és **només amb finalitats educatives i de demostració**. Les prediccions generades **NO substitueixen un diagnòstic mèdic professional** i no han de ser utilitzades per prendre decisions clíniques.

## 📈 Futures Millores

- [ ] Implementació de model real amb TensorFlow.js
- [ ] Comparador de pacients
- [ ] Cross-validation del model
- [ ] Feature importance analysis
- [ ] Més tipus de gràfics
- [ ] Internacionalització (i18n)
- [ ] PWA support

## 📝 Scripts Disponibles

```json
{
  "dev": "Servidor de desenvolupament",
  "build": "Build per producció",
  "preview": "Preview del build",
  "test": "Executar tests",
  "lint": "Linter ESLint",
  "format": "Formatació amb Prettier"
}
```

## 🤝 Contribuir

1. Fork el projecte
2. Crea una branca (`git checkout -b feature/nova-funcionalitat`)
3. Commit els canvis (`git commit -m 'Afegir nova funcionalitat'`)
4. Push a la branca (`git push origin feature/nova-funcionalitat`)
5. Obre un Pull Request

## 📄 Llicència

Aquest projecte està sota llicència MIT.

## 👥 Autors

- Aina Carbonell

## 🙏 Agraïments

- Dataset OASIS pel dataset públic
- Comunitat React per les eines
- shadcn/ui per els components
- Recharts per les visualitzacions

## 📞 Contacte

Per qualsevol dubte o suggeriment, no dubtis en contactar!

---

**Fet amb ❤️, ☕ i 🤖 per a la investigació sobre Alzheimer**