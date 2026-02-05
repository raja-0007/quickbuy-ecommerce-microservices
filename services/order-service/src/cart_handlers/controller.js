import services from "./service.js";

const getCart = async (req, res) =>{
    try{
        console.log('Fetching cart for user:', req.params.userId)
        const cart = await services.getCart(req.params.userId)
        res.status(200).json(cart)
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
    getCart, addToCart, updateOrder, deleteOrder
}
export default controllers;