import React, { useEffect, useState } from 'react';
import '../styles/AdminStyles/CreateProduct.css';
import NavBar from '../components/navBar';
import PageTitle from '../components/pageTitle';
import Footer from '../components/footer';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, removeErrors, removeSucces } from '../features/admin/adminSlice';
import { toast } from 'react-toastify'
function CreateProduct() {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [stock, setStock] = useState(1)
    const [category, setCategory] = useState('mobile')
    const [image, setImage] = useState([])
    const [imagePreview, setImagePreview] = useState([]);
    const categories = ['tv', 'mobile', 'laptop', 'jackets', 'tablet', 'tshirt', 'watches'];

    const dispatch = useDispatch();
    const { loading, success, error } = useSelector(state => state.admin);
    const createProductSubmit = (e) => {
        e.preventDefault();
        const myForm = {
            name,
            price: Number(price),
            stock: Number(stock),
            category,
            description,
            image, // this is already an array of base64 strings
        };
      

        dispatch(createProduct(myForm));
    }
    const createProductImage = e => {
        const files = Array.from(e.target.files);
        setImage([]);
        setImagePreview([]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagePreview(old => {
                        return [...old, reader.result]
                    });
                    setImage(old => [...old, reader.result])
                }
            }
            reader.readAsDataURL(file);
        })
    }
    const resetForm = () => {
        setName('');
        setCategory('mobile');
        setDescription('')
        setPrice('');
        setStock(1);
        setImage([]);
        setImagePreview([])
    }
    useEffect(() => {
        if (success) {
            toast.success('product created Successfully', { position: 'top-center', autoClose: 3000 });
            dispatch(removeSucces());
            resetForm();

        }
    }, [dispatch, success])
    useEffect(() => {
        if (error) {
            toast.error(error || 'An error ocured while creating product');
            dispatch(removeErrors())
        }

    }, [dispatch, error])
    return (
        <>
            <PageTitle title={'Create Product'} />
            <NavBar />
            <div className="create-product-container">
                <h1 className="form-title">
                    Create Product
                </h1>
                <form className='product-form'  onSubmit={createProductSubmit}>
                    <input type="text" className='form-input' placeholder='enter product name' name='name' required value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="text" className='form-input' placeholder='enter product price ' name='price' required value={price} onChange={(e) => setPrice(e.target.value)} />
                    <input type="text" className='form-input' placeholder='enter product description' name='description' required value={description} onChange={(e) => setDescription(e.target.value)} />
                    <select className='form-select' name='category' required value={category} onChange={e => setCategory(e.target.value)}>
                        <option value=""> Choose a Category</option>
                        {
                            categories.map(item => (
                                <option value={item} key={item} >{item} </option>
                            ))
                        }
                    </select>
                    <input type="number" className='form-input' placeholder='enter product Stock' name='stock' value={stock} onChange={e => setStock(e.target.value)} />
                    <div className="file-input-container">
                        <input type="file" accept='image/' className='form-input-file' multiple name='image' onChange={createProductImage} />
                    </div>
                    <div className="image-preview-container">
                        {imagePreview && imagePreview.map((item, index) => (
                            <img src={item} alt='product image Preview' className='image-preview' key={index}
                            />

                        ))}
                    </div>
                    <button className='submit-btn'>
                        {loading ? 'Creating Product' : 'Create Product'}
                    </button>
                </form>
            </div>
            <Footer />

        </>
    )
}

export default CreateProduct;