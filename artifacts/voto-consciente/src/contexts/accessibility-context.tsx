import React, { createContext, useContext, useEffect, useState } from 'react';

type FontSize = 'normal' | 'large' | 'xlarge';

interface AccessibilityContextType {
  fontSize: FontSize;
  highContrast: boolean;
  setFontSize: (size: FontSize) => void;
  setHighContrast: (contrast: boolean) => void;
  cycleFontSize: () => void;
  toggleContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('accessibility_fontSize') as FontSize) || 'normal';
  });
  
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('accessibility_highContrast') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('accessibility_fontSize', fontSize);
    document.documentElement.setAttribute('data-fontsize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('accessibility_highContrast', String(highContrast));
    if (highContrast) {
      document.documentElement.setAttribute('data-contrast', 'high');
    } else {
      document.documentElement.removeAttribute('data-contrast');
    }
  }, [highContrast]);

  const cycleFontSize = () => {
    setFontSize(prev => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'xlarge';
      return 'normal';
    });
  };

  const toggleContrast = () => {
    setHighContrast(prev => !prev);
  };

  return (
    <AccessibilityContext.Provider value={{ fontSize, highContrast, setFontSize, setHighContrast, cycleFontSize, toggleContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
}
