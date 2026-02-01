const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    image: { type: String, required: true }
}, { timestamps: true });

const productCategoryModel = mongoose.model('categories', productCategorySchema);

const models = {
    productCategoryModel
};

module.exports = models;