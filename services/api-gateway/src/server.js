const express = require('express');
const app = require('./app');


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});