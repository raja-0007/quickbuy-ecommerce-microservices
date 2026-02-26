const axios = require('axios');

const getAllUsers = async(req, res) => {
    try{
        const resp = await axios.get(`${process.env.USER_BASE_URL}/getAllUsers`);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
    
}

const getProfile = async(req, res) => {
    try{
        console.log('Fetching profile for user: in gateawy', req.userId)
        const resp = await axios.get(`${process.env.USER_BASE_URL}/getProfile/${req.userId}`);
        console.log('User profile response:', resp.data, req.userId);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

const createUser = async(req, res) => {
    try{
        const resp = await axios.post(`${process.env.USER_BASE_URL}/createUser`, {...req.body, authUserId: req.userId});
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

const updateUser = async(req, res) => {
    try{
        const resp = await axios.put(`${process.env.USER_BASE_URL}/updateUser/${req.userId}`, req.body);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}
const updateAddress = async(req, res) => {
    try{
        const resp = await axios.put(`${process.env.USER_BASE_URL}/updateAddress/${req.userId}`, req.body);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

const deleteUser = async(req, res) => {
    try{
        const resp = await axios.delete(`${process.env.USER_BASE_URL}/deleteUser/${req.params.id}`);
        res.status(resp.status).json(resp.data);
    }catch(err){
        res.status(err.status).json({ error: err.message });
    }
}

module.exports = {
    getAllUsers, getProfile, createUser, updateUser, deleteUser, updateAddress
};