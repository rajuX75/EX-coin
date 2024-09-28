"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";


export default function TelegramAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/session");
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setError("Failed to check authentication status");
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const authenticateUser = async () => {
    try {
      const WebApp = (await import("@twa-dev/sdk")).default;
      WebApp.ready();
      const initData = WebApp.initData;
      if (initData) {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ initData: initData }),
        });
        if (response.ok) {
          setIsAuthenticated(true);
          router.refresh();
        } else {
          throw new Error("Authentication failed");
        }
      } else {
        throw new Error("No init data available");
      }
    } catch (error) {
      console.error("Error authenticating user:", error);
      setError("Authentication failed. Please try again.");
      setIsAuthenticated(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 p-8">
      {error && <p className="text-red-500">{error}</p>}
      {isAuthenticated ? (
        <>
          <p>Authenticated!</p>
          <button
            type="button"
            onClick={() => router.push("/protected")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Access Protected Page
          </button>
        </>
      ) : (
        <>
          <p>You need to be an owner of this account</p>
          <button
            type="button"
            onClick={authenticateUser}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Authenticate
          </button>
          
        </>
      )}
    </div>
  );
}