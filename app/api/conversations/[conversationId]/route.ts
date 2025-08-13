import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function DELETE(request: NextRequest, { params }: { params: { conversationId: string } }) {
    const { conversationId } = params
    const { user } = getInfo(request)
    try {
        const res = await (client as any).deleteConversation(conversationId, user)
        return NextResponse.json(res?.data ?? { result: 'success' })
    } catch (e: any) {
        return NextResponse.json({ message: e?.message || 'delete error' }, { status: 500 })
    }
}


