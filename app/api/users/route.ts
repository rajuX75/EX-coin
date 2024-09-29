import { NextResponse } from 'next/server'
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI as string
const client = new MongoClient(uri)

export async function POST(request: Request) {
  try {
    const userData = await request.json()
    
    await client.connect()
    const database = client.db('telegram_web_app')
    const users = database.collection('users')
    
    const result = await users.updateOne(
      { id: userData.id },
      { $set: userData },
      { upsert: true }
    )

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Error storing user data:', error)
    return NextResponse.json({ success: false, error: 'Failed to store user data' }, { status: 500 })
  } finally {
    await client.close()
  }
}