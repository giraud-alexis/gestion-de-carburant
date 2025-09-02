/// <reference types="vite/client" />

// Types pour Electron
interface Window {
  process?: {
    type: string;
  };
}
