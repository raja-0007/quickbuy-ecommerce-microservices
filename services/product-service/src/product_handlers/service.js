const { response } = require('express');
const models = require('../models/product.model')
const categoryModels = require('../models/productCategory.model')

const getAllProducts = async (limit = 10, page = 1, searchQuery = '') => {
    try {
        const skip = (page - 1) * limit;
        const filter = searchQuery === '' ? {} : {
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { category: { $regex: searchQuery, $options: 'i' } },
                { tags: { $regex: searchQuery, $options: 'i' } }
            ]
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

        return await models.productModel.aggregate([
            // 1️⃣ Match ANY token
            {
                $match: {
                    $or: tokens.map(token => ({
                        $or: [
                            { title: { $regex: token, $options: 'i' } },
                            { description: { $regex: token, $options: 'i' } },
                            { category: { $regex: token, $options: 'i' } },
                            { tags: { $regex: token, $options: 'i' } }
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

const productServices = {
    getAllProducts,
    getHomeDeals,
    getCategories,
    searchProducts
}
module.exports = productServices;