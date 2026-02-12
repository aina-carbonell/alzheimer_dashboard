import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
    Patient, 
    PatientFilters, 
    filterPatients, 
    calculateStats, 
    PatientStats,
    diagnosisLabels,
    genderLabels,
    CONSTANTS
} from '@/types/patient';
import { useAlzheimerData } from '@/hooks/useAlzheimerData';

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
    
    allPatients: Patient[];
    stats: PatientStats;
    loading: boolean;
    error: string | null;
    uniqueValues: {
        genders: ('M' | 'F')[];
        diagnoses: Patient['diagnosis'][];
        ageRange: { min: number; max: number };
    };
    
    setFilters: (filters: PatientFilters) => void;
}

const initialFilters: FilterState = {
  ageRange: [CONSTANTS.AGE_MIN, CONSTANTS.AGE_MAX],
  genders: ['M', 'F'],
  diagnoses: ['NonDemented', 'VeryMildDemented', 'MildDemented', 'ModerateDemented'],
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
    const { patients: allPatients, loading, error } = useAlzheimerData();
    
    const [filters, setFiltersState] = useState<FilterState>(initialFilters);
    
    const [newFilters, setNewFilters] = useState<PatientFilters>({
        gender: null,
        diagnosis: null,
        ageMin: undefined,
        ageMax: undefined,
        educationMin: undefined,
        educationMax: undefined,
    });

    const setAgeRange = (range: [number, number]) => {
        setFiltersState(prev => ({ ...prev, ageRange: range }));
        setNewFilters(prev => ({ ...prev, ageMin: range[0], ageMax: range[1] }));
    };

    const toggleGender = (gender: 'M' | 'F') => {
        setFiltersState(prev => ({
            ...prev,
            genders: prev.genders.includes(gender)
                ? prev.genders.filter(g => g !== gender)
                : [...prev.genders, gender],
        }));
        setNewFilters(prev => ({ ...prev, gender: null })); 
    };

    const toggleDiagnosis = (diagnosis: Patient['diagnosis']) => {
        setFiltersState(prev => ({
            ...prev,
            diagnoses: prev.diagnoses.includes(diagnosis)
                ? prev.diagnoses.filter(d => d !== diagnosis)
                : [...prev.diagnoses, diagnosis],
        }));
        setNewFilters(prev => ({ ...prev, diagnosis: null }));
    };

    const resetFilters = () => {
        setFiltersState(initialFilters);
        setNewFilters({
            gender: null,
            diagnosis: null,
            ageMin: undefined,
            ageMax: undefined,
            educationMin: undefined,
            educationMax: undefined,
        });
    };

    const setFilters = (filters: PatientFilters) => {
        setNewFilters(filters);
        const ageMin = filters.ageMin ?? CONSTANTS.AGE_MIN;
        const ageMax = filters.ageMax ?? CONSTANTS.AGE_MAX;
        setFiltersState(prev => ({
            ...prev,
            ageRange: [ageMin, ageMax],
        }));
    };

    const filteredPatients = useMemo(() => {
        if (allPatients.length === 0) return [];
        
        return allPatients.filter(p => {
            const ageMatch = p.age >= filters.ageRange[0] && p.age <= filters.ageRange[1];
            const genderMatch = filters.genders.includes(p.gender);
            const diagnosisMatch = filters.diagnoses.includes(p.diagnosis);
            return ageMatch && genderMatch && diagnosisMatch;
        });
    }, [filters, allPatients]);

    const stats = useMemo(() => {
        return calculateStats(filteredPatients);
    }, [filteredPatients]);

    const uniqueValues = {
        genders: ['M', 'F'] as ('M' | 'F')[],
        diagnoses: ['NonDemented', 'VeryMildDemented', 'MildDemented', 'ModerateDemented'] as Patient['diagnosis'][],
        ageRange: {
            min: allPatients.length > 0 ? Math.min(...allPatients.map(p => p.age)) : CONSTANTS.AGE_MIN,
            max: allPatients.length > 0 ? Math.max(...allPatients.map(p => p.age)) : CONSTANTS.AGE_MAX,
        },
    };

    const minAge = uniqueValues.ageRange.min;
    const maxAge = uniqueValues.ageRange.max;

    const value: FilterContextType = {
        // Estat antic
        filters,
        setAgeRange,
        toggleGender,
        toggleDiagnosis,
        resetFilters,
        filteredPatients,
        minAge,
        maxAge,
        
        // Estat nou
        allPatients,
        stats,
        loading,
        error,
        uniqueValues,
        setFilters,
    };

    return (
        <FilterContext.Provider value={value}>
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