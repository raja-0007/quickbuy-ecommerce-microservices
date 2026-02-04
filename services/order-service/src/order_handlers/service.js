import models from "../models/order.model.js";
import { v4 as uuidv4 } from 'uuid';
const getAllOrders = async()=>{
    try{
        const res = await models.orderModel.find({})
        return res;
    }
    catch(err){
        throw new Error('Error fetching orders');
    }
}

const getMyOrders = async(userId)=>{
    try{
        const res = await models.orderModel.find({ authUserId: userId })
        return res;
    }
    catch(err){
        throw new Error('Error fetching orders');
    }
}


const getOrderById = async(orderId)=>{
    try{
        const res = await models.orderModel.findOne({ _id: orderId })
        return res;
    }
    catch(err){
        throw new Error('Error fetching order');
    }
}



const createOrder = async(orderData)=>{
    try{
        const newOrder = new models.orderModel(orderData)
        const res = await newOrder.save()
        return res;
    }
    catch(err){
        throw new Error('Error creating order');
    }
}

const updateOrder = async(orderId, updateData)=>{
    try{
        const res = await models.orderModel.findOneAndUpdate({ _id: orderId }, updateData, { new: true })
        return res;
    }
    catch(err){
        throw new Error('Error updating order');
    }
}


const deleteOrder = async(orderId)=>{
    try{
        const res = await models.orderModel.findOneAndDelete({ _id: orderId })
        return res;
    }
    catch(err){
        throw new Error('Error deleting order');
    }
}

export default {
    getAllOrders,
    getMyOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
}
