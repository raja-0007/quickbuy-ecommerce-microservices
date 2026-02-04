import models from "../models/cart.model.js";
import { v4 as uuidv4 } from 'uuid';

const getCart = async (userId) => {
    try {
        const res = await models.cartModel.findOne({ authUserId: userId })
        return res;
    }
    catch (err) {
        throw new Error('Error fetching cart');
    }
}



const addToCart = async (orderData) => {
    try {
        const cart = await models.cartModel.findOne({ authUserId: orderData.authUserId })
        console.log("Existing Cart:", cart);
        console.log("Order data:", orderData);
        if (!cart) {
            const newCart = new models.cartModel({
                authUserId: orderData.authUserId,
                cartId: uuidv4(),
                items: [
                    {
                        productId: orderData._id,
                        title: orderData.title,
                        brand: orderData.brand,
                        category: orderData.category,
                        description: orderData.description,
                        price: orderData.price,
                        quantity: 1,
                        imageUrl: orderData.images[0],
                        discountPercentage: orderData.discountPercentage || 0,
                        totalPrice: orderData.price - (orderData.price * (orderData.discountPercentage || 0) / 100),

                    }
                ],
                priceDetails: {
                    subTotal: orderData.price - (orderData.price * (orderData.discountPercentage || 0) / 100),
                    tax: 0,
                    shipping: 0,
                    discount: 0,
                    total: orderData.price - (orderData.price * (orderData.discountPercentage || 0) / 100),
                },
            })

            await newCart.save();
            return newCart;
        }
        else{
            // Update existing cart
            console.log("Updating existing cart"); 
            return orderData
        }
        // if(cart){
        //     const existingItems = cart.items;
        //     const newItems = orderData.items;
        //     const updatedItems = [...existingItems];

        //     newItems.forEach(newItem => {
        //         const index = updatedItems.findIndex(item => item.productId === newItem.productId);
        //         if (index !== -1) {
        //             updatedItems[index].quantity += newItem.quantity;
        //             updatedItems[index].totalPrice += newItem.totalPrice;
        //         } else {
        //             updatedItems.push(newItem);
        //         }
        //     });
        //     orderData.items = updatedItems;
        //     orderData.totalAmount = updatedItems.reduce((total, item) => total + item.totalPrice, 0);
        //     const res = await models.cartModel.findOneAndUpdate({ authUserId: orderData.authUserId }, orderData, { new: true });
        //     return res;
        // }else{
        //     orderData.totalAmount = orderData.items.reduce((total, item) => total + item.totalPrice, 0);
        //     orderData.priceDetails = {
        //         price: orderData.items.reduce((total, item) => total + item.price * item.quantity, 0),
        //         tax: 0,
        //         shipping: 0,
        //         discount: orderData.items.reduce((total, item) => total + item.discount, 0),
        //         total: orderData.totalAmount,
        //     };
        //     orderData.meta = {
        //         createdAt: new Date(),
        //         updatedAt: new Date(),
        //     };
        //     const res = await new models.cartModel(orderData).save();
        //     return res;
        // }

        return orderData

    }
    catch (err) {
        throw new Error('Error creating cart');
    }
}

const updateCart = async (orderId, updateData) => {
    try {
        const res = await models.cartModel.findOneAndUpdate({ _id: orderId }, updateData, { new: true })
        return res;
    }
    catch (err) {
        throw new Error('Error updating cart');
    }
}


const deleteCart = async (orderId) => {
    try {
        const res = await models.cartModel.findOneAndDelete({ _id: orderId })
        return res;
    }
    catch (err) {
        throw new Error('Error deleting cart');
    }
}

export default {
    getCart,
    addToCart,
    updateCart,
    deleteCart
}