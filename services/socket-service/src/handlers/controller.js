import { getIO } from "../socket/socketManager.js";

const healthCheck = (req, res) => {
  let io = getIO()
  io.to(req.userId).emit('health-check', { status: 'ok' })
  res.json({ status: 'ok', service: 'socket-service' })
}

const emitCart = (req, res) => {
  const cartData = req.body
  // console.log('type of cartData:', typeof cartData)
  let io = getIO()
  io.to(req.params.userId).emit('cart-updated', cartData)
  res.json({ status: 'ok', message: 'Cart data emitted' })
}

const controller = {
  healthCheck, emitCart
}
export default controller;