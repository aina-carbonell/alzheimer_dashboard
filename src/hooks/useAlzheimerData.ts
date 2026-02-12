import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Patient, parsePatient, PatientStats, calculateStats } from './patient';

interface UseAlzheimerDataReturn {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  stats: PatientStats;
}

export const useAlzheimerData = (): UseAlzheimerDataReturn => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Intentar carregar des de la ruta pública
        const response = await fetch('/data/oasis_dataset.csv');
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header: string) => header.trim(),
          complete: (results) => {
            try {
              if (!results.data || results.data.length === 0) {
                throw new Error('El fitxer CSV està buit');
              }

              // Convertir les files del CSV a objectes Patient
              const parsedPatients: Patient[] = results.data
                .map((row: any) => {
                  try {
                    return parsePatient(row);
                  } catch (err) {
                    console.warn('Error parsejant pacient:', row, err);
                    return null;
                  }
                })
                .filter((p): p is Patient => p !== null);

              if (parsedPatients.length === 0) {
                throw new Error('No s\'han pogut parsejar pacients del CSV');
              }

              console.log(`✅ Carregats ${parsedPatients.length} pacients correctament`);
              setPatients(parsedPatients);
              setLoading(false);
            } catch (parseError) {
              const message = parseError instanceof Error ? parseError.message : 'Error processant les dades';
              setError(message);
              setLoading(false);
            }
          },
          error: (err) => {
            const message = `Error llegint el CSV: ${err.message}`;
            console.error(message, err);
            setError(message);
            setLoading(false);
          }
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconegut carregant les dades';
        console.error('Error en loadData:', err);
        setError(message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calcular estadístiques amb la funció helper
  const stats = patients.length > 0 ? calculateStats(patients) : {
    total: 0,
    demented: 0,
    dementiaRate: 0,
    avgAge: 0,
    avgMMSE: 0,
    avgNWBV: 0,
    femaleCount: 0,
    maleCount: 0,
  };

  return { patients, loading, error, stats };
};