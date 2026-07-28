import { NextResponse } from 'next/server'

const PREVIEW_PASSWORD = 'Keep1!'
const COOKIE_NAME = 'keep_preview'
// 30-day cookie
const MAX_AGE = 60 * 60 * 24 * 30

export async function POST(request: Request) {
  const { password } = await request.json()

  if (password !== PREVIEW_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set(COOKIE_NAME, 'granted', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })
  return res
}
