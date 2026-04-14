"use client"
import { initSocket } from '@/lib/socket';
import { setCart } from '@/redux/slices/cartSlice';
import { signOut, useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const socketContext = createContext(null)


export const SocketProvider = ({ children, token }) => {
    const [socket, setSocket] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if ((!socket || !socket.connected) && token) {
            // console.log("Initializing socket with token", token)
            let ws = initSocket(token)
            ws.on("connect", () => {
                console.log("Socket connected:");
                setSocket(ws)
            });
            ws.on("cart-updated", (cartData) => {
                // console.log("Cart updated from socket:", cartData);
                dispatch(setCart(cartData)) // Update Redux store with new cart data

            });
            ws.on("disconnect", () => {
                console.log("Socket disconnected");
            });
            ws.on("connect_error", (err) => {
                // console.log("❌ Connect error:", err.message);

                if (err.message === "Authentication error") {
                    console.log("🔐 Token expired → sign out or refresh");
                    signOut()
                }
            });
            ws.on("error", (error) => {
                console.log("Socket error:", error.message);
            });


        }
    }, [socket, token])
    return <socketContext.Provider value={{ socket }}>
        {children}
    </socketContext.Provider>
}

export const useSocket = () => useContext(socketContext)