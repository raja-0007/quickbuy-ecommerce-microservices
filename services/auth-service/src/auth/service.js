const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user.model');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const externalLogin = async (userData) => {
    let authUser = await user.userModel.findOne({ email: userData.email });
    if (!authUser) {
        const newUser = new user.userModel({
            name: userData.name,
            email: userData.email,
            password: userData.provider,
            role: 'user'
        })

        const res = await newUser.save()
        authUser = res
    }
    const token = jwt.sign({ id: authUser._id, role: authUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: authUser._id, role: authUser.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { id: authUser._id, accessToken: token, refreshToken: refreshToken, role: authUser.role, name: authUser.name, email: authUser.email };
}

const register = async (userData) => {

    const existingUser = await user.userModel.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('User already exists');
        return
    }
    try {
        const hashedPassword = await bycrypt.hash(userData.password, 10);
        const newUser = new user.userModel({
            name: userData.email.split('@')[0],
            email: userData.email,
            password: hashedPassword,
            role: userData.role || 'user'
        })

        const res = await newUser.save()
        return res
    } catch (err) {
        console.log(err.message)
        throw new Error(err.message);

    }



}

const login = async (userData) => {
    // console.log('Inside login service', userData);
    const existingUser = await user.userModel.findOne({ email: userData.email });
    if (!existingUser) {
        throw new Error('User does not exist');
        return
    }
    console.log('Existing user:', existingUser, userData.password);
    const isPasswordValid = await bycrypt.compare(userData.password, existingUser.password.trim())
    console.log('Invalid password', isPasswordValid );
    if (!isPasswordValid) {
        throw new Error('Invalid password');
        return
    }
    // console.log('Password is valid');
    const token = jwt.sign({ id: existingUser._id, role: existingUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: existingUser._id, role: existingUser.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return { id: existingUser._id, accessToken: token, refreshToken: refreshToken, role: existingUser.role, name: existingUser.name, email: existingUser.email };
}

const getUserById = async (userId) => {
    const userDetails = await user.userModel.findById(userId)
    return userDetails;
}

const services = {
    register,
    login,
    getUserById, externalLogin
};

module.exports = services;