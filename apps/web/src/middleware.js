import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import { hasPagePermission } from "./lib/roleCheck"

const publicRoutes = ['/', '/dashboard']
const privateRoutes = ['/profile']
const restrictedRoutes = ['/testPage']

export const middleware = async(req) => {
    const { pathname } = req.nextUrl
    console.log('pathname', pathname)
    const token = await getToken({req})
    // console.log('token in middleware', token)
    if(privateRoutes.includes(pathname)){
        if(!token){    
            const loginUrl = new URL('/login', req.url)
            loginUrl.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(loginUrl)
       
        }else if(restrictedRoutes.includes(pathname)){
            const permission = await hasPagePermission(pathname, token)
            if(!permission){
                return NextResponse.redirect(new URL('/dashboard', req.url))
            }
            else{
                return NextResponse.next()
            }

        }
        else{
            return NextResponse.next()
        }
    }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}