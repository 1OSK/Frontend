// src/api.tsx

import { dest_api } from "./target_config";

// Определение типа для фильтров, если не определено в другом месте
interface FilterPropWithQueue {
  filterName: string;
  filterValue: string;
}

// Функция для получения фильтров по заголовку
export const getFiltersByTitle = async (title = ''): Promise<FilterPropWithQueue[]> => {
  try {
    const response = await fetch(dest_api + '/filters?' + new URLSearchParams({ title: title }), {
      method: "GET",
      credentials: 'include',  // Для работы с куками, если нужно
    });

    if (!response.ok) {
      throw new Error(`Ошибка при запросе фильтров: ${response.statusText}`);
    }

    const data: FilterPropWithQueue[] = await response.json();
    return data;
    
  } catch (error) {
    console.error('Ошибка при получении фильтров:', error);
    throw error;  // Пробрасываем ошибку дальше
  }
};