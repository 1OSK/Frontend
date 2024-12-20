import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { loadOrders } from '../orderMethods/loadOrders'; // Assuming this function loads order list
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import '../assets/style.css';
import { DatacenterOrder } from '../api/Api';
import React from 'react';

const defaultImageUrl = '/images/default.png';

const OrderListDatacenter = () => {
    const sessionId = useSelector((state: RootState) => state.auth.sessionId);
    const [orders, setOrders] = useState<DatacenterOrder[]>([]);
    const [expandedOrders, setExpandedOrders] = useState<{ [key: number]: boolean }>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    useEffect(() => {
        if (sessionId) {
            loadOrders(sessionId, setOrders, setError, setLoading);
        } else {
            setError('Необходимо авторизоваться');
        }
    }, [sessionId]);

    const handleToggle = (orderId: number) => {
        setExpandedOrders((prevState) => ({
            ...prevState,
            [orderId]: !prevState[orderId],
        }));
    };

    const formatTime = (dateString: string | null) => {
        if (!dateString) return 'Не указана';
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="order-list-container">
            <Navbar />
            <Breadcrumb
                items={[
                    { label: 'Главная', path: '/' },
                    { label: 'Список заказов', path: '/datacenter-orders/' },
                ]}
            />

            {!isAuthenticated ? (
                <div className="unauthorized-message">Пожалуйста, авторизуйтесь, чтобы увидеть заказы.</div>
            ) : (
                <>
                    <h3 className="order-list-header">Список заказов:</h3>
                    {orders.length > 0 ? (
                        <div className="order-table">
                        {/* Заголовок таблицы */}
                        <div className="order-header">
                            <div>№ Заказа</div>
                            <div>Статус</div>
                            <div>Дата создания</div>
                            <div>Дата формирования</div>
                            <div>Дата завершения</div>
                            <div>Адрес доставки</div>
                            <div>Время доставки</div>
                            <div>Сумма</div>
                            <div> </div>
                        </div>
    
                        {/* Строки таблицы */}
                        {orders.map((order) => (
                            <div className="order-row" key={order.id}>
                                <div>Заказ #{order.id}</div>
                                <div>
                                    {order.status === 'draft'
                                        ? 'Черновик'
                                        : order.status === 'deleted'
                                        ? 'Удален'
                                        : order.status === 'formed'
                                        ? 'Сформирован'
                                        : order.status === 'completed'
                                        ? 'Завершен'
                                        : 'Отклонен'}
                                </div>
                                <div>{formatTime(order.creation_date || null)}</div>
                                <div>{order.formation_date ? formatTime(order.formation_date) : 'Не указана'}</div>
                                <div>{order.completion_date ? formatTime(order.completion_date) : 'Не указана'}</div>
                                <div>{order.delivery_address || 'Не указан'}</div>
                                <div>{order.delivery_time ? formatTime(order.delivery_time) : 'Не указана'}</div>
                                <div>{order.total_price !== undefined ? `${order.total_price} руб.` : 'Не указана'}</div>
                                <div>
                                    <button className="toggle-button">
                                        <Link to={`/datacenter-orders/${order.id}`} className="link-inside-button no-blue-link">
                                            Подробности
                                        </Link>
                                    </button>
                                </div>
                                    {order.id !== undefined && expandedOrders[order.id] && order.datacenters?.length === 0 && (
                                        <div className="order-card-no-items">Нет товаров в заказе</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Заказы отсутствуют</p>
                    )}
                </>
            )}
        </div>
    );
};

export default OrderListDatacenter;