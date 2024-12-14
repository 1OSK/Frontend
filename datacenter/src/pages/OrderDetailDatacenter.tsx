import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import { RootState } from '../store';
import { DatacenterOrder } from '../api/Api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; 
import { FaCalendarAlt } from 'react-icons/fa';
import { handleSubmitOrder } from '../orderMethods/handleSubmitOrder';
import { handleDeleteService } from '../orderMethods/handleDeleteService';
import { handleQuantityChange } from '../orderMethods/handleQuantityChange';
import { fetchOrderDetails } from '../orderMethods/fetchOrderDetails'; 
import '../assets/style.css';

const defaultImageUrl = '/images/default.png';

const formatTime = (time: Date | string | null) => {
  if (!time) return 'Не выбрано';
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
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [orderDetails, setOrderDetails] = useState<DatacenterOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryTime, setDeliveryTime] = useState<Date | null>(null);
  const [quantities, setQuantities] = useState<number[]>([]);

  const { pk } = useParams<{ pk: string }>();

  useEffect(() => {
    if (sessionId && pk) {
      fetchOrderDetails(
        sessionId,
        pk,
        setLoading,
        setError,
        setOrderDetails,
        setDeliveryAddress,
        setDeliveryTime
      );
    } else {
      setError('Не удалось получить ID заказа.');
    }
  }, [sessionId, pk]);

  const onSubmit = async () => {
    if (!pk) {
      setError('ID заказа не может быть пустым');
      return;
    }
    await handleSubmitOrder(pk, deliveryAddress, deliveryTime, orderDetails, setOrderDetails, setError);
  };

  const onDeleteService = async (datacenterServiceId: string) => {
    if (!pk) {
      setError('ID заказа не может быть пустым');
      return;
    }
    await handleDeleteService(pk, datacenterServiceId, setOrderDetails, setError);
  };

  const onQuantityChange = async (datacenterServiceId: string, newQuantity: number) => {
    if (!pk) {
      setError('ID заказа не может быть пустым');
      return;
    }

    const parsedOrderId = parseInt(pk, 10); // Преобразуем строку в число

    if (isNaN(parsedOrderId)) {
      setError('ID заказа должен быть числом');
      return;
    }

    await handleQuantityChange(parsedOrderId, datacenterServiceId, newQuantity, setError, setOrderDetails);
  };

  const handleDateChange = (date: Date | null) => {
    setDeliveryTime(date);
  };

  return (
    <div className="order-detail-container">
      <Navbar />
      <Breadcrumb 
        items={[
          { label: "Главная", path: "/" },
          { label: "Список товаров", path: "/datacenter-services" },
          { label: `Заказ #${pk}`, path: `/datacenter-orders/${pk}` }
        ]}
      />
      
      {/* Order Details Section */}
      {orderDetails && !loading && !error && (
        <div className="order-details-container">
          <h1 className="order-details-header">Детали заказа</h1>
          <div className="order-details-info">
            <p className="order-details-info-item">Статус: {orderDetails.status}</p>
            <p className="order-details-info-item">Дата создания: {formatTime(orderDetails.creation_date || null)}</p>
            {orderDetails.formation_date && (
              <p className="order-details-info-item">Дата формирования: {formatTime(orderDetails.formation_date)}</p>
            )}
            {orderDetails.completion_date && (
              <p className="order-details-info-item">Дата завершения: {formatTime(orderDetails.completion_date)}</p>
            )}
            <p className="order-details-info-item">Сумма: {orderDetails.total_price}</p>
            {orderDetails.delivery_address && (
              <p className="order-details-info-item">Адрес доставки: {orderDetails.delivery_address}</p>
            )}
            {orderDetails.delivery_time && (
              <p className="order-details-info-item">Время доставки: {formatTime(orderDetails.delivery_time)}</p>
            )}
          </div>

          {/* Дополнительный контент только для статуса "draft" */}
          {orderDetails.status === 'draft' && (
            <>
              {/* Услуги */}
              <h2 className="order-details-services-header">Товары</h2>
              {orderDetails.datacenters && orderDetails.datacenters.length > 0 ? (
                orderDetails.datacenters.map((service, index) => (
                  <div key={index} className="service-item-row">
                    <div className="service-image-wrapper">
                      <img
                        className="service-item-image"
                        src={service.service?.image_url || defaultImageUrl}
                        alt={service.service?.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = defaultImageUrl;
                        }}
                      />
                    </div>
                    <p className="service-item-name">{service.service?.name}</p>
                    <p className="service-item-quantity">Количество: {service.quantity}</p>
                    <div className="quantity-edit">
                      <input
                        className="quantity-input-field"
                        type="number"
                        value={quantities[index] || ''}
                        min="1"
                        onChange={(e) => {
                          const newQuantities = [...quantities];
                          newQuantities[index] = Number(e.target.value);
                          setQuantities(newQuantities);
                        }}
                        placeholder="Новое кол-во"
                      />
                      <button
                        className="update-quantity-btn"
                        onClick={() =>
                          onQuantityChange(
                            service.service?.id?.toString() || '',
                            quantities[index] || 1
                          )
                        }
                      >
                        Обновить
                      </button>
                    </div>
                    <button
                      className="delete-service-btn"
                      onClick={() => onDeleteService(service.service?.id?.toString() || '')}
                    >
                      Удалить
                    </button>
                  </div>
                ))
              ) : (
                <p>Нет доступных услуг для данного заказа.</p>
              )}

              {/* Форма для редактирования */}
              <h2 className="order-details-edit-header">Редактировать данные</h2>
              <div className="order-details-edit-form">
                <div className="input-container">
                  <label className="input-label">
                    Адрес доставки:
                    <input
                      className="address-input-field"
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Введите адрес доставки"
                    />
                  </label>
                </div>
                <div className="input-container">
                  <label className="input-label">
                    Время доставки:
                    <div className="datepicker-wrapper">
                      <FaCalendarAlt
                        className="datepicker-icon"
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
                </div>
                <div className="selected-time-display">
                  <strong>Выбранное время:</strong> {formatTime(deliveryTime)}
                </div>
              </div>
              <button className="confirm-order-btn" onClick={onSubmit}>Подтвердить заказ</button>
            </>
          )}

          {/* Отображение услуг только для статуса "completed" */}
          {orderDetails.status !== 'draft' && orderDetails.datacenters && (
            <>
              <h2 className="order-details-services-header">Товары</h2>
              {orderDetails.datacenters.map((service, index) => (
                <div key={index} className="service-item-row">
                  <div className="service-image-wrapper">
                    <img
                      className="service-item-image"
                      src={service.service?.image_url || defaultImageUrl}
                      alt={service.service?.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultImageUrl;
                      }}
                    />
                  </div>
                  <p className="service-item-name">{service.service?.name}</p>
                  <p className="service-item-quantity">Количество: {service.quantity}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Loading and Error Handling */}
      {loading && <div className="loading-message">Загрузка...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default OrderDetailDatacenter;