import { useState, useEffect } from 'react';
import type { AppState } from '../types';
import { initialAppState } from '../data/mockData';

const STORAGE_KEY = 'circuits-lab-state';

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        parsed.circuits = parsed.circuits.map((circuit: any) => ({
          ...circuit,
          createdAt: new Date(circuit.createdAt),
          updatedAt: new Date(circuit.updatedAt),
        }));
        parsed.diagnosticLogs = parsed.diagnosticLogs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
        return parsed;
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
    }
    return initialAppState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, [state]);

  return [state, setState] as const;
}
