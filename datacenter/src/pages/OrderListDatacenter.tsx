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
                        <table className="order-table">
                            <thead>
                                <tr>
                                    <th>№ Заказа</th>
                                    <th>Статус</th>
                                    <th>Дата создания</th>
                                    <th>Дата формирования</th>
                                    <th>Дата завершения</th>
                                    <th>Адрес доставки</th>
                                    <th>Время доставки</th>
                                    <th>Сумма</th>
                                    <th>Услуги</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <React.Fragment key={order.id}>
                                        <tr>
                                            <td
                                                onClick={() => {
                                                    if (order.id !== undefined) {
                                                        handleToggle(order.id);
                                                    }
                                                }}
                                                className="order-table-cell clickable"
                                            >
                                                Заказ #{order.id}
                                            </td>
                                            <td className="order-table-cell">{order.status}</td>
                                            <td className="order-table-cell">{formatTime(order.creation_date || null)}</td>
                                            <td className="order-table-cell">
                                                {order.formation_date ? formatTime(order.formation_date) : 'Не указана'}
                                            </td>
                                            <td className="order-table-cell">
                                                {order.completion_date ? formatTime(order.completion_date) : 'Не указана'}
                                            </td>
                                            <td className="order-table-cell">{order.delivery_address || 'Не указан'}</td>
                                            <td className="order-table-cell">
                                                {order.delivery_time ? formatTime(order.delivery_time) : 'Не указана'}
                                            </td>
                                            <td className="order-table-cell">
                                                {order.total_price !== undefined ? order.total_price : 'Не указана'}
                                            </td>
                                            <td className="order-table-cell">
                                            <button className="toggle-button">
                                                <Link to={`/datacenter-orders/${order.id}`} className="link-inside-button no-blue-link">
                                                    Подробности заказа
                                                </Link>
                                                </button>
                                            </td>
                                        </tr>

                                        {order.id !== undefined && expandedOrders[order.id] && order.datacenters?.length === 0 && (
                                            <tr key={`no-services-${order.id}`}>
                                                <td colSpan={9} className="service-row-cell">Нет услуг в заказе</td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Заказы отсутствуют</p>
                    )}
                </>
            )}
        </div>
    );
};

export default OrderListDatacenter;