import { Api, DatacenterOrder } from '../api/Api';


export const handleDeleteService = async (
  draftOrderId: number | string,
  datacenterServiceId: string,
  setOrderDetails: React.Dispatch<React.SetStateAction<DatacenterOrder | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
): Promise<void> => {
  if (!draftOrderId) {
    setError('ID заказа отсутствует.');
    return;
  }

  const api = new Api();

  try {
    // Удаляем товар из заказа
    await api.datacenterOrdersServices.datacenterOrdersServicesDatacenterServicesDeleteDelete(
      draftOrderId.toString(),
      datacenterServiceId,
      { withCredentials: true }
    );

    // Обновляем данные заказа после удаления товара
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
      datacenters,
    });

    setError(null);
    alert('Товар успешно удален из заказа!');
  } catch (err) {
    setError('Ошибка при удалении товара');
    console.error('Ошибка:', err);
  }
};