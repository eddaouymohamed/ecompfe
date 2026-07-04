
import '../styles/AdminStyles/Dashboard.css';
import Loader from '../components/loder';
import NavBar from '../components/navBar';
import PageTitle from '../components/pageTitle';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchOrders, getAllAdminProducts, removeErrors, removeSucces } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';

import  DashdrdIcon  from '@mui/icons-material/Dashboard';
import Inventory from '@mui/icons-material/Inventory';
import AddBox from '@mui/icons-material/AddBox';
import People from '@mui/icons-material/People';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import Star from '@mui/icons-material/Star';
import AttachMoney from '@mui/icons-material/AttachMoney';
import Error from '@mui/icons-material/Error';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Instagram from '@mui/icons-material/Instagram';
import LinkedIn from '@mui/icons-material/LinkedIn';
import YouTube from '@mui/icons-material/YouTube';



const Dashboard = () => {
    const { loading, success, error, products = [], orders = [], totalAmount = 0 } = useSelector(st => st.admin);
    const [totalReviews, setTotalReviews] = useState(0);
    const [inStock, setInStock] = useState(0);
    const [outOfStock, setOutOfStock] = useState(0);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllAdminProducts());
        dispatch(fetchOrders())
    }, [dispatch])
    useEffect(() => {
        if (products) {
            setTotalReviews(products.reduce((acc, prod) => acc + prod.numOfReviews || 0, 0));
            let productsInStock = 0
            let productsOutOfStock = 0
            products.forEach(prod => {
                if (prod.stock > 0) {
                    productsInStock += 1;
                }
                else {
                    productsOutOfStock += 1
                }
            })
            setInStock(productsInStock);
            setOutOfStock(productsOutOfStock)
        }
    }, [products])
    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors())
        }
        if (success) {
            dispatch(removeSucces());
        }
    }, [dispatch, error, success])

    return (
        <>

            <PageTitle title={'Admin | Dashboard'} />
            <NavBar />
            {loading ? <Loader /> : (
                <div className='dashboard-container' >
                    <div className="sidebar">
                        <div className="logo">
                            <DashdrdIcon className='logo-icon' /> Admin Dashboard
                        </div>
                        <nav className="nav-menu">
                            <div className="nav-section">
                                <h3> Products</h3>
                                <Link to={'/admin/products'}>
                                    <Inventory className='nav-icon' />
                                    All Products
                                </Link>
                                <Link to={'/admin/product/create'}>
                                    <AddBox className='nav-icon' />
                                    Create Product
                                </Link>
                            </div>
                            <div className="nav-section">
                                <h3> Users</h3>
                                <Link to={'/admin/users'}>
                                    <People className='nav-icon' />
                                    All Users
                                </Link>

                            </div>
                            <div className="nav-section">
                                <h3> Orders</h3>
                                <Link to={'/admin/orders'}>
                                    <ShoppingCart className='nav-icon' />
                                    All Orders
                                </Link>

                            </div>
                            <div className="nav-section">
                                <h3> Reviews</h3>
                                <Link to={'/admin/reviews'}>
                                    <Star className='nav-icon' />
                                    All Reviews
                                </Link>

                            </div>
                        </nav>

                    </div>
                    <div className="main-content">
                        <div className="stats-grid">
                            <div className="stat-box">
                                <Inventory className='icon' />
                                <h3>Total Products</h3>
                                <p>{products.length}</p>

                            </div>
                            <div className="stat-box">
                                <ShoppingCart className='icon' />
                                <h3>Total Orders</h3>
                                <p>{orders.length} </p>

                            </div>
                            <div className="stat-box">
                                <Star className='icon' />
                                <h3>Total Reviews</h3>
                                <p>{totalReviews} </p>

                            </div>
                            <div className="stat-boxX">
                                <AttachMoney className='icon' />
                                <h3>Total Revenue</h3>
                                 <p> 7000.89 MAD</p>

                                {/* <p>{totalAmount.toFixed(2)} MAD</p>
                                <p>{Math.round(totalAmount * 100) / 100} MAD</p> */}


                            </div>
                            <div className="stat-box">
                                <Error className='icon' />
                                <h3>Out Of Stcock</h3>
                                <p>{outOfStock}</p>

                            </div>
                            <div className="stat-box">
                                <CheckCircle className='icon' />
                                <h3>In Stock</h3>
                                <p>{inStock}</p>

                            </div>

                        </div>
                        <div className="social-stats">
                            <div className="social-box instagram">
                                <Instagram />
                                <h3>Instagram</h3>
                                <p>123K followers</p>
                                <p>12 posts</p>
                            </div>
                            <div className="social-box linkedin">
                                <LinkedIn />
                                <h3>linkedin</h3>
                                <p>123K followers</p>
                                <p>12 posts</p>
                            </div>
                            <div className="social-box youtube">
                                <YouTube />
                                <h3>youtube</h3>
                                <p>123K followers</p>
                                <p>12 posts</p>
                            </div>

                        </div>
                    </div>

                </div>
            )
            }


        </>
    )
}
export default Dashboard;