import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import { RootState } from '../store';
import { Api, DatacenterOrder } from '../api/Api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; 
import { FaCalendarAlt } from 'react-icons/fa';

const formatTime = (time: Date | null) => {
  if (!time) return 'Не выбрано';
  return time.toLocaleString('ru-RU', {
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

    // Сначала обновляем данные заказа (адрес и время)
    try {
      const updatedOrder = {
        ...orderDetails,
        delivery_address: deliveryAddress ? deliveryAddress : null,
        delivery_time: deliveryTime ? deliveryTime.toISOString() : null,
      };

      const response = await api.datacenterOrders.datacenterOrdersUpdateUpdate(draftOrderId.toString(), updatedOrder, {
        withCredentials: true,
      });

      // После успешного обновления, подтверждаем заказ
      await api.datacenterOrders.datacenterOrdersSubmitUpdate(draftOrderId.toString(), {
        withCredentials: true,
      });

      setOrderDetails(updatedOrder);
      setError(null);
      alert('Заказ успешно обновлен и подтвержден!');
    } catch (err) {
      setError('Ошибка при обновлении или подтверждении заказа');
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
            <p>Дата создания: {orderDetails.creation_date}</p>
            {orderDetails.formation_date && <p>Дата формирования: {orderDetails.formation_date}</p>}
            {orderDetails.completion_date && <p>Дата завершения: {orderDetails.completion_date}</p>}
            <p>Сумма: {orderDetails.total_price}</p>
            {orderDetails.delivery_address && <p>Адрес доставки: {orderDetails.delivery_address}</p>}
            {orderDetails.delivery_time && <p>Время доставки: {new Date(orderDetails.delivery_time).toLocaleString()}</p>}
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