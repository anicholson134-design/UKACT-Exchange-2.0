import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase/env'

const PREVIEW_EXEMPT = ['/preview-access', '/api/preview-access', '/auth/callback']

// Middleware runs in front of every page, including public ones — if
// Supabase is ever slow or unreachable (wrong/placeholder URL, network
// blip), a bare `await` here would hang the entire site until Vercel's
// platform-level timeout kills the request with a 504. Race it instead so
// a slow auth check degrades to "treat as logged out" rather than taking
// the whole site down.
const AUTH_CHECK_TIMEOUT_MS = 4000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return new Promise(resolve => {
    const timer = setTimeout(() => resolve(null), ms)
    promise.then(result => { clearTimeout(timer); resolve(result) })
      .catch(() => { clearTimeout(timer); resolve(null) })
  })
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ── Preview password gate ────────────────────────────────────
  const isExempt = PREVIEW_EXEMPT.some(p => pathname.startsWith(p))
  if (!isExempt) {
    const previewCookie = request.cookies.get('ukact_preview')
    if (previewCookie?.value !== 'granted') {
      return NextResponse.redirect(new URL('/preview-access', request.url))
    }
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const authResult = await withTimeout(supabase.auth.getUser(), AUTH_CHECK_TIMEOUT_MS)
  if (authResult === null) {
    // Supabase didn't respond in time — don't hang the whole site waiting;
    // fall through as a guest so public pages still render. Protected
    // routes below will correctly redirect to /login since `user` is null.
    console.warn('[middleware] Supabase auth check timed out — continuing as guest')
  }
  const { data: { user } } = authResult ?? { data: { user: null } }

  // Auth routes — redirect logged-in users to their dashboard
  const isAuthRoute = ['/login', '/register'].some(p => pathname.startsWith(p))
  if (isAuthRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const dest = profile?.role === 'admin'
      ? '/admin/dashboard'
      : profile?.role === 'employer'
      ? '/employer/dashboard'
      : '/candidate/dashboard'

    return NextResponse.redirect(new URL(dest, request.url))
  }

  // Protected routes — redirect unauthenticated users to login
  const protectedPrefixes = ['/candidate', '/employer', '/admin']
  if (protectedPrefixes.some(p => pathname.startsWith(p)) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (!user) return supabaseResponse

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role

  // Role enforcement
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (pathname.startsWith('/employer') && role !== 'employer') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (pathname.startsWith('/candidate') && role !== 'candidate') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Employer approval gate
  if (pathname.startsWith('/employer') && !pathname.startsWith('/employer/pending') && role === 'employer') {
    const { data: emp } = await supabase
      .from('employer_profiles')
      .select('status')
      .eq('id', user.id)
      .single()

    if (emp && emp.status !== 'approved') {
      return NextResponse.redirect(new URL('/employer/pending', request.url))
    }
  }

  // Candidate approval gate
  if (pathname.startsWith('/candidate') && !pathname.startsWith('/candidate/pending') && role === 'candidate') {
    const { data: cand } = await supabase
      .from('candidate_profiles')
      .select('status')
      .eq('id', user.id)
      .single()

    if (cand && cand.status !== 'approved') {
      return NextResponse.redirect(new URL('/candidate/pending', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
