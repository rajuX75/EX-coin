import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function POST(req: NextRequest) {
    try {
        const userData = await req.json()

        if (!userData || !userData.id) {
            return NextResponse.json({ error: 'Invalid user data' }, { status: 400 })
        }

        let user = await prisma.user.findUnique({
            where: { telegramId: userData.id }
        })

        if (!user) {
            try {
                user = await prisma.user.create({
                    data: {
                        telegramId: userData.id,
                        username: userData.username || '',
                        firstName: userData.first_name || '',
                        lastName: userData.last_name || ''
                    }
                })
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                        return NextResponse.json({ error: 'User already exists' }, { status: 409 })
                    }
                }
                throw error
            }
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Error processing user data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}