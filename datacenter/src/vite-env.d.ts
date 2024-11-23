/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_TARGET_TAURI: string; // или 'boolean', если вы хотите работать с булевыми значениями
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }