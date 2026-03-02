import axios from 'axios'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from "next-auth/providers/google"

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
                    if (err.response && err.response.status == 500) {
                        throw new Error("something went wrong, please try again later");
                    }
                    // return err
                    throw new Error(err.response.data.error || 'Login failed');
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: "/login",
        error: "/login", // optional but recommended
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && account.provider !== "credentials") {
                try {
                    const res = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/auth-login`,
                        {
                            email: user.email,
                            name: user.name,
                            provider: account.provider,
                        }
                    )

                    const backendUser = res.data.user

                    token.accessToken = backendUser.accessToken
                    token.refreshToken = backendUser.refreshToken
                    token.role = backendUser.role
                    token.id = backendUser.id
                    token.name = backendUser.name
                    token.email = backendUser.email
                } catch (err) {
                    console.error("OAuth sync error:", err)
                }
            }

            // 🔹 Credentials login
            if (user && account?.provider === "credentials") {

                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.role = user.role;
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
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

export { handler as GET, handler as POST }