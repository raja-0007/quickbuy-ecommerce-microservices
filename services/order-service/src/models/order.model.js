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
        discount: Number,
        totalPrice: Number,
      },
    ],

    priceDetails:{
        price: Number,
        tax: Number,
        shipping: Number,
        discount: Number,
        total: Number,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['CREATED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
      default: 'CREATED',
    },

    payment_status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
    },

    meta: {
      createdAt: Date,
      updatedAt: Date,
    },
  },
  {
    timestamps: {
      createdAt: 'meta.createdAt',
      updatedAt: 'meta.updatedAt',
    },
  }
);

const orderModel = mongoose.model('orders', orderSchema);

export default { orderModel };

