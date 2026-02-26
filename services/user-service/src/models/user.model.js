const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    id: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    phone: String,
    isDefault: Boolean
  },
  { _id: false }
);



const userSchema = new mongoose.Schema(
  {
    // 🔗 LINK TO AUTH SERVICE
    authUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // 👤 PROFILE DATA
    name: { type: String, required: true },
    phone: { type: String },
    firstName: String,
    lastName: String,
    email: { type: String, required: true },

    addresses: {
      type: [addressSchema],
      default: []
    },

    // 🧾 METADATA
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



const userModel = mongoose.model('users', userSchema);
const models = { userModel }
module.exports = models;
