import services from "./service.js";

const getAllOrders = async (req, res) =>{
    try{
        const orders = await services.getAllOrders()
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json({error: err.message})
    }
    
}

const getMyOrders = async (req, res) =>{
    try{
        const orders = await services.getMyOrders(req.params.userId)
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json({error: err.message})
    }
    
}

const getOrderById = async (req, res) =>{
    try{
        const order = await services.getOrderById(req.params.orderId)
        res.status(200).json(order)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}


const addToCart = async (req, res) =>{
    try{
        const cart = await services.addToCart(req.body)
        res.status(200).json({message: 'Item added to cart', cart})
    }catch(err){
        res.status(500).json({error: err.message})
    }
    
}

const updateOrder = async (req, res) =>{
    try{
        const order = await services.updateOrder(req.params.orderId, req.body)
        res.status(200).json(order)
    }catch(err){
        res.status(500).json({error: err.message})
    }
    
}

const deleteOrder = async (req, res) =>{
    try{
        const order = await services.deleteOrder(req.params.orderId)
        res.status(200).json(order)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}


const controllers = {
    getAllOrders, getMyOrders, getOrderById, addToCart, updateOrder, deleteOrder
}
export default controllers;