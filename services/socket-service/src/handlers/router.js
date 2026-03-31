import express from 'express';
import controller from './controller.js';

const router = express.Router()

router.get('/health', controller.healthCheck)
router.post('/emit-cart/:userId', controller.emitCart)

export default router;