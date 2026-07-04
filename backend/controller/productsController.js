import Product from '../models/productsmodel.js';
import ErrorHandling from '../utils/errorHandling.js';
import handleAsyncErrors from '../middleware/handleAsyncErrors.js';
import APIFunctionality from '../utils/apiFunctionnality.js';
import { v2 as cloudinary } from 'cloudinary';

export const createProducts = handleAsyncErrors(async (req, res, next) => {

    const userId = req.user.id; 
    req.body.user = userId
    if (!req.body.image) {
        return next(new ErrorHandling('Please provide product images', 400));
    }
    let image = [];
    // image = req.body.image;
    if (typeof req.body.image === 'string') {
        image.push(req.body.image)
    }
    else {
        image = req.body.image;
    }
    let imageLinks = [];
    for (let index = 0; index < image.length; index++) {
        // console.log(`Uploading image: ${image[index]}`) // Debug log to check image data
        const result = await cloudinary.uploader.upload(image[index], {
            folder: 'products'
        })
        imageLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    req.body.image = imageLinks;

    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
    // creat
})
// 2 get Products
export const getAllProducts = handleAsyncErrors(async (req, res, next) => {
    const resultsPerPage = 8;
    const apiFeatures = new APIFunctionality(Product.find(), req.query)
        .search().filter();
    // getting filtered query before pagination
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();
    // calculate total pages based on filteredQuery
    const totalPages = Math.ceil(productCount / resultsPerPage)
    const page = Number(req.query.page) || 1
    if (page > totalPages && productCount > 0) {
        return next(new ErrorHandling('This page does not exist', 404))

    }
    // apply pagination
    apiFeatures.pagination(resultsPerPage)
    const products = await apiFeatures.query
    if (!products || products.length === 0) {
        return next(new ErrorHandling('No product Found ', 404))

    }

    res.status(200).json({
        success: true,
        products,
        resultsPerPage,
        totalPages,
        currentPage: page,
        productCount,

    })

})

export const updateProducts = handleAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandling('Product not found ', 500))
    }
    if (req.body.image) {
        let image = product.image;
        for (let index = 0; index < image.length; index++) {
            await cloudinary.uploader.destroy(image[index].public_id)


        }

        image = [];
        if (typeof req.body.image === 'string') {
            image.push(req.body.image)
        }
        else {
            image = req.body.image
        }
        let imageLinks = []
        for (let index = 0; index < image.length; index++) {
            const result = await cloudinary.uploader.upload(image[index], {
                folder: 'products'
            })
            imageLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.image = imageLinks;

        // }
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            // useFindAndModify: false
        })

        res.status(200).json({
            success: true,
            product
        })
    }
    // destroy images


})
/////////
/// 4 delete products

export const deleteProducts = handleAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    // console.log(`product to be deleted is :${product}`);
    if (!product) {
        return next(new ErrorHandling('Product not found ', 500))
    }
    // destroy images
    const images = product.image;

    for (let index = 0; index < images.length; index++) {
        await cloudinary.uploader.destroy(images[index].public_id);
    }

    product = await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success: true,
        message: "product has deleted successfully",
        product,
    })

})
// 5 get single product
export const getSingleProduct = handleAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandling("product not found ", 500))
    }
    res.status(200).json({
        success: true,
        product
    })
})
// get all Admin products
export const getAdminProducts = handleAsyncErrors(async (_req, res, _next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })

})
// create reviews
export const createProductReview = handleAsyncErrors(async (req, res, next) => {
    const { productId, rating, comment } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    let message;
    if (!product) {
        message = 'Product not found';
        return next(new ErrorHandling(message, 404));

    }
    const productReview = product.reviews.find(rev => rev.user.toString() === req.user.id);

    if (productReview) {
        productReview.rating = rating;
        productReview.comment = comment;
    }
    else {
        product.reviews.push(review);
    }
    let average = 0;
    product.numOfReviews = product.reviews.length;
    product.reviews.forEach(rev => {
        average += rev.rating;

    });
    product.ratings = product.numOfReviews > 0 ? (average / product.numOfReviews) : 0;
    await product.save()
    res.status(200).json({
        success: true,
        product
    })
})

// get product reviews
export const getProductReviews = handleAsyncErrors(async (req, res, next) => {


    const productId = req.query.id;

    const product = await Product.findById(productId);
    let message;
    if (!product) {
        message = 'Product Not Found ';
        return next(new ErrorHandling(message, 404))

    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})
// delete review
export const deleteProductReview = handleAsyncErrors(async (req, res, next) => {
    const productId = req.query.productId;
    const reviewId = req.query.id;
    const product = await Product.findById(productId);
    let message;
    if (!product) {
        message = 'product Not Found ';
        return next(new ErrorHandling(message, 404));

    }
    const reviews = product.reviews;
    const filteredReviews = reviews.filter(review => review._id.toString() !== reviewId.toString());

    const average = filteredReviews.reduce((acc, rev) => acc + rev.rating, 0);
    const numOfReviews = filteredReviews.length;
    const ratings = numOfReviews > 0 ? average / numOfReviews : 0;
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
        reviews: filteredReviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        message: 'review deleted successfully',
        product: updatedProduct
    })

})