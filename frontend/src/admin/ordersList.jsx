
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/AdminStyles/OrdersList.css';
import { deleteOrder, fetchOrders, removeErrors, removeMessage, removeSucces } from '../features/admin/adminSlice';
import PageTitle from '../components/pageTitle';
import Footer from '../components/footer';
import NavBar from '../components/navBar';
import { toast } from 'react-toastify';
import Loader from '../components/loder';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';


function OrdersList() {
    const { success, loading, error, orders, message, deleting } = useSelector(state => state.admin);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(fetchOrders());

        return () => removeErrors();
    }, [dispatch])
    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
        }
        if (success && message) {
            toast.success(message, { position: 'top-center', autoClose: 3000 })
            dispatch(removeMessage());
            dispatch(removeSucces());
            navigate('/admin/dashboard');
        }
        if (success) {
            dispatch(removeSucces());
        }
    }, [success, error, dispatch, message])
    const deletOrderHandler = id => {
        const isConfirmed = window.confirm('Are You Sure You want To Delete this Order');
        if (!isConfirmed) return;
        dispatch(deleteOrder(id));

    }

    if (!loading && orders && orders.length === 0) {
        return (
            <>
                <PageTitle title={'Orders List'} />
                <NavBar />
                <div className="ordersList-container">
                    <p className="no-admin-ordersList">
                        There are No Orders <button className='action-icon go-back' onClick={() => navigate('/admin/dashboard')}> Go Back</button>
                    </p>
                </div>
                <Footer />
            </>
        )
    }
    return (
        <>
            <PageTitle title={'Orders List'} />
            <NavBar />
            {loading ? <Loader /> : (
                <div className="ordersList-container">
                    <h1 className="ordersList-title">All Orders</h1>
                    <div className="ordersList-table-container">
                        <table className="ordersList-table">
                            <thead>
                                <tr>
                                    <th>S1 NO</th>
                                    <th>Order ID</th>
                                    <th>Status</th>
                                    <th>Total Price</th>
                                    <th>Number Of Items</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders && orders.map((order, index) => (
                                    <tr key={index}>
                                        <td>{index + 1} </td>
                                        <td>{order._id} </td>
                                        <td className={`order-status ${order.orderStatus === 'Processing' ? 'processing' : 'delivered'}`}>{order.orderStatus} </td>
                                        <td>{order.totalPrice} </td>
                                        <td>{order.orderItems ? order.orderItems.length : 0} </td>
                                        <td className='last-td'>
                                            <Link to={'/admin/order/' + order._id} className='action-icon edit-icon'>
                                                <Edit />
                                            </Link>
                                            <Button className='delete-icon action-icon'
                                                onClick={() => deletOrderHandler(order._id)}
                                            >
                                                {
                                                    deleting[order._id] ? 'Deleting Order.....' : <Delete />
                                                }
                                            </Button>
                                        </td>
                                    </tr>
                                ))

                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            )
            }

            <Footer />

        </>
    )
}

export default OrdersList;