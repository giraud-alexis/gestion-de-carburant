import { useEffect } from 'react';

export function useModalFocus(isOpen: boolean, selector: string = 'input[type="text"], input[type="number"], select') {
  useEffect(() => {
    if (!isOpen) return;

    const focusElement = () => {
      const element = document.querySelector(selector) as HTMLInputElement | HTMLSelectElement;
      if (element) {
        // Force focus multiple times for Electron
        element.focus();
        element.click();
        
        // Additional focus attempt after a short delay
        setTimeout(() => {
          element.focus();
          element.click();
        }, 50);
      }
    };

    // Multiple attempts to ensure focus works in Electron
    requestAnimationFrame(() => {
      focusElement();
      
      // Additional attempt after animation frame
      setTimeout(focusElement, 100);
      setTimeout(focusElement, 200);
    });

    // Cleanup function
    return () => {
      // No cleanup needed
    };
  }, [isOpen, selector]);
}