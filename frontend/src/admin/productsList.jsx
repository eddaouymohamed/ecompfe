
import React, { useEffect } from 'react';
import NavBar from '../components/navBar';
import Footer from '../components/footer';
import PageTitle from '../components/pageTitle';
import '../styles/AdminStyles/ProductsList.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getAllAdminProducts, removeErrors, removeMessage, removeSucces } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';
import Loader from '../components/loder';
import Button from '@mui/material/Button';

import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';


function ProductsList() {
    const { products, loading, error, message, success, deleting } = useSelector(state => state.admin);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllAdminProducts());
        console.log(products)


    }, [dispatch,products])
    useEffect(() => {
        if (success && message) {
            toast.success(message || 'product short succes delted', { position: 'top-center', autoClose: 3000 })
            dispatch(removeSucces());
            dispatch(removeMessage());

        }
         if (success) {
        dispatch(removeSucces())
    }
    }, [dispatch, message, success])

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            // console.log:
            dispatch(removeErrors());
        }
    }, [dispatch, error])
    const deletProductHandler = id => {
        const isConfirmed = window.confirm('Are You Sure You Want dDeleting this product');

        if (isConfirmed) {
            dispatch(deleteProduct(id));
        }
    }
    if (!products || products.length === 0) {
        return (
            <>
                <div className="product-list-container">
                    <h1 className='product-list-title'>Admin Products</h1>
                    <p className='no-admin-products'> No Products Found </p>
                </div>

            </>
        )
    }
    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <PageTitle title={'All Products'} />
                    <NavBar />
                    {products && (
                        <div className="product-list-container">
                            <h1 className="product-list-title">
                                All Products{ }
                            </h1>
                            <div className="productsList-table-container">
<table className='product-table'>
                                <thead>
                                    <tr>
                                        <th>S1 No</th>
                                        <th>Product Image</th>
                                        <th>Product Name</th>
                                        <th>Price</th>
                                        <th>Ratings</th>
                                        <th>Category</th>
                                        <th>Stock</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products && products.map((product, index) => (
                                        <tr key={index}>
                                            {
                                                product && product.image && product.image.length > 0 && (
                                                    <>
                                                        <td>{index + 1}  </td>
                                                        <td>
                                                            <img src={product.image[0].url} alt={product.name} className='admin-product-image' />
                                                        </td>
                                                        <td>{product.name}  </td>
                                                        <td> {product.price} dh </td>
                                                        <td>{product.ratings} </td>
                                                        <td>{product.category}</td>
                                                        <td>{product.stock} </td>
                                                        <td>{(new Date(product.createdAt)).toLocaleString()} </td>
                                                        <td className='last-td'>
                                                            <Link to={`/admin/product/${product._id}`} className='action-icon edit-icon'>
                                                                <Edit />
                                                            </Link>
                                                            < Button className='action-icon delete-icon'
                                                                onClick={() => deletProductHandler(product._id)}
                                                                disabled={deleting[product._id]}
                                                            >
                                                                {deleting[product._id] ? <Loader /> :<Delete />}
                                                            </Button>



                                                        </td>
                                                    </>
                                                )
                                            }
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                            </div>

                        </div>
                    )}
                    <Footer />
                </>
            )}
        </>
    )
}

export default ProductsList;