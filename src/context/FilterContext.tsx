import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    Patient, 
    PatientFilters, 
    filterPatients, 
    calculateStats, 
    PatientStats 
} from '@/types/patient';
import { useAlzheimerData } from '@/hooks/useAlzheimerData';

interface FilterContextType {
    // Estat
    filters: PatientFilters;
    setFilters: (filters: PatientFilters) => void;
    resetFilters: () => void;
    
    // Dades
    allPatients: Patient[];
    filteredPatients: Patient[];
    stats: PatientStats;
    
    // Estat de càrrega
    loading: boolean;
    error: string | null;
    
    // Mètriques
    uniqueValues: {
        genders: ('M' | 'F')[];
        diagnoses: Patient['diagnosis'][];
        ageRange: { min: number; max: number };
    };
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const initialFilters: PatientFilters = {
    gender: null,
    diagnosis: null,
    ageMin: undefined,
    ageMax: undefined,
    educationMin: undefined,
    educationMax: undefined,
};

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
    const { patients: allPatients, loading, error } = useAlzheimerData();
    const [filters, setFilters] = useState<PatientFilters>(initialFilters);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [stats, setStats] = useState<PatientStats>({
        total: 0,
        demented: 0,
        dementiaRate: 0,
        avgAge: 0,
        avgMMSE: 0,
        avgNWBV: 0,
        femaleCount: 0,
        maleCount: 0,
    });

    // Valors únics per filtres
    const uniqueValues = {
        genders: ['M', 'F'] as ('M' | 'F')[],
        diagnoses: ['NonDemented', 'VeryMildDemented', 'MildDemented', 'ModerateDemented'] as Patient['diagnosis'][],
        ageRange: {
            min: Math.min(...allPatients.map(p => p.age), 60),
            max: Math.max(...allPatients.map(p => p.age), 98),
        },
    };

    // Aplicar filtres
    useEffect(() => {
        if (allPatients.length > 0) {
            const filtered = filterPatients(allPatients, filters);
            setFilteredPatients(filtered);
            setStats(calculateStats(filtered));
        }
    }, [filters, allPatients]);

    const resetFilters = () => setFilters(initialFilters);

    return (
        <FilterContext.Provider value={{
            filters,
            setFilters,
            resetFilters,
            allPatients,
            filteredPatients,
            stats,
            loading,
            error,
            uniqueValues,
        }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilters = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilters must be used within FilterProvider');
    }
    return context;
};