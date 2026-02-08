import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    authUserId: {
      type: String,
      required: true,
      index: true,
    },

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
        itemTotal: Number,
      },
    ],

    priceDetails:{
        subTotal: Number,
        tax: Number,
        shipping: Number,
        discount: Number,
        total: Number,
    },
    paymentDetails: {
      paymentId: String,
      method: String,
      amount: Number,
      currency: String,
      status:{
        type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PENDING'},
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      razorpay: Object
      
    },
    status: {
      type: String,
      enum: ['CREATED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
      default: 'CREATED',
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model('orders', orderSchema);

export default { orderModel };

