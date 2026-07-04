


import React, { useRef, useEffect, useState } from 'react';
import '../styles/AdminStyles/ReviewsList.css';
import PageTitle from '../components/pageTitle';
import NavBar from '../components/navBar';
import Footer from '../components/footer';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteProductReview,
  getAllAdminProducts,
  getProductReviews,
  removeErrors,
  removeMessage,
  removeSucces
} from '../features/admin/adminSlice';
import Loader from '../components/loder';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

import Delete from '@mui/icons-material/Delete';

function ReviewsList() {
    const { products, success, error, loading, message, reviews, reviewsLoading, deleting } = useSelector(st => st.admin);
    const [productId, setProductId] = useState('');
    const tableRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllAdminProducts());
        return () => dispatch(removeErrors());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success && message) {
            toast.success(message, { position: 'top-center', autoClose: 3000 });
            dispatch(removeMessage());
            dispatch(removeSucces());
            navigate('/admin/products');
        }
        if (success) {
            dispatch(removeSucces());
        }
    }, [dispatch, error, success, message, navigate]);

    const getProductReviewsHandler = (prod) => {
        setProductId(prod._id);
        dispatch(getProductReviews(prod._id));

        // Petit délai pour laisser le temps à l'élément de s'afficher dans le DOM avant le scroll
        setTimeout(() => {
            if (tableRef.current) {
                tableRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const deleteProductReviewHandler = (id) => {
        const isCconfirmed = window.confirm('Are you sure you want to delete this product Review?');
        if (!isCconfirmed) return;
        dispatch(deleteProductReview({ id, productId }));
    };

    if (!loading && products && products.length === 0) {
        return (
            <>
                <PageTitle title={'Reviews List'} />
                <NavBar />
                <div className="reviews-list-container">
                    <p className="no-admin-products">
                        There are no products to see their reviews
                        <Link to={'/admin/dashboard'} className='view-btn' style={{ marginLeft: '10px' }}>
                            Go Back
                        </Link>
                    </p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <PageTitle title={'Reviews List'} />
            <NavBar />
            {loading ? <Loader /> : (
                <div className="reviews-list-container">
                    <h1 className="reviews-list-container">
                        Products Reviews
                    </h1>
                    <table className="reviews-table">
                        <thead>
                            <tr>
                                <th>S1 No</th>
                                <th>Product Name</th>
                                <th>Product Image</th>
                                <th>Number Of Reviews</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products && products.map((product, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>
                                        {/* Correction pour correspondre à votre clé 'image' ou 'images' */}
                                        <img 
                                            className='product-image' 
                                            src={product.image?.[0]?.url || product.images?.[0]?.url || "https://via.placeholder.com/150"} 
                                            alt={product.name} 
                                        />
                                    </td>
                                    <td>{product.numOfReviews}</td>
                                    <td>
                                        <button className='view-btn' onClick={() => getProductReviewsHandler(product)}>
                                            <span>View Reviews</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {reviewsLoading && (
                        <div className='reviews-details'>
                            <Loader />
                        </div>
                    )}

                    {productId && !reviewsLoading && (
                        <div className="reviews-details" ref={tableRef} id='reviews'>
                            <h2>Product Reviews Details</h2>
                            <table className="reviews-table">
                                <thead>
                                    <tr>
                                        <th>S1 No</th>
                                        <th>Reviewer Name</th>
                                        <th>Rating</th>
                                        <th>Comment</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews && reviews.length > 0 ? (
                                        reviews.map((rev, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{rev.name}</td>
                                                <td>{rev.rating} / 5</td>
                                                <td>{rev.comment}</td>
                                                <td>
                                                    {deleting[rev._id] ? (
                                                        'deleting....'
                                                    ) : (
                                                        <Delete 
                                                            className='action-icon delete-icon' 
                                                            onClick={() => deleteProductReviewHandler(rev._id)} 
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        /* ✅ Phrase affichée en dessous du header si le tableau est vide */
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#e74c3c', fontWeight: 'bold' }}>
                                                Aucun avis pour ce produit
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
            <Footer />
        </>
    );
}

export default ReviewsList;