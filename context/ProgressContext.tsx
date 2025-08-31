import ProgressManager from '@/services/progress/ProgressManager';
import { createContext, useContext, useEffect, useState } from 'react';

interface ProgressContextType {
  progressManager: ProgressManager | null;
  initializeProgressManager: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType>({
  progressManager: null,
  initializeProgressManager: async () => {},
});

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progressManager, setProgressManager] = useState<ProgressManager | null>(null);

  useEffect(() => {
    const initialize = async () => {
      const manager = new ProgressManager();
      await manager.initialize();
      setProgressManager(manager);
    };

    initialize();
  }, []);

  const initializeProgressManager = async () => {
    if (!progressManager) {
      const manager = new ProgressManager();
      await manager.initialize();
      setProgressManager(manager);
    }
  };

  const value: ProgressContextType = {
    progressManager,
    initializeProgressManager,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
