import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import { RootState } from '../store';
import { Api, DatacenterOrder } from '../api/Api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; 
import { FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const defaultImageUrl = '/images/default.png';

const formatTime = (time: Date | string | null) => {
    if (!time) return 'Не выбрано';
    
    // Преобразуем строку в объект Date, если это строка
    const date = typeof time === 'string' ? new Date(time) : time;
    
    if (isNaN(date.getTime())) return 'Некорректная дата';
    
    return date.toLocaleString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  

const OrderDetailDatacenter = () => {
  const sessionId = useSelector((state: RootState) => state.auth.sessionId);
  const draftOrderId = useSelector((state: RootState) => state.ourData.draftOrderId);

  const [orderDetails, setOrderDetails] = useState<DatacenterOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryTime, setDeliveryTime] = useState<Date | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);  // Для отслеживания количества товара

  const api = new Api();

  useEffect(() => {
    if (!sessionId || !draftOrderId) {
      setError('Необходимо авторизоваться и получить ID заказа.');
      return;
    }

    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);

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

    fetchOrderDetails();
  }, [sessionId, draftOrderId]);

  const handleSubmitOrder = async () => {
    if (!draftOrderId) {
      setError('ID заказа отсутствует.');
      return;
    }
  
    if (!deliveryAddress || !deliveryTime) {
      setError('Пожалуйста, заполните все поля: адрес и время доставки.');
      return;
    }
  
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
      setOrderDetails(response.data);  // или response.data, если API возвращает актуальные данные
  
      setError(null);
      alert('Заказ успешно обновлен и подтвержден!');
    } catch (err) {
      setError('Ошибка при обновлении или подтверждении заказа');
      console.error('Ошибка:', err);
    }
  };

  const handleDeleteService = async (datacenterServiceId: string) => {
    if (!draftOrderId) {
      setError('ID заказа отсутствует.');
      return;
    }

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

  const handleQuantityChange = async (datacenterServiceId: string, newQuantity: number) => {
    if (!datacenterServiceId || newQuantity <= 0) {
      setError('Количество должно быть больше нуля.');
      return;
    }
  
    if (draftOrderId === null) {
      setError('ID заказа отсутствует.');
      return;  // Выход из функции, если draftOrderId равно null
    }
  
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
      alert('Количество товара успешно обновлено!');
    } catch (err) {
      setError('Ошибка при обновлении количества товара');
      console.error('Ошибка:', err);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setDeliveryTime(date);
  };

  return (
    <div>
      <Navbar />
      <Breadcrumb 
        items={[
          { label: "Главная", path: "/" },
          { label: "Услуги дата-центра", path: "/datacenter-services" },
          { label: `Заказ #${draftOrderId}`, path: `/datacenter-orders/${draftOrderId}` }
        ]}
      />

      {loading && <div>Загрузка...</div>}
      {error && <div className="error-message">{error}</div>}
      {(!orderDetails || error) && !loading && <div>Данные заказа недоступны</div>}

      {orderDetails && !loading && !error && (
        <div>
          <h1>Детали заказа</h1>
          <div>
      <p>Статус: {orderDetails.status}</p>
      <p>Дата создания: {formatTime(orderDetails.creation_date || null)}</p>
      {orderDetails.formation_date && <p>Дата формирования: {formatTime(orderDetails.formation_date)}</p>}
      {orderDetails.completion_date && <p>Дата завершения: {formatTime(orderDetails.completion_date)}</p>}
      <p>Сумма: {orderDetails.total_price}</p>
      {orderDetails.delivery_address && <p>Адрес доставки: {orderDetails.delivery_address}</p>}
      {orderDetails.delivery_time && <p>Время доставки: {formatTime(orderDetails.delivery_time)}</p>}
    </div>

          <h2>Редактировать данные</h2>
          <div>
            <label>
              Адрес доставки:
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Введите адрес доставки"
              />
            </label>
            <br />
            <label>
              Время доставки:
              <div style={{ position: 'relative' }}>
                <FaCalendarAlt 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    fontSize: '20px',
                  }}
                  onClick={() => document.getElementById('datepicker')?.click()}
                />
                <DatePicker
                  id="datepicker"
                  selected={deliveryTime}
                  onChange={handleDateChange}
                  showTimeSelect
                  timeIntervals={15}
                  dateFormat="Pp"
                  placeholderText="Выберите время доставки"
                  customInput={<div />}
                />
              </div>
            </label>
            <div>
              <strong>Выбранное время:</strong> {formatTime(deliveryTime)}
            </div>
            <br />
            <button onClick={handleSubmitOrder}>Подтвердить заказ</button>
          </div>

          <h2>Услуги</h2>
          {orderDetails.datacenters && orderDetails.datacenters.length > 0 ? (
            orderDetails.datacenters.map((service, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <p>Услуга ID: {service.service?.id}</p>
                <p>Название: {service.service?.name}</p>
                <p>Описание: {service.service?.description}</p>
                <p>Цена: {service.service?.price}</p>
                <p>Количество: {service.quantity}</p>

                <div>
                <img
                    src={service.service?.image_url || defaultImageUrl} 
                    alt={service.service?.name}
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = defaultImageUrl; 
                    }}
                  />
                </div>

                <label>
                  Изменить количество:
                  <input
                    type="number"
                    value={quantity || ''}
                    min="1"
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </label>
                <button onClick={() => handleQuantityChange(service.service?.id?.toString() || '', quantity || 1)}>Обновить количество</button>

                <button onClick={() => handleDeleteService(service.service?.id?.toString() || '')}>Удалить</button>
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