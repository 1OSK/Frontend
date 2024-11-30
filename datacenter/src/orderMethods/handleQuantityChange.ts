// src/orderMethods/handleQuantityChange.ts

import { Api } from '../api/Api';

export const handleQuantityChange = async (
  draftOrderId: number | null,
  datacenterServiceId: string,
  newQuantity: number,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setOrderDetails: React.Dispatch<React.SetStateAction<any>>
): Promise<void> => {
  if (!datacenterServiceId || newQuantity <= 0) {
    setError('Количество должно быть больше нуля.');
    return;
  }

  if (draftOrderId === null) {
    setError('ID заказа отсутствует.');
    return;  // Выход из функции, если draftOrderId равно null
  }

  const api = new Api();

  try {
    // Обновляем количество товара через API
    await api.datacenterOrdersServices.datacenterOrdersServicesDatacenterServicesUpdateUpdate(
      draftOrderId.toString(),  // Теперь проверяем, что draftOrderId не null
      datacenterServiceId,
      { quantity: newQuantity },
      { withCredentials: true }
    );

    // Обновляем данные заказа после изменения количества товара
    const response = await api.datacenterOrders.datacenterOrdersRead(draftOrderId.toString(), {
      withCredentials: true,
    });

    setOrderDetails(response.data);
    setError(null);
    
  } catch (err) {
    setError('Ошибка при обновлении количества товара');
    console.error('Ошибка:', err);
  }
};