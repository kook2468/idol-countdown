import { createContext, ReactNode, useContext, useState } from 'react';
import { LimitReason } from '../shared/feature/featureGate';

interface ProModalContextType {
  showProModal: (reason?: LimitReason) => void;
  hideProModal: () => void;
  isOpen: boolean;
  limitReason: LimitReason;
}

const ProModalContext = createContext<ProModalContextType | undefined>(undefined);

export function ProModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [limitReason, setLimitReason] = useState<LimitReason>(null);

  const showProModal = (reason: LimitReason = null) => {
    setLimitReason(reason);
    setIsOpen(true);
  };

  const hideProModal = () => {
    setIsOpen(false);
    setLimitReason(null);
  };

  return (
    <ProModalContext.Provider value={{ showProModal, hideProModal, isOpen, limitReason }}>
      {children}
    </ProModalContext.Provider>
  );
}

export function useProModal() {
  const context = useContext(ProModalContext);
  if (!context) {
    throw new Error('useProModal must be used within ProModalProvider');
  }
  return context;
}
