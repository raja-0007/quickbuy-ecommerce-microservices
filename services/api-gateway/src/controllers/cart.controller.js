const axios = require('axios');

const addToCart = async(req, res) => {
    try{
        const resp = await axios.post(`${process.env.ORDER_BASE_URL}/cart/addToCart`, { ...req.body, authUserId: req.userId });
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

module.exports = {
    addToCart
};