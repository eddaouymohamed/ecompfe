import express from 'express'
import { getAllProducts ,getSingleProduct,deleteProducts,createProducts,updateProducts, createProductReview, deleteProductReview, getAdminProducts, getProductReviews} from '../controller/productsController.js'
import {verifyUserAuth,roleBasedAccess }from '../middleware/userAuth.js'
const router=express.Router()
router.route('/products').get(getAllProducts);
router.route('/admin/products').get(verifyUserAuth,roleBasedAccess('admin'),getAdminProducts);
router.route('/admin/product/create').post(verifyUserAuth,roleBasedAccess("admin"),createProducts)
router.route('/admin/product/:id').
put(verifyUserAuth ,roleBasedAccess('admin') ,updateProducts).
delete(verifyUserAuth ,roleBasedAccess('admin') ,deleteProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/review').put(verifyUserAuth,createProductReview);
router.route('/admin/reviews').get(getProductReviews);
router.route('/admin/review').delete(verifyUserAuth,deleteProductReview);

export default router;
//7:34a