import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function POST(req: NextRequest) {
    try {
        const { telegramId } = await req.json()

        if (!telegramId) {
            return NextResponse.json({ error: 'Invalid telegramId' }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { telegramId },
            data: { points: { increment: 1 } }
        })

        return NextResponse.json({ success: true, points: updatedUser.points })
    } catch (error) {
        console.error('Error increasing points:', error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return NextResponse.json({ error: 'User not found' }, { status: 404 })
            }
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}