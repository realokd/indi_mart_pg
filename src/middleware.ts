import Router from 'next/router'
import { NextResponse, type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('sessionId')?.value
  // console.log(currentUser);
  // if (currentUser) {
  //   return NextResponse.next()
  // }
  // return NextResponse.redirect(new URL('/signin', request.url))

  // if (currentUser && !request.nextUrl.pathname.startsWith('/')) {
  //   return Response.redirect(new URL('/', request.url))
  // }

  // if (!currentUser && !request.nextUrl.pathname.startsWith('/signin')) {
  //   return Response.redirect(new URL('/signin', request.url))
  // }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}