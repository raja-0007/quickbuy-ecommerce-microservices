const axios = require('axios');


const getCart = async(req, res)=>{
    try{
        console.log('Fetching cart for user: in gateawy', req.userId)
        const resp = await axios.get(`${process.env.ORDER_BASE_URL}/cart/getCart/${req.userId}`);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}
const addToCart = async(req, res) => {
    try{
        const resp = await axios.post(`${process.env.ORDER_BASE_URL}/cart/addToCart`, { ...req.body, authUserId: req.userId });
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

module.exports = {
    getCart, addToCart
};