const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const authMiddleware = require('../middlewares/auth')

dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
    try{
        const response = await axios.post(`${process.env.AUTH_BASE_URL}/register`, req.body);
        res.status(response.status).json(response.data);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try{
        // console.log('gateway login called', req.body);
        const response = await axios.post(`${process.env.AUTH_BASE_URL}/login`, req.body);
        res.status(response.status).json(response.data);    
    }catch(error){
        res.status(500).json({ error: error.message });
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    try{
        const response = await axios.get(`${process.env.AUTH_BASE_URL}/me`, {
        headers: {
          'user_id': req.userId,
          'role': req.role,
          authorization: req.headers.authorization
        }
      })
        res.status(response.status).json(response.data);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
