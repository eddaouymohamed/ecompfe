import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import ProductDetails from './pages/productDeatils';
import Products from './pages/products';
import Register from './user/register';
import Login from './user/login';
import { useDispatch, useSelector } from 'react-redux';
import { UserDashboard } from './user/userDashboard';
import { useEffect } from 'react';
import { loadUser } from './features/user/userSlice';
import { Profile } from './user/profile';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UpadteProfile } from './user/UpdateProfile';
import UpdatePassword from './user/updatePassword';
import ForgotPassword from './user/forgotPassword';
import ResetPassword from './user/resetPassword';
import Cart from './cart/cart';
import Shipping from './cart/shipping';
import OrderConfirm from './cart/orderConfirm';
import Payment from './cart/payment';
import PaymentSucces from './cart/paymentSucces';
import AllMyOrders from './orders/allMyOrders';
import OrderDeatils from './orders/orderDetails';
import Dashboard from './admin/dashbord';
import ProductsList from './admin/productsList';
import CreateProduct from './admin/createProduct';
import UpdateProduct from './admin/updateProduct';
import AllUsers from './admin/allUsers';
import UpdateUserRole from './admin/updateUserRole';
import OrdersList from './admin/ordersList';
import UpdateOrder from './admin/updateOrder';
import ReviewsList from './admin/reviewsList';
function App() {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser())
    }
  }, [dispatch])
  // console.log(isAuthenticated, user)

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' end element={<Home />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/products' element={<Products />} />
          <Route path='/products/:keyword' element={<Products />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<ProtectedRoute element={<Profile />} />} />
          <Route path='/profile/update' element={<ProtectedRoute element={<UpadteProfile />} />} />
          <Route path='/update/password' element={<ProtectedRoute element={<UpdatePassword />} />} />
          <Route path='/forgot/password' element={<ForgotPassword />} />
          <Route path='/reset/:token' element={<ResetPassword />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/shipping' element={<ProtectedRoute element={<Shipping />} />} />
          <Route path='/order/confirm' element={<ProtectedRoute element={<OrderConfirm />} />} />
          <Route path='/process/payment' element={<ProtectedRoute element={<Payment />} />} />
          <Route path='/payment/success' element={<ProtectedRoute element={<PaymentSucces />} />} />
          <Route path='/orders/user' element={<ProtectedRoute element={<AllMyOrders />} />} />
          <Route path='/order/:orderId' element={<ProtectedRoute element={<OrderDeatils />} />} />
          <Route path='/admin/dashboard' element={<ProtectedRoute adminOnly={true} element={<Dashboard />} />} />
          <Route path='/admin/products' element={<ProtectedRoute adminOnly={true} element={<ProductsList />} />} />
          <Route path='/admin/product/create' element={<ProtectedRoute adminOnly={true} element={<CreateProduct />} />} />
          <Route path='/admin/product/:id' element={<ProtectedRoute adminOnly={true} element={<UpdateProduct />} />} />
          <Route path='/admin/users' element={<ProtectedRoute adminOnly={true} element={<AllUsers />} />} />
          <Route path='/admin/user/:id' element={<ProtectedRoute adminOnly={true} element={<UpdateUserRole />} />} />
          <Route path='/admin/orders' element={<ProtectedRoute adminOnly={true} element={<OrdersList />} />} />
          <Route path='/admin/order/:id' element={<ProtectedRoute adminOnly={true} element={<UpdateOrder />} />} />
          <Route path='/admin/reviews' element={<ProtectedRoute adminOnly={true} element={<ReviewsList />} />} />

        </Routes>

{/* user */}
        {isAuthenticated && <UserDashboard user={user} />}

      </Router>
    </>
  )
}
export default App;
