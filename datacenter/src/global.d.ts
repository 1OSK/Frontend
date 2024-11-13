// Типизация для глобального окна
interface Tauri {
    invoke: (command: string, params: Record<string, any>) => Promise<any>;
    // Добавьте другие методы, если необходимо
  }
  
  interface Window {
    __TAURI__?: {
      tauri: Tauri;
    };
  }