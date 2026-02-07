import models from "../models/order.model.js";
import { v4 as uuidv4 } from 'uuid';
import Razorpay from 'razorpay';

const getAllOrders = async () => {
    try {
        const res = await models.orderModel.find({})
        return res;
    }
    catch (err) {
        throw new Error('Error fetching orders');
    }
}

const getMyOrders = async (userId) => {
    try {
        const res = await models.orderModel.find({ authUserId: userId })
        return res;
    }
    catch (err) {
        throw new Error('Error fetching orders');
    }
}


const getOrderById = async (orderId) => {
    try {
        const res = await models.orderModel.findOne({ _id: orderId })
        return res;
    }
    catch (err) {
        throw new Error('Error fetching order');
    }
}



const createOrder = async (orderData) => {
    try {
        // const newOrder = new models.orderModel(orderData)
        // const res = await newOrder.save()
        // return res;
        var instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        var options = {
            amount: orderData?.totalAmount * 100,  // Amount is in currency subunits. 
            currency: "INR",
            receipt: "order_rcptid_11"
        };

        const res = await instance.orders.create(options)
        return res
    }
    catch (err) {
        throw new Error('Error creating order');
    }
}

const orderConfirmation = async (payload) => {
    try{
        let newOrderData = payload.orderData
        newOrderData.orderId = uuidv4()
        delete newOrderData.cartId
        newOrderData.paymentDetails = {
            paymentId: payload.paymentDetails.payment_id,
            method: 'Razorpay',
            status: payload.paymentDetails.payment_id ? payload.paymentDetails.payment_id === "COD" ? 'PENDING' : 'PAID' : 'FAILED',
            amount: payload.orderData.priceDetails.total,
            currency: 'INR',
            razorpay: payload.paymentDetails
        }
        newOrderData.status = 'CREATED'
        const newOrder = new models.orderModel(newOrderData)
        await newOrder.save()
        // await models.cartModel.findOneAndDelete({ cartId: payload.orderData.cartId })
        return newOrder
    }catch(err){
        throw new Error('Error confirming order');
    }
}

const updateOrder = async (orderId, updateData) => {
    try {
        const res = await models.orderModel.findOneAndUpdate({ _id: orderId }, updateData, { new: true })
        return res;
    }
    catch (err) {
        throw new Error('Error updating order');
    }
}


const deleteOrder = async (orderId) => {
    try {
        const res = await models.orderModel.findOneAndDelete({ _id: orderId })
        return res;
    }
    catch (err) {
        throw new Error('Error deleting order');
    }
}

export default {
    getAllOrders,
    getMyOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    orderConfirmation
}
