import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// const router = useRouter()
const url = process.env.NEXT_PUBLIC_API_URL;
const SESSION_CACHE_MS = 2 * 60 * 1000;
let cachedSession = null;
let cachedSessionTime = 0;

const getCachedSession = async () => {
    const now = Date.now();
    if (cachedSession && now - cachedSessionTime < SESSION_CACHE_MS) {
        return cachedSession;
    }

    cachedSession = await getSession();
    cachedSessionTime = now;
    return cachedSession;
};

export const axiosHandle = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 5000,
});

axiosHandle.interceptors.request.use(
    async(config)=>{
        const session = await getCachedSession();
        if(session && session.user && session.user.accessToken){
            config.headers['Authorization'] = `Bearer ${session.user.accessToken}`;
        }

        return config
    },
    (error)=>{
        return Promise.reject(error);
    }
)

axiosHandle.interceptors.response.use(
    async(response)=>{
        return response;
    },
    async(error)=>{
        console.log('Response error:', error.response);
        if(error.response && error.response.status === 401){
            cachedSession = null;
            cachedSessionTime = 0;
            console.log('Unauthorized! Redirecting to login...');
            await signOut();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
)
