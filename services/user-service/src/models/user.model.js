const mongoose = require('mongoose');

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

    addresses: [
      {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        phone: String,
        isDefault: Boolean,
      },
    ],

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
