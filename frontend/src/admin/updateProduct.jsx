import React, { useEffect, useState } from 'react'
import '../styles/AdminStyles/UpdateProduct.css';
import '../styles/AdminStyles/CreateProduct.css';
import { useDispatch, useSelector } from 'react-redux';
import { removeErrors, removeSucces, updateProduct } from '../features/admin/adminSlice';
import { removeErrors as removeProductErrors } from '../features/products/productsSlice';
import PageTitle from '../components/pageTitle';
import NavBar from '../components/navBar';
import Footer from '../components/footer';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductDetails ,removeSuccess as removegetProductSuccess} from '../features/products/productsSlice';
import Loader from '../components/loder';
export default function UpdateProduct() {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [stock, setStock] = useState(1)
    const [category, setCategory] = useState('')
    const [image, setImage] = useState([])
    const [imagePreview, setImagePreview] = useState([]);
    const [imagePreviewChanged,setImagePreviewChanged]=useState(false)
    const categories = ['tv', 'mobile','laptop', 'jackets', 'tablet','tshirt','watches'];
    const dispatch = useDispatch();
    const { loading, success, error } = useSelector(state => state.admin);
    const { loading: getProductLoading, error: getProductError,product ,success:getProductSucces} = useSelector(state => state.product);
    const { id } = useParams();
    const navigate=useNavigate();
    useEffect(() => {
        if (id) {
            dispatch(getProductDetails(id))
        }
        return ()=>dispatch(removeProductErrors())
    }, [id, dispatch])
    useEffect(()=>{
        if(product){
            setName(product.name)
            setPrice(product.price)
            setStock(product.stock)
            setDescription(product.description)
            setCategory(product.category)
            setImagePreview(product.image)
            console.log(imagePreview)
        }

    },[product])
    useEffect(()=>{
        if(getProductSucces){
            dispatch(removegetProductSuccess())
        }

    },[getProductSucces,dispatch])

    console.log(id)
    const updateProductSubmit = (e) => {
        e.preventDefault();
        const myForm={
            name,
            price: Number(price),
            stock: Number(stock),
            category,
            description,
            image, // this is already an array of base64 strings
        }

        dispatch(updateProduct({id,myForm}));
    }
   
    const createProductImage = e => {
        const files = Array.from(e.target.files);
        console.log(files)
        setImage([]);
        setImagePreview([]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagePreview(old => {
                        console.log(old)
                        return [...old, reader.result]
                    });
                    console.log(reader.result)
                    setImage(old => [...old, reader.result])
                }
            }
            reader.readAsDataURL(file);
            // console
        })

setImagePreviewChanged(true)

    }

    useEffect(() => {
        if (success) {
            toast.success('product updated Succesfilly Successfully', { position: 'top-center', autoClose: 3000 });
            dispatch(removeSucces());

            navigate('/admin/products')

        }
    }, [dispatch, success])
    useEffect(() => {
        if (error) {
            toast.error(error || 'an error while craete product');
            dispatch(removeErrors())
        }
        if (getProductError) {
            toast.error(getProductError || 'an error while getting Product details');
            dispatch(removeProductErrors())
        }

    }, [dispatch, error, getProductError])
    if(getProductLoading){
        return(
            <div className="create-product-container">
                <Loader />
            </div>
        )

    }
    return (
        <>
            {/* {loading && <Loader />} */}
            <PageTitle title={'Create Product'} />
            <NavBar />
            {product &&
                <div className="create-product-container">
                    <h1 className="form-title">
                            Update Product
                    </h1>
                    <form className='product-form'  onSubmit={updateProductSubmit}>
                        <input type="text" className='form-input' placeholder='enter product name' name='name' required value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="text" className='form-input' placeholder='enter product price ' name='price' required value={price} onChange={(e) => setPrice(e.target.value)} />
                        <input type="text" className='form-input' placeholder='enter product description' name='description' required value={description} onChange={(e) => setDescription(e.target.value)} />
                        {/* <input type="text" className='form-input'  placeholder='enter product name'/> */}
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
                            {imagePreview &&  !imagePreviewChanged && imagePreview.map((item, index) => (
                                <img src={item.url} alt='product image Preview' className='image-preview' key={index}
                                />

                            ))}
                              {imagePreview && imagePreviewChanged && imagePreview.map((item, index) => (
                                <img src={item} alt='product image Preview' className='image-preview' key={index}
                                />

                            ))}
                        </div>
                        <button className='submit-btn'>
                            {loading ? 'Updating Product' : 'Update Product'}

                        </button>
                    </form>
                </div>
            }

            <Footer />

        </>
    )
}
