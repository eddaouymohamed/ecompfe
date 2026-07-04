import { Link,useNavigate } from 'react-router-dom';
import '../styles/componentStyles/Product.css'
import Rating from '@mui/material/Rating';
import { useState } from 'react';
const Product = ({ product }) => {
    const [rating, setRating] = useState(product.ratings);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        console.log(`rating changed to :${newRating}`);
    }
    return (
        <Link to={`/product/${product._id}`} className='product_id'>
        <div className="product-card">
            {product.image.length > 0 &&
                <img src={product.image[0].url} alt={product.name} className='product-image-card'  />
            }
            <div className="product-details">
                <h3 className="product-title">{product.name}</h3>
                <p className='home-price'> <strong>Price:</strong>{product.price}dh </p>
                <div className="rating-container">
                    <Rating
                        value={product.ratings}
                        disabled={false}
                    />
                    <span className="productCardSpan">(
                        {product.numOfReviews}
                        {`${product.numOfReviews === 1 ? '  review' : '  reviews'}`})
                    </span>
                </div>
                <button className='add-to-cart'>Add To Cart</button>
            </div>
        </div>
         </Link>
    )
}
export default Product;