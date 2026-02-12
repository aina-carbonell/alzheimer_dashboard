export interface Patient {
    // Identificació
    id: string; // ID del pacient (ex: OAS1_0002_MR1)
    
    // Dades demogràfiques
    gender: 'M' | 'F'; // Gènere (M/F)
    hand: 'R' | 'L' | null; // Lateralitat (Right/Left)
    age: number; // Edat en anys
    education: number | null; // Nivell educatiu (0-5 escala, pot ser null)
    ses: number | null; // Socioeconomic Status (1-5, pot ser null)
    
    // Dades clíniques
    mmse: number | null; // Mini-Mental State Examination (0-30, pot ser null)
    cdr: number | null; // Clinical Dementia Rating (0, 0.5, 1, 2, pot ser null)
    diagnosis: 'NonDemented' | 'VeryMildDemented' | 'MildDemented' | 'ModerateDemented'; // Diagnòstic categòric
    
    // Dades neuroimatge
    eTIV: number; // Estimated Total Intracranial Volume
    nWBV: number; // Normalized Whole Brain Volume (0.6-0.9 aprox)
    asf: number; // Atlas Scaling Factor
    
    // Dades temporals
    delay: number | null; // Temps des de la visita anterior en mesos (pot ser null)
}

export const parsePatient = (row: any): Patient => ({
    id: row['ID'] || '',
    gender: (row['M/F'] === 'M' || row['M/F'] === 'F') ? row['M/F'] : 'F',
    hand: row['Hand'] === 'R' ? 'R' : row['Hand'] === 'L' ? 'L' : null,
    age: Number(row['Age']) || 0,
    education: row['Educ'] ? Number(row['Educ']) : null,
    ses: row['SES'] ? Number(row['SES']) : null,
    mmse: row['MMSE'] ? Number(row['MMSE']) : null,
    cdr: row['CDR'] ? Number(row['CDR']) : null,
    diagnosis: parseDiagnosis(row['class']),
    eTIV: Number(row['eTIV']) || 0,
    nWBV: Number(row['nWBV']) || 0,
    asf: Number(row['ASF']) || 0,
    delay: row['Delay'] ? Number(row['Delay']) : null,
});

const parseDiagnosis = (classValue: string): Patient['diagnosis'] => {
    switch (classValue) {
        case 'NonDemented':
            return 'NonDemented';
        case 'VeryMildDemented':
            return 'VeryMildDemented';
        case 'MildDemented':
            return 'MildDemented';
        case 'ModerateDemented':
            return 'ModerateDemented';
        default:
            return 'NonDemented';
    }
};

export const diagnosisToNumeric = (diagnosis: Patient['diagnosis']): number => {
    switch (diagnosis) {
        case 'NonDemented':
            return 0;
        case 'VeryMildDemented':
            return 1;
        case 'MildDemented':
            return 2;
        case 'ModerateDemented':
            return 3;
        default:
            return 0;
    }
};

export const numericToDiagnosis = (value: number): Patient['diagnosis'] => {
    switch (value) {
        case 0:
            return 'NonDemented';
        case 1:
            return 'VeryMildDemented';
        case 2:
            return 'MildDemented';
        case 3:
            return 'ModerateDemented';
        default:
            return 'NonDemented';
    }
};

export const diagnosisLabels: Record<Patient['diagnosis'], string> = {
    'NonDemented': 'Sense demència',
    'VeryMildDemented': 'Demència molt lleu',
    'MildDemented': 'Demència lleu',
    'ModerateDemented': 'Demència moderada',
};

export const genderLabels: Record<'M' | 'F', string> = {
    'M': 'Home',
    'F': 'Dona',
};

export const handLabels: Record<'R' | 'L', string> = {
    'R': 'Dretà',
    'L': 'Esquerrà',
};

export const educationLabels: Record<number, string> = {
    0: 'Sense educació formal',
    1: 'Primària incompleta',
    2: 'Primària completa',
    3: 'Secundària',
    4: 'Universitària',
    5: 'Postgrau',
};

export const sesLabels: Record<number, string> = {
    1: 'Molt alt',
    2: 'Alt',
    3: 'Mitjà',
    4: 'Baix',
    5: 'Molt baix',
};

export const CONSTANTS = {
    MMSE_MIN: 0,
    MMSE_MAX: 30,
    MMSE_NORMAL_THRESHOLD: 27, // Per sota de 27 pot indicar deteriorament
    
    CDR_MIN: 0,
    CDR_MAX: 3,
    CDR_THRESHOLDS: {
        NORMAL: 0,
        VERY_MILD: 0.5,
        MILD: 1,
        MODERATE: 2,
        SEVERE: 3,
    },
    
    EDUCATION_MIN: 0,
    EDUCATION_MAX: 5,
    
    SES_MIN: 1,
    SES_MAX: 5,
    
    NWBV_TYPICAL_MIN: 0.65,
    NWBV_TYPICAL_MAX: 0.85,
    
    AGE_MIN: 18,
    AGE_MAX: 96,
};

export interface PatientStats {
    total: number;
    demented: number;
    dementiaRate: number;
    avgAge: number;
    avgMMSE: number;
    avgNWBV: number;
    femaleCount: number;
    maleCount: number;
}

export interface PatientFilters {
    gender?: 'M' | 'F' | null;
    diagnosis?: Patient['diagnosis'] | null;
    ageMin?: number;
    ageMax?: number;
    educationMin?: number;
    educationMax?: number;
}

export const filterPatients = (patients: Patient[], filters: PatientFilters): Patient[] => {
    return patients.filter(patient => {
        if (filters.gender && patient.gender !== filters.gender) return false;
        if (filters.diagnosis && patient.diagnosis !== filters.diagnosis) return false;
        if (filters.ageMin && patient.age < filters.ageMin) return false;
        if (filters.ageMax && patient.age > filters.ageMax) return false;
        if (filters.educationMin && (patient.education === null || patient.education < filters.educationMin)) return false;
        if (filters.educationMax && (patient.education === null || patient.education > filters.educationMax)) return false;
        return true;
    });
};

export const calculateStats = (patients: Patient[]): PatientStats => {
    const demented = patients.filter(p => p.diagnosis !== 'NonDemented').length;
    const withMMSE = patients.filter(p => p.mmse !== null);
    const females = patients.filter(p => p.gender === 'F').length;
    
    return {
        total: patients.length,
        demented,
        dementiaRate: patients.length > 0 ? Math.round((demented / patients.length) * 100) : 0,
        avgAge: patients.length > 0 
            ? Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length) 
            : 0,
        avgMMSE: withMMSE.length > 0
            ? Math.round((withMMSE.reduce((sum, p) => sum + (p.mmse || 0), 0) / withMMSE.length) * 10) / 10
            : 0,
        avgNWBV: patients.length > 0
            ? Math.round((patients.reduce((sum, p) => sum + p.nWBV, 0) / patients.length) * 1000) / 1000
            : 0,
        femaleCount: females,
        maleCount: patients.length - females,
    };
};