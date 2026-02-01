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
    console.log("Get all products");
    try{
        const {limit, page, searchQuery} = req.query;
        console.log("Limit:", limit, "Page:", page, "Search Query:", searchQuery);
        const response = await productServices.getAllProducts(limit, page, searchQuery);
        res.status(200).json({ products: response });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}
const searchProducts = async(req, res) =>{
    console.log("Get all products");
    try{
        const {limit, page, searchQuery} = req.query;
        console.log("Limit:", limit, "Page:", page, "Search Query:", searchQuery);
        const response = await productServices.searchProducts(limit, page, searchQuery);
        res.status(200).json({ products: response });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}
const getProductById = async(req, res) =>{
    console.log("Get all products");
    res.status(200).json({ product: {id:1} });
}

const addProduct = async(req, res) =>{
    const { name, price, description } = req.body;
    console.log("Add product:", name, price, description);
    res.status(201).json({ message: 'Product added successfully' });
}

const updateProduct = async(req, res) =>{
    const { id } = req.params;
    const { name, price, description } = req.body;
    console.log("Update product:", id, name, price, description);
    res.status(200).json({ message: 'Product updated successfully' });
}

const deleteProduct = async(req, res) =>{
    const { id } = req.params;
    console.log("Delete product:", id);
    res.status(200).json({ message: 'Product deleted successfully' });
}

module.exports = {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getHomeDeals, 
    getCategories,
    searchProducts

}