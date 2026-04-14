import { io } from "socket.io-client";

let socket = null;

export const initSocket = (token) => {
    if (!socket) {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
        console.log('socket url:', socketUrl)
        console.log('All env vars:', process.env) // Debug: see all available env vars


        socket = io(socketUrl, {
            auth: {
                token
            }
        });

    } else {
        console.log("Socket already initialized", process.env)
    }
    return socket;
}

export const getSocket = () => {
    return socket;
}