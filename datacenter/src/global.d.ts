// datacenter/src/global.d.ts

interface Tauri {
  invoke: (command: string, params: Record<string, any>) => Promise<any>;
  // Можете добавить другие методы, если необходимо
}

declare global {
  interface Window {
    __TAURI__?: {
      tauri: Tauri;
    };
  }
}

export {}; // Этот экспорт необходим для правильной работы TypeScript с глобальными типами