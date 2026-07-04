import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    loading: false,
    error: null,
    success: false,
    orders: [],
    order: {}
}
export const createOrder = createAsyncThunk('order/createOrder', async (order, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/v1/new/order', order, config);
        console.log('orders data',data);
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Order creating Failed ')

    }
})
export const getAllMyOrders = createAsyncThunk('order/getAllMyOrders', async ( _,{ rejectWithValue }) => {
    try {

        const { data } = await axios.get('/api/v1/orders/user');
        console.log("orders");
        
        console.log(data);
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch orders ')

    }
})
export const getOrderDetails=createAsyncThunk('order/getOrderDetails',async(orderId,{rejectWithValue})=>{
    try {
        const {data}=await axios.get('/api/v1/order/'+orderId);
        console.log(data);
        return data

    } catch (error) {
        return rejectWithValue(error.response?.data||'failed to get order Details');

    }
})
const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        removeErrors: (state, _action) => {
            state.error = null;
        },
        removeSuccess: (state, _action) => {
            state.success = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending,(state)=>{
                state.loading=true
                state.error=false
            })
             .addCase(createOrder.fulfilled,(state,action)=>{
                state.loading=false
                state.error=false
                state.order=action.payload?.order
                state.success=action.payload?.success
            })
             .addCase(createOrder.rejected,(state,action)=>{
                state.loading=false
                state.error=action.payload?.message||'Order Creating Failed'
            })
            // get all orders
            .addCase(getAllMyOrders.pending,(state)=>{
                state.loading=true
                state.error=false
            })
             .addCase(getAllMyOrders.fulfilled,(state,action)=>{
                state.loading=false
                state.error=false
                state.orders=action.payload?.orders
                state.success=action.payload?.success|| true
            })
             .addCase(getAllMyOrders.rejected,(state,action)=>{
                state.loading=false
                state.error=action.payload?.message||'Failed to get Oredrs'
            })
            // get single Order
            .addCase(getOrderDetails.pending,(state)=>{
                state.loading=true
                state.error=false
            })
             .addCase(getOrderDetails.fulfilled,(state,action)=>{
                state.loading=false
                state.error=false
                state.order=action.payload?.order
                state.success=action.payload?.success|| true
            })
             .addCase(getOrderDetails.rejected,(state,action)=>{
                state.loading=false
                state.error=action.payload?.message||'Failed to get Oreder details'
            })


    }
})
export const {removeErrors,removeSuccess}=orderSlice.actions;
export default orderSlice.reducer;