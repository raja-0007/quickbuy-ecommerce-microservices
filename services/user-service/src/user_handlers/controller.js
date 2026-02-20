const services = require("./service")

const getAllUsers = async (req, res) =>{
    try{
        const users = await services.getAllUsers()
        res.status(200).json(users)
    }catch(err){
        res.status(500).json({error: err.message})
    }
    
}

const getProfile = async (req, res) =>{
    try{
        const user = await services.getProfile(req.params.userId)
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

const createUser = async (req, res) =>{
    try{
        console.log('going to create user', req.body.authUserId)
        const user = await services.createUser(req.body)
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({error: err.message})
    }
    
}

const updateUser = async (req, res) =>{
    try{
        const user = await services.updateUser(req.params.id, req.body)
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({error: err.message})
    }
    
}

const deleteUser = async (req, res) =>{
    try{
        const user = await services.deleteUser(req.params.id)
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}


const controllers = {
    getAllUsers, createUser, updateUser, deleteUser, getProfile
}
module.exports = controllers;