import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { url } = body ?? {}
    if (!url) {
      return NextResponse.json({ ok: false, detail: 'Missing url' }, { status: 400 })
    }
    // Simple reachability check - in real usage you would ping the webhook or send a test payload
    return NextResponse.json({ ok: true, url }, { status: 200 })
  } catch {
    return NextResponse.json({ ok: false, detail: 'Invalid request' }, { status: 400 })
  }
}
