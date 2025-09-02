import { useEffect } from 'react';

// Détection de l'environnement Electron
const isElectron = () => {
  return typeof window !== 'undefined' && 
         window.process && 
         window.process.type === 'renderer';
};

export function useModalFocus(isOpen: boolean, selector: string = 'input[type="text"], input[type="number"], select') {
  useEffect(() => {
    if (!isOpen) return;

    const focusElement = () => {
      const element = document.querySelector(selector) as HTMLInputElement | HTMLSelectElement;
      if (element) {
        // Approche spécifique pour Electron
        element.focus();
        
        if (isElectron()) {
          // Dans Electron, on doit parfois déclencher des événements manuellement
          element.click();
          element.dispatchEvent(new Event('focus', { bubbles: true }));
          element.dispatchEvent(new Event('click', { bubbles: true }));
        }
        
        // Tentatives supplémentaires avec délais
        setTimeout(() => {
          element.focus();
          if (isElectron()) {
            element.click();
            element.dispatchEvent(new Event('focus', { bubbles: true }));
          }
        }, 50);
        
        setTimeout(() => {
          element.focus();
          if (isElectron()) {
            element.click();
          }
        }, 150);
      }
    };

    // Tentatives multiples pour assurer le focus dans Electron
    requestAnimationFrame(() => {
      focusElement();
      
      // Tentatives supplémentaires après l'animation frame
      setTimeout(focusElement, 100);
      setTimeout(focusElement, 200);
      setTimeout(focusElement, 300);
    });

    // Fonction de nettoyage
    return () => {
      // Pas de nettoyage nécessaire
    };
  }, [isOpen, selector]);
}