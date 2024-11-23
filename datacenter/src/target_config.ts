// src/target_config.ts

// Ручное переключение флага
const target_tauri = 'true';  // Установите значение 'true' или 'false' вручную для переключения режимов

// Логирование значения флага (для проверки)
console.log('target_tauri:', target_tauri);

// Настройки для проксирования в режиме разработки
export const api_proxy_addr = "http://127.0.0.1:8000";  // Адрес вашего API-сервера
export const img_proxy_addr = "http://127.0.0.1:9000";  // Адрес вашего сервера для изображений

// Переключение между режимами на основе значения target_tauri
export const dest_api = target_tauri === 'true' ? api_proxy_addr : "/datacenter-services";
export const dest_img = target_tauri === 'true' ? img_proxy_addr : "/img-proxy";
export const dest_root = target_tauri === 'true' ? "" : "/datacenter-services";  // Меняет базовый путь для приложения