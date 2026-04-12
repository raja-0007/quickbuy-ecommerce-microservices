const { response } = require('express');
const models = require('../models/product.model')
const categoryModels = require('../models/productCategory.model')

const getAllProducts = async (limit = 10, page = 1, searchQuery = '', sellerUserId = '') => {
    try {
        const skip = (page - 1) * limit;
        const filter = {};

        if (searchQuery !== '') {
            filter.$or = [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { category: { $regex: searchQuery, $options: 'i' } },
                { tags: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        if (sellerUserId) {
            filter.sellerUserId = sellerUserId;
        }


        const products = await models.productModel.find(filter).skip(skip).limit(limit)
        return products;
    } catch (err) {
        console.log(err);
        throw new Error('Error fetching products');
    }
}


const searchProducts = async (limit = 10, page = 1, searchQuery = '') => {
    try {
        const skip = (page - 1) * limit;
       

        if (!searchQuery) {
            return [];
        }

        const tokens = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
        // console.log('Search tokens:', tokens);
        const products =  await models.productModel.aggregate([
            // 1️⃣ Match ANY token
            {
                $match: {
                    $or: tokens.map(token => ({
                        $or: [
                            { title: { $regex: token, $options: 'i' } },
                            { description: { $regex: token, $options: 'i' } },
                            { category: { $regex: token, $options: 'i' } },
                            { tags: { $regex: token, $options: 'i' } },

                        ]
                    }))
                }
            },

            // 2️⃣ Score boosting
            {
                $addFields: {
                    score: {
                        $add: [
                            // brand boost (oppo)
                            {
                                $cond: [
                                    { $regexMatch: { input: '$title', regex: tokens[0], options: 'i' } },
                                    50,
                                    0
                                ]
                            },
                            // model boost (a57)
                            {
                                $cond: [
                                    { $regexMatch: { input: '$title', regex: tokens[1] || '', options: 'i' } },
                                    30,
                                    0
                                ]
                            }
                        ]
                    }
                }
            },

            // 3️⃣ Sort by relevance
            { $sort: { score: -1 } },

            // 4️⃣ Pagination
            { $skip: skip },
            { $limit: limit }
        ]);
        // console.log('Search results:', products);
        return products;
    } catch (err) {
        console.log(err);
        throw new Error('Error fetching products');
    }
}

const getHomeDeals = async () => {
    try {
        const deals = await models.productModel.find({ $or: [{ tags: 'trending' }, { tags: 'best_seller' }, { tags: 'new_arrival' }, { tags: 'up_to_50%_off' }] })
        const response = {
            trending: deals.filter(deal => deal.tags.includes('trending')),
            best_seller: deals.filter(deal => deal.tags.includes('best_seller')),
            new_arrival: deals.filter(deal => deal.tags.includes('new_arrival')),
            up_to_50_off: deals.filter(deal => deal.tags.includes('up_to_50%_off')),
        }
        return response;
    } catch (err) {
        console.log(err);
        throw new Error('Error fetching home deals');
    }
}

const getCategories = async () => {
    try {
        const categories = await categoryModels.productCategoryModel.find({})
        return categories;
    } catch (err) {
        console.log(err);
        throw new Error('Error fetching categories');
    }
}

const getProductById = async (productId) => {
    try {
        const product = await models.productModel.findById(productId)
        // console.log('Fetched product:', product);
        // console.log('Product ID:', productId);
        return product;
    } catch (err) {
        console.log(err);
        throw new Error('Error fetching product');
    }
}

const addProduct = async (productData) => {
    try {
        const sellerUserId = productData?.sellerUserId || productData?.userId || productData?.authUserId;
        const sku = `SKU-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        const newProduct = new models.productModel({
            ...productData,
            sellerUserId,
            sku,
            availabilityStatus:'In Stock',
            thumbnail: "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp"
        });
        const response = await newProduct.save();
        return response;
    } catch (err) {
        console.log(err);
        throw new Error('Error adding product');
    }
}


const updateProduct = async (productId, updateData) => {
    try {
        const updated = await models.productModel.findByIdAndUpdate(productId, updateData, { new: true });
        if (!updated) throw new Error('Product not found');
        return updated;
    } catch (err) {
        throw new Error('Error updating product');
    }
}

const deleteProduct = async (productId) => {
    try {
        const deleted = await models.productModel.findByIdAndDelete(productId);
        if (!deleted) throw new Error('Product not found');
        return deleted;
    } catch (err) {
        throw new Error('Error deleting product');
    }
}

const productServices = {
    getAllProducts,
    getHomeDeals,
    getCategories,
    searchProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
}
module.exports = productServices;