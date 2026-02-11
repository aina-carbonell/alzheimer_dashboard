import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { patients, Patient } from "@/data/alzheimerData";

interface FilterState {
  ageRange: [number, number];
  genders: ('M' | 'F')[];
  diagnoses: Patient['diagnosis'][];
}

interface FilterContextType {
  filters: FilterState;
  setAgeRange: (range: [number, number]) => void;
  toggleGender: (gender: 'M' | 'F') => void;
  toggleDiagnosis: (diagnosis: Patient['diagnosis']) => void;
  resetFilters: () => void;
  filteredPatients: Patient[];
  minAge: number;
  maxAge: number;
}

const minAge = Math.min(...patients.map(p => p.age));
const maxAge = Math.max(...patients.map(p => p.age));

const defaultFilters: FilterState = {
  ageRange: [minAge, maxAge],
  genders: ['M', 'F'],
  diagnoses: ['NonDemented', 'VeryMildDemented', 'MildDemented', 'ModerateDemented'],
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setAgeRange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, ageRange: range }));
  };

  const toggleGender = (gender: 'M' | 'F') => {
    setFilters(prev => ({
      ...prev,
      genders: prev.genders.includes(gender)
        ? prev.genders.filter(g => g !== gender)
        : [...prev.genders, gender],
    }));
  };

  const toggleDiagnosis = (diagnosis: Patient['diagnosis']) => {
    setFilters(prev => ({
      ...prev,
      diagnoses: prev.diagnoses.includes(diagnosis)
        ? prev.diagnoses.filter(d => d !== diagnosis)
        : [...prev.diagnoses, diagnosis],
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const ageMatch = p.age >= filters.ageRange[0] && p.age <= filters.ageRange[1];
      const genderMatch = filters.genders.includes(p.gender);
      const diagnosisMatch = filters.diagnoses.includes(p.diagnosis);
      return ageMatch && genderMatch && diagnosisMatch;
    });
  }, [filters]);

  return (
    <FilterContext.Provider value={{
      filters,
      setAgeRange,
      toggleGender,
      toggleDiagnosis,
      resetFilters,
      filteredPatients,
      minAge,
      maxAge,
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};
