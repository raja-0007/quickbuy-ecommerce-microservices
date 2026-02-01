const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();


const getHomeDeals = async(req, res) => {
    try{
        const resp = await axios.get(`${process.env.PRODUCT_BASE_URL}/deals/home`);
        // console.log('get home deals called', resp.data);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

const getCategories = async(req, res) => {
    try{
        const resp = await axios.get(`${process.env.PRODUCT_BASE_URL}/categories`);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}
const getAllProducts = async(req, res) => {
    try{
        const {limit, page, searchQuery} = req.query;
            const resp = await axios.get(`${process.env.PRODUCT_BASE_URL}/get-products`, {
                params: {limit, page, searchQuery}
            });
            // console.log('get products called', resp.data);
            res.status(resp.status).json(resp.data);
    
        }catch(err){
            res.status(err.status).json({ error: err.message });
        }
}
const searchProducts = async(req, res) => {
    try{
        const {limit, page, searchQuery} = req.query;
            const resp = await axios.get(`${process.env.PRODUCT_BASE_URL}/search-products`, {
                params: {limit, page, searchQuery}
            });
            // console.log('get products called', resp.data);
            res.status(resp.status).json(resp.data);
    
        }catch(err){
            res.status(err.status).json({ error: err.message });
        }
}

const getProductById = async(req, res)=>{
    try{
        const resp = await axios.get(`${process.env.PRODUCT_BASE_URL}/products/${req.params.id}`);
        // console.log('get products called', resp.data);
        res.status(resp.status).json(resp.data);

    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

const addProduct = async(req, res)=>{
    try{
        const resp = await axios.post(`${process.env.PRODUCT_BASE_URL}/add-product`, req.body);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

const updateProduct = async(req, res)=>{
    try{
        const resp = await axios.put(`${process.env.PRODUCT_BASE_URL}/update-product/${req.params.id}`, req.body);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

const deleteProduct = async(req, res)=>{
    try{
        const resp = await axios.delete(`${process.env.PRODUCT_BASE_URL}/delete-product/${req.params.id}`);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

const productController = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getHomeDeals,
    getCategories,
    searchProducts
}

module.exports = productController;