const axios = require('axios');

const getAllOrders = async(req, res) => {
    try{
        const resp = await axios.get(`${process.env.ORDER_BASE_URL}/getAllOrders`);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
    
}

const getMyOrders = async(req, res) => {
    try{
        console.log('Fetching orders for user: in gateawy', req.userId)
        const resp = await axios.get(`${process.env.ORDER_BASE_URL}/getUserOrders/${req.userId}`);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

const createOrder = async(req, res) => {
    try{
        const resp = await axios.post(`${process.env.ORDER_BASE_URL}/createOrder`, req.body);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

const orderConfirmation = async(req, res) => {
    try{
        const resp = await axios.post(`${process.env.ORDER_BASE_URL}/orderConfirmation`, req.body);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

const getOrderById = async(req, res) => {
    try{
        const resp = await axios.get(`${process.env.ORDER_BASE_URL}/order/${req.params.orderId}`);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

const updateOrder = async(req, res) => {
    try{
        const resp = await axios.put(`${process.env.ORDER_BASE_URL}/updateOrder/${req.params.orderId}`, req.body);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

const deleteOrder = async(req, res) => {
    try{
        const resp = await axios.delete(`${process.env.ORDER_BASE_URL}/deleteOrder/${req.params.orderId}`);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

module.exports = {
    getAllOrders, getMyOrders, createOrder, getOrderById, updateOrder, deleteOrder, orderConfirmation
};