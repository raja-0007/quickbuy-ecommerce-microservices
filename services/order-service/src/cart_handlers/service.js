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
                        itemTotal: orderData.price - (orderData.price * (orderData.discountPercentage || 0) / 100),

                    }
                ],
                priceDetails: {
                    subTotal: itemTotal,
                    tax: 0,
                    shipping: 0,
                    discount: 0,
                    total: itemTotal,
                },
            })

            await newCart.save();
            return newCart;
        }
        else{
            // Update existing cart
            let updatedCart = cart
            // console.log("Updating existing cart", updatedCart, "cart", cart); 
            if(updatedCart.items.some(item => item.productId === orderData._id)){
                updatedCart.items = updatedCart.items.map(item => {
                    if(item.productId === orderData._id){
                        const newQuantity = item.quantity + 1;
                        const newItemTotal = item.itemTotal + item.totalPrice
                        return {...item, quantity: newQuantity, itemTotal: newItemTotal}
                    }
                })
            }else{
                updatedCart.items.push({
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
                        itemTotal: orderData.price - (orderData.price * (orderData.discountPercentage || 0) / 100),

                    })
            }

            let newPriceDetails = {...updatedCart.priceDetails}
            newPriceDetails.subTotal = updatedCart.items.reduce((acc, item) => acc + item.itemTotal, 0)
            newPriceDetails.total = newPriceDetails.subTotal + newPriceDetails.tax + newPriceDetails.shipping - newPriceDetails.discount

            updatedCart.priceDetails = newPriceDetails

            const res = await models.cartModel.findOneAndUpdate({ authUserId: orderData.authUserId }, updatedCart, { new: true });

            return res
        }
    }
    catch (err) {
        console.log('Error in addToCart service:', err)
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