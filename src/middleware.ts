import Router from 'next/router'
import { NextResponse, type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('sessionId')?.value
  const previousUrl = request.headers.get('referer') || '/';
  if(currentUser){
    return NextResponse.redirect(new URL(previousUrl, request.url));
  }
}

export const config = {
  matcher: ['/signin', '/signup'],
}