const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price : { type: Number, required: true },
    discountPercentage: { type: Number },
    rating: { type: Number },
    stock: { type: Number, required: true },
    tags: { type: [String] },
    brand: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    weight: { type: Number },
    dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number }
    },
    warrantyInformation: { type: String },
    shippingInformation: { type: String },
    availabilityStatus: { type: String, required: true },
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        rating: { type: Number, required: true },
        comment: { type: String },
        reviewerName: { type: String },
        reviewerEmail: { type: String },
        date: { type: Date, default: Date.now }
    }, { timestamps: true }],
    returnPolicy: { type: String },
    minimumOrderQuantity: { type: Number, default: 1 },
    thumbnail: { type: String, required: true },
    images: { type: [String], required: true }
}, { timestamps: true });


const productModel = mongoose.model('products', productSchema);

const models = {
    productModel
};

module.exports = models;
