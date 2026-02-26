const models = require("../models/user.model")

const getAllUsers = async () => {
    try {
        const res = await models.userModel.find({})
        return res;
    } catch (err) {
        throw new Error('Error fetching users');
    }
}

const getProfile = async (userId) => {
    try {
        const res = await models.userModel.findOne({ authUserId: userId })
        return res;
    } catch (err) {
        throw new Error('Error fetching user profile');
    }

}

const createUser = async (userData) => {
    try {
        console.log('creating user', userData)
        const newUser = new models.userModel({
            // 🔗 LINK TO AUTH SERVICE
            authUserId: userData.authUserId,

            // 👤 PROFILE DATA
            name: `${userData.firstName} || ${userData?.lastName || ''}`,
            phone: userData?.phone || '',
            firstName: userData?.firstName,
            lastName: userData?.lastName || '',
            email: userData.email,

            addresses: [],

            // 🧾 METADATA
            meta: {
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        })
        const res = await newUser.save()
        return res;
    } catch (err) {
        console.log(err)
        throw new Error('Error creating user');
    }

}

const updateUser = async (userId, updateData) => {
    try {
        const res = await models.userModel.findOneAndUpdate({ authUserId: userId }, updateData, { new: true })
        return res;
    } catch (err) {
        throw new Error('Error updating user');
    }

}

const updateAddress = async (userId, updateData) => {
   
    const user = await models.userModel.findOne({ authUserId: userId })
    let addresses = user.addresses || []
    let newAddresses = []
    if (addresses.length > 0 && addresses.some(address => address.id === updateData.id)) {
        newAddresses = addresses.map(address => {
            if (address.id === updateData.id) {
                return updateData
            } else {
                return address
            }
        })
    } else {
        newAddresses = [...addresses, updateData]
    }
    try {
        const res = await models.userModel.findOneAndUpdate({ authUserId: userId }, { addresses: newAddresses }, { new: true })
        return res;
    } catch (err) {
        throw new Error('Error updating Addresses');
    }
}


const deleteUser = async (userId) => {
    try {
        const res = await models.userModel.findOneAndDelete({ authUserId: userId })
        return res;
    } catch (err) {
        throw new Error('Error deleting user');
    }

}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getProfile,
    updateAddress

}