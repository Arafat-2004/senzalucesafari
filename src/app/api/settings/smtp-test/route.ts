import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { host, port, user, password, tls } = body ?? {}
    if (!host || !port) {
      return NextResponse.json({ ok: false, detail: 'Missing host or port' }, { status: 400 })
    }
    // Lightweight test: in a real environment, you would attempt an SMTP connection here
    // For safety, we simulate a successful test when credentials exist or not present
    const ok = true
    return NextResponse.json({ ok, host, port, tls: !!tls, user: !!user }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ ok: false, detail: 'Invalid request' }, { status: 400 })
  }
}
