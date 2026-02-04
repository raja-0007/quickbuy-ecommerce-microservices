import axios from 'axios'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'


const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials, req) {
                try {


                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        email: credentials.email,
                        password: credentials.password
                    })
                    return {
                        id: res.data.user.id,
                        email: res.data.user.email,
                        role: res.data.user.role,
                        name: res.data.user.name,
                        accessToken: res.data.user.accessToken,
                        refreshToken: res.data.user.refreshToken
                    }
                } catch (err) {
                    // console.error('Authorize error:', err, err.response);
                    if(err.response && err.response.status == 500){
                        throw new Error("something went wrong, please try again later");
                    }
                    // return err
                    throw new Error(err.response.data.error || 'Login failed');
                }
            }
        })

    ], 
    session: {
        strategy: 'jwt',
    },

    callbacks: {
        async jwt({token, user}) {
            if(user){
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.role = user.role;
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        }, 
        async session({session, token}) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.role = token.role;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.id = token.id;
            return session;
        }
    }
})

export { handler as GET, handler as POST}