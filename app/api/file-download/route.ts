import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url')
    const filename = request.nextUrl.searchParams.get('filename') || 'download.md'
    if (!url)
        return new Response('missing url', { status: 400 })

    try {
        const res = await fetch(url, { credentials: 'include' })
        if (!res.ok) {
            return new Response('not found', { status: res.status })
        }
        const buf = await res.arrayBuffer()
        return new Response(buf, {
            status: 200,
            headers: {
                'Content-Type': 'text/markdown; charset=utf-8',
                'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
                'Cache-Control': 'no-store',
            },
        })
    } catch (e: any) {
        return new Response('download error', { status: 500 })
    }
}


