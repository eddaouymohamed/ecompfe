import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios"

const initialState = {
    loading: false,
    error: null,
    products: [],
    success: false,
    deleting: {},
    product: {},
    message: null,
    users: [],
    user: {},
    updating: {},
    orders: [],
    order: {},
    reviews: [],
    reviewsLoading: false,
    totalAmount:0
}
export const getAllAdminProducts = createAsyncThunk('admin/allAdminProducts', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/admin/products');
        console.log('all admin products :', data);
        return data

    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data || 'an error occured whule fteching all admin Products')

    }
})
export const createProduct = createAsyncThunk('admin/createProduct', async (myForm, { rejectWithValue }) => {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' }
        }
        const { data } = await axios.post('/api/v1/admin/product/create', myForm, config);
        console.log('admin Create product ', data);
        return data;

    } catch (error) {
        // console.log(error)
        return rejectWithValue(error.response?.data || 'an error while admin creates Product');

    }
})
export const updateProduct = createAsyncThunk('admin/updateProduct', async ({ id, myForm }, { rejectWithValue }) => {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' }
        }
        const { data } = await axios.put('/api/v1/admin/product/' + id, myForm, config);
        console.log("admin update Product", data);
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'an error occurrde While Upadting the product');
    }
})
export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete('/api/v1/admin/product/' + id);
        console.log('delete product', data);
        return { id, data }
    } catch (error) {
        return rejectWithValue(error.response?.data || 'an error occured while deleting product')

    }
})
export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/admin/users');
        console.log('get all users res', data);
        return data

    } catch (error) {
        return rejectWithValue(error.response?.data || 'an error occured while fetching Users')

    }
})
export const getSingleUserDetails = createAsyncThunk('admin/getSingleUserDetails', async (id, { rejectWithValue }) => {
    try {

        const { data } = await axios.get('/api/v1/admin/user/' + id);
        console.log('getuserSingle', data)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'an error occurrde while fetching User detatils');

    }
})
export const updateUserRole = createAsyncThunk('admin/updateUserRole', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' }
        }
        const { data } = await axios.put(`/api/v1/admin/user/${id}`, formData, config);
        console.log('update role res', data);
        return data

    } catch (error) {
        return rejectWithValue(error.response?.data || 'an error occured while updating user Role');

    }
})
export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/user/${id}`);
        console.log('res data deleting user', data)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'an error occured while deleting user')

    }
})
export const fetchOrders = createAsyncThunk('admin/fetchOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/admin/orders');
        console.log('all orders res: ', data);
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'an error occured while fetching orders list')

    }
})
export const getSingleOrder = createAsyncThunk('admin/getSingleOrder', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1//admin/order/' + id);
        console.log(data.order)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'an error occured while getting Single Order')

    }
})
export const updateOrderStatus = createAsyncThunk('admin/updateOrderStatus', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' }
        }
        const { data } = await axios.put('/api/v1/admin/order/' + id, formData, config);
        console.log('update Order Stats res :', data);
        return { id, data }
    } catch (error) {
        return rejectWithValue(error.response?.data || 'an error occured While Upadting Order Status')

    }
})
export const deleteOrder = createAsyncThunk('admin/deleteOrder', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete('/api/v1/admin/order/' + id);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'an error occured while deleting order');
    }
})

export const getProductReviews = createAsyncThunk('admin/getProductReviews', async (productId, { rejectWithValue }) => {
    try {
        console.log('res rs fetch revs', productId)
        const { data } = await axios.get(`/api/v1/admin/reviews?id=${productId}`);
        return data
    } catch (error) {
        console.log('res rs fetch revs', productId)

        return rejectWithValue(error.response?.data || "an error occured while fetching product reviews");
    }
})
/// delete product review
export const deleteProductReview = createAsyncThunk('admin/deleteProductReview', async ({ id, productId }, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/review?id=${id}&productId=${productId}`);
        console.log('succes res delet rev', productId, id, data)
        // /admin/review/:id/productId f
        console.log(productId, id, data);
        return data
    } catch (error) {
        console.log('error delet rev', error)
        return rejectWithValue(error.response?.data || 'an error occured while deleting Review res');
    }
})
// adminSlice
const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        removeErrors: (state, _) => {
            state.error = null
        },
        removeSucces: (state, _) => {
            state.success = false
        },
        removeMessage: (state, _) => {
            state.message = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllAdminProducts.pending, (state, _action) => {
                state.loading = true;
                state.error = false
            })
            .addCase(getAllAdminProducts.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.products = action.payload?.products;
                // state.products=[];
                state.success = action.payload?.success || true;


            })
            .addCase(getAllAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'an error occured while fetching admin products'
            })
            // admin Creating Products
            .addCase(createProduct.pending, (state, _action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.product = action.payload?.product;
                state.success = action.payload?.success;
                console.log(` fulfiled res Product  creating : ${action.payload?.product}`);
                state.products.push(action.payload?.product)
                console.log(state.products.length)


            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'an error occured while admin Creates Product';
            })
            //upadting product
            .addCase(updateProduct.pending, (state, _action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.product = action.payload?.product;
                state.success = action.payload?.success;
                console.log(` fulfiled res Product  upadting : ${action.payload?.product}`);
                const index = state.products.findIndex(product => product._id === action.payload?.product._id);
                if (index !== -1) {
                    state.products[index] = action.payload?.product
                }
                // upadtedProduct = action?.payload.product
                // state.products.filter(product=>product._id!==action.payload?.product._id);
                // .push(action.payload?.product).push(action.payload?.product)
                console.log(state.products.length)


            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'an error occured while admin updating Product';
            })
            // admin deleting product
            .addCase(deleteProduct.pending, (state, action) => {
                const { id } = action.meta.arg;
                console.log(action.payload);
                console.log(action.meta)
                // const id=action.meta.arg;
                // console.log('id pending delet :'+id)
                state.deleting[id] = true

                // state.deleteLoading = true;
                state.error = false;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                const { id } = action.meta.arg
                state.deleting[id] = false
                console.log(action.payload);
                // state.deleteLoading = false
                state.error = null
                state.message = action.payload?.data?.message || 'product deleted successfully';
                // state.product = action.payload?.product;
                state.success = action.payload?.data?.success || true;
                // console.log(` fulfiled res Product  deleting : ${action.payload?.product}`);
                // const upadtedProduct = state.products.find(prdocut => product._id === action.payload?.product);
                // upadtedProduct = action?.payload.product
                state.products = state.products.filter(prod => prod._id !== id);
                // .push(action.payload?.product).push(action.payload?.product)
                console.log(state.products.length)


            })
            .addCase(deleteProduct.rejected, (state, action) => {
                console.log(action.payload, 'error payload delt');
                // clearTimeout
                const { id } = action.meta.arg;
                state.deleting[id] = false;

                // state.deleteLoading = false;
                state.error = action.payload?.message || 'an error occured while deleting product';
            })
            // fetcing Users
            .addCase(fetchUsers.pending, (state, _action) => {
                state.loading = true;
                state.error = null;
                console.log('fetusers pendig')
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                console.log('pendig users fetcing ', action.payload)
                state.error = null;
                state.loading = false;
                state.success = action.payload?.success || true;
                state.users = action.payload?.users


            })
            .addCase(fetchUsers.rejected, (state, action) => {
                console.log('fetching users error rejcted case', action.payload)
                state.loading = false
                state.error = action.payload?.message || 'an error occured while fetching Users';
            })
            // get single user details
            .addCase(getSingleUserDetails.pending, (state, _) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getSingleUserDetails.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                console.log(state.user);
                // state.user=action.payload?.user;
                state.user = action.payload?.user
                console.log(state.user + 'second log fullfil ect type')
                state.success = action.payload?.success || true
                console.log('fullfiled res of getting single user details', action.payload)
            })
            .addCase(getSingleUserDetails.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || 'an error occured while fetching single user details'
            })
            // update user Role
            .addCase(updateUserRole.pending, (state, action) => {
                const { id } = action.meta.arg;
                state.updating[id] = true
                // state.loading = true;
                state.error = null
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                const { id, formData } = action.meta.arg
                // const
                console.log(action.meta.arg)
                state.updating[id] = false
                // state.loading=false
                const index = state.users.findIndex(user => user._id === id);
                if (index !== 1) {
                    state.users[index].role = formData.role
                }
                // if
                state.error = null
                // console.log(state.user);
                state.message = action.payload?.message || 'user  role updated succesfully'
                // state.user=action.payload?.user;
                // state.user=action.payload?.user
                // console.log(state.user+'second log fullfil ect type')
                state.success = action.payload?.success || true
                console.log('fullfiled res of updating user Role user details', action.payload)
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                const { id } = action.meta.arg;
                state.updating[id] = false;
                // state.loading=false
                state.error = action.payload?.message || 'an error occured while updating user Role'
            })
            // deleting user
            .addCase(deleteUser.pending, (state, action) => {
                const { id } = action.meta.arg;
                state.deleting[id] = true
                // state.loading = true;
                state.error = null
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                const id = action.meta.arg
                state.deleting[id] = false
                // state.loading=false
                state.error = null
                // console.log(state.user);
                state.message = action.payload?.message || 'user  deleted succesfully'
                // state.user=action.payload?.user;
                // state.user=action.payload?.user
                // console.log(state.user+'second log fullfil ect type')
                state.success = action.payload?.success || true
                state.users = state.users.filter(user => user._id !== id);
                console.log('fullfiled res of deleting user', action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                const id = action.meta.arg;
                state.deleting[id] = false;
                // state.loading=false
                state.error = action.payload?.message || 'an error occured while deeting user '
            })
            //fetch Orders
            .addCase(fetchOrders.pending, (state, _action) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.success = action.payload?.success || true;
                state.orders = action.payload?.orders;
                state. totalAmount=action.payload?. totalAmount;
                console.log(action.payload);

            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || 'an error occured while fetching Orders';
            })
            // getting single oRDER
            .addCase(getSingleOrder.pending, (state, _action) => {
                state.loading = true
                state.error = null
            })
            .addCase(getSingleOrder.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.success = action.payload?.success || true;
                state.order = action.payload?.order;
                console.log(action.payload);


            })
            .addCase(getSingleOrder.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || 'an error occured while fetching single order';
            })
            // updating Order Status
            .addCase(updateOrderStatus.pending, (state, action) => {
                const { id } = action.meta.arg
                state.updating[id] = true
                state.error = null
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const { id } = action.meta.arg
                state.updating[id] = false
                state.error = null
                state.success = action.payload?.data?.success || true;
                // console
                const index = state.orders.findIndex(order => order._id === id);
                if (index !== -1) {
                    state.orders[index].orderStatus = action.payload?.data?.order.orderStatus;
                }
                state.message = action.payload?.data?.message;

            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                const { id } = action.meta.arg
                state.updating[id] = false
                state.error = action.payload?.message || 'an error occured while updating order status ';
            })
            // delete order;
            .addCase(deleteOrder.pending, (state, action) => {
                const { id } = action.meta.arg
                state.deleting[id] = true
                state.error = null
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                const { id } = action.meta.arg
                state.deleting[id] = false
                state.error = null
                state.success = action.payload?.success || true;
                state.message = action.payload?.message;

            })
            .addCase(deleteOrder.rejected, (state, action) => {
                const { id } = action.meta.arg
                state.deleting[id] = false
                state.error = action.payload?.message || 'an error occured while updating order status ';
            })
            // deleting review
            .addCase(deleteProductReview.pending, (state, action) => {
                const { id } = action.meta.arg
                console.log('pending rev args', action.meta.arg)
                state.deleting[id] = true
                state.error = null
            })
            .addCase(deleteProductReview.fulfilled, (state, action) => {
                const { id, productId } = action.meta.arg
                state.deleting[id] = false;
                state.error = null
                state.success = action.payload?.success || true;
                state.message = action.payload?.message;
                state.reviews = action.payload?.product?.reviews || [];
                console.log('reviews delet product fulfilled ', action.payload?.product );
                state.products = state.products.map(prod => prod._id === productId ? action.payload?.product : prod);
                console.log('fullfiled res delete review', action.payload)
            })
            .addCase(deleteProductReview.rejected, (state, action) => {
                const { id } = action.meta.arg
                state.deleting[id] = false
                state.error = action.payload?.message || 'an error occured while deleting this productReview';
            })
            // get product reviews
            .addCase(getProductReviews.pending, (state, action) => {
            
                state.error = null;
                state.reviewsLoading = true;

            })
            .addCase(getProductReviews.fulfilled, (state, action) => {
                
                state.error = null
                state.reviewsLoading = false;
                state.success = action.payload?.success || true;
                state.reviews = action.payload?.reviews;
                console.log(action.payload?.reviews);
                


            })
            .addCase(getProductReviews.rejected, (state, action) => {
                state.reviewsLoading = false
                state.error = action.payload?.message || 'an error occured while  product reviews';
            })
    }
})
export const { removeSucces, removeErrors, removeMessage } = adminSlice.actions
export default adminSlice.reducer;
