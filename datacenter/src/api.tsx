// api.tsx

import { dest_api } from "../target_config"; // Импортируем настройки

// Интерфейс для фильтров
interface Filter {
  id: number;
  name: string;
  // Здесь можно добавить другие свойства, если они есть
}

// Тип для массива фильтров
type FilterPropWithQueue = Filter[];

// Функция для получения фильтров по заголовку
export const getFiltersByTitle = async (title = ''): Promise<FilterPropWithQueue> => {
  const response = await fetch(dest_api + '/filters?' + new URLSearchParams({ title: title }), {
    method: "GET",
    credentials: 'include'
  });

  // Проверяем на успешный ответ от сервера
  if (!response.ok) {
    throw new Error('Ошибка при получении фильтров');
  }

  // Возвращаем данные в формате JSON
  return response.json();
};