import { io } from "socket.io-client";

let socket = null;

export const initSocket = (token) => {
    if (!socket) {

        socket = io("http://localhost:4005", {
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