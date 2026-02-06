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

const updateCartItem = async (req, res) =>{
    try{
        const cart = await services.updateCartItem(req.body)
        res.status(200).json({message: 'Item updated in cart', cart})
    }catch(err){
        res.status(500).json({error: err.message})
    }
    
}

const deleteCartItem = async (req, res) =>{
    try{
        const cart = await services.deleteCartItem(req.query)
        res.status(200).json({message: 'Item deleted from cart', cart})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}


const controllers = {
    getCart, addToCart, updateCartItem, deleteCartItem
}
export default controllers;