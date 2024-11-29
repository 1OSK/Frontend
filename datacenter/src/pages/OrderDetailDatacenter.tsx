import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import { RootState } from '../store';
import { Api, DatacenterOrder } from '../api/Api';

const OrderDetailDatacenter = () => {
  // Получаем sessionId и draftOrderId из Redux
  const sessionId = useSelector((state: RootState) => state.auth.sessionId);
  const draftOrderId = useSelector((state: RootState) => state.ourData.draftOrderId);

  const [orderDetails, setOrderDetails] = useState<DatacenterOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setError('Вы не авторизованы.');
        return;
      }

      if (!draftOrderId) {
        setError('ID заказа отсутствует.');
        return;
      }

      // Установка session_id в куки
      document.cookie = `sessionid=${sessionId}; path=/; SameSite=Strict`;

      setLoading(true);
      setError(null);

      try {
        const api = new Api();
        // Запрос к API
        const response = await api.datacenterOrders.datacenterOrdersRead(draftOrderId.toString(), {
          withCredentials: true,
        });

        console.log('Ответ сервера:', response.data);

        // Извлекаем данные из ответа сервера
        const { id, status, creation_date, formation_date, completion_date, creator_name, moderator_name, delivery_address, delivery_time, total_price, datacenters } = response.data;

        // Устанавливаем данные заказа в состояние
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
      } catch (err) {
        setError('Ошибка при загрузке данных заказа');
        console.error('Ошибка:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId, draftOrderId]);

  return (
    <div>
      {/* Навигация (Navbar) и хлебные крошки */}
      <Navbar />
      <Breadcrumb 
        items={[
          { label: "Главная", path: "/" },
          { label: "Услуги дата-центра", path: "/datacenter-services" },
          { label: `Заказ #${draftOrderId}`, path: `/datacenter-orders/${draftOrderId}` }
        ]}
      />

      {/* Ошибка или загрузка */}
      {loading && <div>Загрузка...</div>}
      {error && <div className="error-message">{error}</div>}
      {(!orderDetails || error) && !loading && <div>Данные заказа недоступны</div>}

      {/* Основное содержимое заказа */}
      {orderDetails && !loading && !error && (
        <div>
          <h1>Детали заказа</h1>
          <div>
            <p>Статус: {orderDetails.status}</p>
            <p>Дата создания: {orderDetails.creation_date}</p>
            {orderDetails.formation_date && <p>Дата формирования: {orderDetails.formation_date}</p>}
            {orderDetails.completion_date && <p>Дата завершения: {orderDetails.completion_date}</p>}
            <p>Сумма: {orderDetails.total_price}</p>
            {orderDetails.delivery_address && <p>Адрес доставки: {orderDetails.delivery_address}</p>}
            {orderDetails.delivery_time && <p>Время доставки: {orderDetails.delivery_time}</p>}
          </div>

          <h2>Услуги</h2>
          {orderDetails.datacenters && orderDetails.datacenters.length > 0 ? (
            orderDetails.datacenters.map((service, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <p>Услуга ID: {service.service?.id}</p> {/* ID услуги */}
                <p>Название: {service.service?.name}</p> {/* Название услуги */}
                <p>Описание: {service.service?.description}</p> {/* Описание услуги */}
                <p>Цена: {service.service?.price}</p> {/* Цена услуги */}
                <p>Количество: {service.quantity}</p> {/* Количество услуги */}

                {/* Добавляем картинку товара */}
                {service.service?.image_url && (
                  <div>
                    <img
                      src={service.service.image_url}
                      alt={service.service.name}
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Нет доступных услуг для данного заказа.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetailDatacenter;