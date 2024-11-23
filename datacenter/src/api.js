// src/api.tsx
import { dest_api } from "./target_config";
// Функция для получения фильтров по заголовку
export const getFiltersByTitle = async (title = '') => {
    try {
        const response = await fetch(dest_api + '/filters?' + new URLSearchParams({ title: title }), {
            method: "GET",
            credentials: 'include', // Для работы с куками, если нужно
        });
        if (!response.ok) {
            throw new Error(`Ошибка при запросе фильтров: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Ошибка при получении фильтров:', error);
        throw error; // Пробрасываем ошибку дальше
    }
};
