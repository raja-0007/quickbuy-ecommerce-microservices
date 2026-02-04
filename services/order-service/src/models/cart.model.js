import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    authUserId: {
      type: String,
      required: true,
      index: true,
    },

    cartId: {type: String, required: true, index: true},

    items: [
      {
        productId: String,
        title: String,
        brand: String,
        category: String,
        description: String,
        price: Number,
        quantity: Number,
        imageUrl: String,
        discountPercentage: Number,
        totalPrice: Number,
      },
    ],

    priceDetails:{
        subTotal: Number,
        tax: Number,
        shipping: Number,
        discount: Number,
        total: Number,
    },
  },
  {
    timestamps: true,
  }
);

const cartModel = mongoose.model('cart', cartSchema);

export default { cartModel };

