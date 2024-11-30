import { Api, DatacenterOrder } from '../api/Api';

export const handleSubmitOrder = async (
  draftOrderId: number | string,
  deliveryAddress: string,
  deliveryTime: Date | null,
  orderDetails: DatacenterOrder | null,
  setOrderDetails: React.Dispatch<React.SetStateAction<DatacenterOrder | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
): Promise<void> => {
  if (!draftOrderId) {
    setError('ID заказа отсутствует.');
    return;
  }

  if (!deliveryAddress || !deliveryTime) {
    setError('Пожалуйста, заполните все поля: адрес и время доставки.');
    return;
  }

  const api = new Api();

  try {
    // Создаем объект для обновления данных заказа
    const updatedOrder = {
      ...orderDetails,
      delivery_address: deliveryAddress ? deliveryAddress : null,
      delivery_time: deliveryTime ? deliveryTime.toISOString() : null,
    };

    // Обновляем заказ
    const responseUpdate = await api.datacenterOrders.datacenterOrdersUpdateUpdate(draftOrderId.toString(), updatedOrder, {
      withCredentials: true,
    });

    // Подтверждаем заказ
    const responseSubmit = await api.datacenterOrders.datacenterOrdersSubmitUpdate(draftOrderId.toString(), {
      withCredentials: true,
    });

    // После успешного обновления и подтверждения, получаем актуальные данные заказа
    const response = await api.datacenterOrders.datacenterOrdersRead(draftOrderId.toString(), {
      withCredentials: true,
    });

    // Обновляем состояние с новыми данными заказа
    setOrderDetails(response.data);

    setError(null);
    
  } catch (err) {
    setError('Ошибка при обновлении или подтверждении заказа');
    console.error('Ошибка:', err);
  }
};