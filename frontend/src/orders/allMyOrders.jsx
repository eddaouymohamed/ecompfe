
import '../styles/OrderStyles/MyOrders.css';
import Footer from '../components/footer';
import PageTitle from '../components/pageTitle';
import NavBar from '../components/navBar';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllMyOrders, removeErrors, removeSuccess } from '../features/order/orderSlice';
import Loader from '../components/loder';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import LaunchOutlined from '@mui/icons-material/LaunchOutlined';


export default function AllMyOrders() {
  const { user } = useSelector(state => state.user);
  let { orders, loading, error,success } = useSelector(state => state.order);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllMyOrders());
    return()=>dispatch(removeErrors())
  }, [dispatch])
  useEffect(()=>{
if(success){
  dispatch(removeSuccess())
  // console.log('success')
}
  },[dispatch,success])
  useEffect(() => {
    if (error) {
      toast.error(error||'falied to fetch Orders', { position: 'top-center', autoClose: 3000 })
      dispatch(removeErrors())
    }
  }, [dispatch, error])
  useEffect(() => {
    if(orders){
      console.log('orders', orders)
    }
  }, [orders])

  return (
    <>
      <PageTitle title={`${user.name}orders`} />
      <NavBar />
      <div className="my-orders-container">
        {loading ? (<Loader />) : (<> {orders.length > 0 ? (<> <h1>My Orders </h1>
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>items count</th>
                  <th>status</th>
                  <th>Total Price</th>
                  <th>View Order</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.map(order => (
                  // {console.log(order)}
                  <tr key={order._id} >
                    <td>{order._id} </td>
                    {console.log(order.orderItems)}
                    {console.log(order.orderItems.quantity)}
                    <td>{order.orderItems.quantity} </td>
                    <td>{order.orderStatus}</td>
                    <td>{order.totalPrice.toFixed(2)} </td>
                    <td><Link className='order-link' to={`/order/${order._id}`}><LaunchOutlined /> </Link> </td>

                  </tr>
                  // {console.log('order', order)}
                ))} 
              </tbody>

            </table>  
          </div>

        </>) : (<>
          <div className="no-orders">
            <p className="no-order-message">No Orders Found</p>
          </div>
        </>)}

        </>)}

      </div>
      <Footer />
    </>
  )
}