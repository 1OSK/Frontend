import { Api, DatacenterOrder } from '../api/Api';
const api = new Api();

export const loadOrders = async (sessionId: string | undefined, setOrders: (orders: DatacenterOrder[]) => void, setError: (error: string | null) => void, setLoading: (loading: boolean) => void) => {
  if (!sessionId) {
    setError('Необходимо авторизоваться');
    return;
  }

  setLoading(true);
  setError(null);

  try {
    // Устанавливаем sessionId в куки
    document.cookie = `sessionid=${sessionId}; path=/`; // Сохраняем sessionId в куки для передачи с запросом

    // Параметры запроса
    const queryParams = {
      datacenter_status: '', // Фильтр по статусу
      datacenter_start_date: '', // Начальная дата
      datacenter_end_date: '',   // Конечная дата
    };

    // Загружаем список всех заказов с параметрами фильтрации
    const response = await api.datacenterOrders.datacenterOrdersList(queryParams, {
      withCredentials: true,  // Указываем, что сессия (куки) передается с запросом
    });

    // Логируем полный ответ от API
    console.log('Полученный ответ от API:', response);

    // Если заказов нет, просто передаем пустой массив в setOrders
    if (!response.data || response.data.length === 0) {
      setOrders([]);  // Пустой список заказов
      return;
    }

    // Просто передаем данные как есть, используя типы из интерфейсов
    const ordersData: DatacenterOrder[] = response.data;

    // Логируем, как выглядит data после преобразования
    console.log('Полученные данные заказов:', ordersData);

    setOrders(ordersData);  // Сохраняем данные в состояние
  } catch (err) {
    setError('Ошибка при загрузке списка заказов');
    console.error('Ошибка загрузки:', err);
  } finally {
    setLoading(false);
  }
};