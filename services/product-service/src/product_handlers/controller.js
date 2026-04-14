const express = require('express');
const productServices = require('./service')


const getHomeDeals = async(req, res) =>{
    try{
        const deals = await productServices.getHomeDeals();
        res.status(200).json({ deals });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

const getCategories = async(req, res) =>{
    try{
        const categories = await productServices.getCategories();
        res.status(200).json({ categories });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}
const getAllProducts = async(req, res) =>{
    // console.log("Get all products");
    try{
        const {limit, page, searchQuery, sellerUserId} = req.query;
        // console.log("Limit:", limit, "Page:", page, "Search Query:", searchQuery);
        const response = await productServices.getAllProducts(limit, page, searchQuery, sellerUserId);
        res.status(200).json({ products: response });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}
const searchProducts = async(req, res) =>{
    console.log("Get all products");
    try{
        const {limit, page, searchQuery} = req.query;
        // console.log("Limit:", limit, "Page:", page, "Search Query:", searchQuery);
        const response = await productServices.searchProducts(limit, page, searchQuery);
        res.status(200).json({ products: response });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}
const getProductById = async(req, res) =>{
    // console.log("Get all products");
    // res.status(200).json({ product: {id:1} });
    try{
        const { id } = req.params;
        const response = await productServices.getProductById(id);

        res.status(200).json({ product: response });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

const addProduct = async(req, res) =>{
    try{
            const response = await productServices.addProduct(req.body);
            res.status(201).json({ message: 'Product added successfully', product: response });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
     
}

const updateProduct = async(req, res) =>{
    try {
        const { id } = req.params;
        const response = await productServices.updateProduct(id, req.body);
        res.status(200).json({ message: 'Product updated successfully', product: response });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

const deleteProduct = async(req, res) =>{
    try {
        const { id } = req.params;
        const response = await productServices.deleteProduct(id);
        res.status(200).json({ message: 'Product deleted successfully', product: response });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getHomeDeals, 
    getCategories,
    searchProducts,
    addProduct

}
