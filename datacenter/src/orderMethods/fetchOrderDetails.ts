import { Api } from "../api/Api";  // Импортируем класс API
import { Dispatch, SetStateAction } from "react";

// Вынесенная функция для загрузки данных заказа
export const fetchOrderDetails = async (
  sessionId: string,
  draftOrderId: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>,
  setOrderDetails: Dispatch<SetStateAction<any>>, // Типизируйте в зависимости от структуры данных заказа
  setDeliveryAddress: Dispatch<SetStateAction<string>>,
  setDeliveryTime: Dispatch<SetStateAction<Date | null>>
) => {
  if (!sessionId || !draftOrderId) {
    setError('Необходимо авторизоваться и получить ID заказа.');
    return;
  }

  setLoading(true);
  setError(null);

  const api = new Api();

  try {
    document.cookie = `sessionid=${sessionId}; path=/; SameSite=Strict`;

    const response = await api.datacenterOrders.datacenterOrdersRead(draftOrderId.toString(), {
      withCredentials: true,
    });

    const { id, status, creation_date, formation_date, completion_date, creator_name, moderator_name, delivery_address, delivery_time, total_price, datacenters } = response.data;

    setOrderDetails({
      id,
      status,
      creation_date,
      formation_date,
      completion_date,
      creator_name,
      moderator_name,
      delivery_address,
      delivery_time,
      total_price,
      datacenters,
    });

    setDeliveryAddress(delivery_address || '');
    setDeliveryTime(delivery_time ? new Date(delivery_time) : null);
  } catch (err) {
    setError('Ошибка при загрузке данных заказа');
    console.error('Ошибка:', err);
  } finally {
    setLoading(false);
  }
};