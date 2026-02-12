import { useFilters } from "@/context/FilterContext";
import { diagnosisLabels, Patient } from "@/data/alzheimerData";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Filter, Users, Calendar, Brain } from "lucide-react";
import { motion } from "framer-motion";

export const FilterSidebar = () => {
  const {
    filters,
    setAgeRange,
    toggleGender,
    toggleDiagnosis,
    resetFilters,
    filteredPatients,
    minAge,
    maxAge,
  } = useFilters();

  const genderLabels = { M: "Homes", F: "Dones" };
  const diagnosisOptions: Patient['diagnosis'][] = ['NonDemented', 'VeryMildDemented', 'MildDemented'];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-72 shrink-0"
    >
      <Card className="sticky top-24 glass-card border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="w-4 h-4 text-primary" />
              Filtres Globals
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reiniciar
            </Button>
          </div>
          <Badge variant="secondary" className="w-fit text-xs">
            {filteredPatients.length} pacients seleccionats
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Age Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4 text-age" />
              Rang d'Edat
            </div>
            <div className="px-1">
              <Slider
                value={filters.ageRange}
                onValueChange={(value) => setAgeRange(value as [number, number])}
                min={minAge}
                max={maxAge}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{filters.ageRange[0]} anys</span>
                <span>{filters.ageRange[1]} anys</span>
              </div>
            </div>
          </div>

          {/* Gender Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="w-4 h-4 text-gender-female" />
              Gènere
            </div>
            <div className="space-y-2">
              {(['M', 'F'] as const).map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <Checkbox
                    id={`gender-${gender}`}
                    checked={filters.genders.includes(gender)}
                    onCheckedChange={() => toggleGender(gender)}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor={`gender-${gender}`}
                    className="text-sm cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {genderLabels[gender]}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnosis Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Brain className="w-4 h-4 text-brain" />
              Diagnòstic
            </div>
            <div className="space-y-2">
              {diagnosisOptions.map((diagnosis) => (
                <div key={diagnosis} className="flex items-center space-x-2">
                  <Checkbox
                    id={`diagnosis-${diagnosis}`}
                    checked={filters.diagnoses.includes(diagnosis)}
                    onCheckedChange={() => toggleDiagnosis(diagnosis)}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor={`diagnosis-${diagnosis}`}
                    className="text-sm cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {diagnosisLabels[diagnosis]}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.aside>
  );
};
