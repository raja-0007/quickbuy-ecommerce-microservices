import axios from 'axios';
import { getSession } from 'next-auth/react';

const url = process.env.NEXT_PUBLIC_API_URL;
console.log('API URL:', url);

export const axiosHandle = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 5000,
});

axiosHandle.interceptors.request.use(
    async(config)=>{
        const session = await getSession();
        if(session.user.accessToken){
            config.headers['Authorization'] = `Bearer ${session.user.accessToken}`;
        }

        return config
    },
    (error)=>Promise.reject(error)
)