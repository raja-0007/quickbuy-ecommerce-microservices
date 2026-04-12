const services = require('./service');

const register = async (req, res) => {
    try{
        const user = await services.register(req.body);
        res.status(201).json({  status:"success", message:"User registered successfully", user:user });
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

const login = async (req, res) => {
    try{
        // console.log('Inside login service controller', req.body);
        const userDetails = await services.login(req.body);
        res.status(200).json({ status:"success", message:"Login successful", user:userDetails });
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}
const externalLogin = async (req, res) => {
    try{
        // console.log('Inside login service controller', req.body);
        const userDetails = await services.externalLogin(req.body);
        res.status(200).json({ status:"success", message:"Login successful", user:userDetails });
    }catch(error){
        console.error('Login error:', error);
        res.status(400).json({ error: error.message });
    }
}

const getMe = async (req, res) => {
    try{
        // const {userId:userd, role} = req.headers
        const userId = req.headers.user_id; // Assuming userId is set in auth middleware
        const user = await services.getUserById(userId);
        res.status(200).json({ status:"success", user:user });
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

const getAllAuthUsers = async (req, res) => {
    try {
        const users = await services.getAllAuthUsers();
        res.status(200).json({ status: 'success', users });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        const updatedUser = await services.updateRole(userId, role);
        res.status(200).json({ status: 'success', user: updatedUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;
        const updatedUser = await services.updateStatus(userId, status);
        res.status(200).json({ status: 'success', user: updatedUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const controllers = {
    register,
    login,
    getMe,
    externalLogin,
    getAllAuthUsers,
    updateRole,
    updateStatus,
}

module.exports = controllers;
