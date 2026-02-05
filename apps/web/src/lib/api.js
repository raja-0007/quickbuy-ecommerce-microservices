import axios from 'axios';
import { getSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// const router = useRouter()
const url = process.env.NEXT_PUBLIC_API_URL;
console.log('API URL:', url);

export const axiosHandle = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 5000,
});

axiosHandle.interceptors.request.use(
    async(config)=>{
        const session = await getSession();
        // console.log('session in interceptor', session)
        if(session && session.user && session.user.accessToken){
            config.headers['Authorization'] = `Bearer ${session.user.accessToken}`;
        }

        return config
    },
    (error)=>{
        // console.log('Request error:', error);
        return Promise.reject(error);
    }
)

axiosHandle.interceptors.response.use(
    async(response)=>{
        // console.log('Response:', response);
        return response;
    },
    (error)=>{
        console.log('Response error:', error.response);
        if(error.response && error.response.status === 401){
            // Handle unauthorized access, e.g., redirect to login
            console.log('Unauthorized! Redirecting to login...');
            // router.push('/login');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)