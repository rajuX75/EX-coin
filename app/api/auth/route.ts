// /api/auth

import { encrypt, SESSION_DURATION } from "@/utils/session";
import { validateTelegramWebAppData } from "@/utils/telegramAuth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { initData } = await request.json();
    
    console.log("Received initData:", initData); // Log received data

    const validationResult = validateTelegramWebAppData(initData);

    console.log("Validation result:", validationResult); // Log validation result

    if (validationResult.validatedData) {
      const user = { telegramId: validationResult.user.id };

      // Create a new session for the user
      const expires = new Date(Date.now() + SESSION_DURATION);
      const session = await encrypt({ user, expires });

      console.log("Created session:", session); // Log created session

      // Save the session in a cookie
      cookies().set("session", session, { 
        expires, 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict' // Protect against CSRF
      });

      return NextResponse.json({ message: "Authentication successful" });
    } else {
      console.log("Authentication failed:", validationResult.message); // Log failure reason
      return NextResponse.json(
        { message: validationResult.message },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in /api/auth:", error); // Log any caught errors
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}