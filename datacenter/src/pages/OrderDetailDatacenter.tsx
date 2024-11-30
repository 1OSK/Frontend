import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import { RootState } from '../store';
import { Api, DatacenterOrder, DatacenterOrderService } from '../api/Api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; 
import { FaCalendarAlt } from 'react-icons/fa';
import { handleSubmitOrder } from '../orderMethods/handleSubmitOrder';
import { handleDeleteService } from '../orderMethods/handleDeleteService';
import { handleQuantityChange } from '../orderMethods/handleQuantityChange';
import { fetchOrderDetails } from '../orderMethods/fetchOrderDetails'; 
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


  const [orders, setOrders] = useState<DatacenterOrder[]>([]);
  const [orderDetails, setOrderDetails] = useState<DatacenterOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryTime, setDeliveryTime] = useState<Date | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);  // Для отслеживания количества товара

  const api = new Api();

  useEffect(() => {
    if (sessionId && draftOrderId) {
      fetchOrderDetails(
        sessionId, // Теперь sessionId точно string
        draftOrderId.toString(),
        setLoading,
        setError,
        setOrderDetails,
        setDeliveryAddress,
        setDeliveryTime
      );
      
    } else {
      setError('Необходимо авторизоваться и получить ID заказа.');
    }
  }, [sessionId, draftOrderId]);

  

  useEffect(() => {
    if (sessionId) {
      loadOrders(sessionId);
    }
  }, [sessionId]);
  
  const onSubmit = async () => {
    if (draftOrderId === null) {
      setError('ID заказа не может быть пустым');
      return;
    }
  
    await handleSubmitOrder(draftOrderId, deliveryAddress, deliveryTime, orderDetails, setOrderDetails, setError);
  };

  const onDeleteService = async (datacenterServiceId: string) => {
    if (draftOrderId === null) {
      setError('ID заказа не может быть пустым');
      return;
    }
    await handleDeleteService(draftOrderId, datacenterServiceId, setOrderDetails, setError);
  };

  const onQuantityChange = async (datacenterServiceId: string, newQuantity: number) => {
    if (draftOrderId === null) {
      setError('ID заказа не может быть пустым');
      return;
    }
  
    await handleQuantityChange(draftOrderId, datacenterServiceId, newQuantity, setError, setOrderDetails);
  };
  

  const handleDateChange = (date: Date | null) => {
    setDeliveryTime(date);
  };



  const loadOrders = async (sessionId: string | undefined) => {
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
  
      // Проверка, что данные есть
      if (!response.data || response.data.length === 0) {
        setError('Нет данных по заказам');
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
      <h3>Список заказов:</h3>
{orders.length > 0 ? (
  <ul>
    {orders.map((order) => (
      <li key={order.id}>
        {/* Отображаем общую информацию о заказе */}
        <p>Заказ #{order.id}</p>
        <p>Статус: {order.status}</p>
        <p>Дата создания: {formatTime(order.creation_date || null)}</p>
        {order.formation_date && <p>Дата формирования: {formatTime(order.formation_date)}</p>}
        {order.completion_date && <p>Дата завершения: {formatTime(order.completion_date)}</p>}
        <p>Адрес доставки: {order.delivery_address || 'Не указан'}</p>
        <p>Время доставки: {order.delivery_time || 'Не указано'}</p>
        <p>Сумма: {order.total_price !== undefined ? order.total_price : 'Не указана'}</p>

        {/* Отображаем товары (услуги) в заказе */}
        <h4>Услуги в заказе:</h4>
        {order.datacenters && order.datacenters.length > 0 ? (
          <ul>
            {order.datacenters.map((datacenter: DatacenterOrderService, index) => (
              <li key={index}>
                {/* Информация о каждой услуге */}
                <p>Услуга: {datacenter.service?.name || 'Не указано'}</p>
                <p>Описание: {datacenter.service?.description || 'Не указано'}</p>
                <p>Цена: {datacenter.service?.price || 'Не указана'}</p>
                <p>Количество: {datacenter.quantity || 'Не указано'}</p>

                {/* Проверка на изображение */}
                <div>
                  <img
                    src={datacenter.service?.image_url || defaultImageUrl}  // Используем defaultImageUrl, если нет изображения
                    alt={datacenter.service?.name || 'Услуга'}
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = defaultImageUrl;  // В случае ошибки показываем дефолтное изображение
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет услуг в заказе</p>
        )}
      </li>
    ))}
  </ul>
) : (
  <p>Заказы отсутствуют</p>
)}
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
            <button onClick={onSubmit}>Подтвердить заказ</button>
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
                <button onClick={() => onQuantityChange(service.service?.id?.toString() || '', quantity || 1)}>Обновить количество</button>

                <button onClick={() => onDeleteService(service.service?.id?.toString() || '')}>Удалить</button>
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