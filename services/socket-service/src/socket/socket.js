import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export const initSocket = (server)=>{
    const io = new Server(server, {
        cors:{
            origin: "*",
        }
    })
    io.use((socket, next) => {
        const token = socket.handshake.auth.token
        if (!token) {
            return next(new Error("Authentication error"))
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            socket.user = decoded
            next()
        } catch (err) {
            console.log("Socket authentication error:", err)
            next(new Error("Authentication error"))
        }
    })
    io.on("connection", (socket) => {
        const userId = socket.user.id
        console.log("A user connected: " + userId)
        socket.join(userId)

        socket.on("cart:send", async(data)=>{
            console.log("Received cart:send from client for user:", data.message )
            try{
                const res = await fetch(`${process.env.ORDER_BASE_URL}/cart/getCart/${userId}`, {
                    method: 'GET',                })
                const cartData = await res.json()
                // console.log("Fetched cart data from order service:", cartData)
                io.to(userId).emit('cart-updated', cartData)
            }catch(err){
                console.log("Error fetching cart data from order service:", err)
            }
            // await fetch(`${process.env.ORDER_BASE_URL}/cart/getCart/${userId}`, {
            //     method: 'GET',
            //     body: JSON.stringify({ message: "Cart data from client" })
            // })
        })
        socket.on("disconnect", () => {
            console.log("A user disconnected: " + userId)
        })
    })
    return io
}
