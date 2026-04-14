import { io } from "socket.io-client";

let socket = null;

export const initSocket = (token) => {
    if (!socket) {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
        
        socket = io(socketUrl, {
            auth: {
                token
            }
        });

    }
    return socket;
}

export const getSocket = () => {
    return socket;
}