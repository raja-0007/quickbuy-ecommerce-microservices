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
        // console.log('Registration error in gateway:', error.response)
        res.status(error.status || 500).json({ error: error.response.data.error || 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
    try{
        // console.log('gateway login called', req.body);
        const response = await axios.post(`${process.env.AUTH_BASE_URL}/login`, req.body);
        // console.log('Login response from auth service:', response.data);
        res.status(response.status).json(response.data);    
    }catch(error){
        // console.error('Login error in gateway:', error);
        res.status(error.status || 500).json({ error: error.response.data.error || 'Login failed' });
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
        res.status(error.status || 500).json({ error: error.message });
    }
});


module.exports = router;
