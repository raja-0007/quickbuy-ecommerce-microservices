const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
}, { timestamps: true });

const userModel = mongoose.model('users', userSchema);

const models = {
    userModel
};

module.exports = models;