"use client";

import { useEffect, useState } from "react";
import { WebApp } from "@twa-dev/types";
import PageWrapper from "@/app/components/PageWrapper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
  }
}

type User = {
  id: string;
  telegramId: number;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  points: number;
};

type ErrorType =
  | "FETCH_ERROR"
  | "NO_USER_DATA"
  | "NOT_IN_TELEGRAM"
  | "INCREASE_POINTS_ERROR";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<{
    type: ErrorType;
    message: string;
  } | null>(null);
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isIncreasingPoints, setIsIncreasingPoints] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window === "undefined" || !window.Telegram?.WebApp) {
        setError({
          type: "NOT_IN_TELEGRAM",
          message: "This app should be opened in Telegram",
        });
        setIsLoading(false);
        return;
      }

      const tg = window.Telegram.WebApp;
      tg.ready();

      const initDataUnsafe = tg.initDataUnsafe || {};

      if (!initDataUnsafe.user) {
        setError({ type: "NO_USER_DATA", message: "No user data available" });
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(initDataUnsafe.user),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError({ type: "FETCH_ERROR", message: "Failed to fetch user data" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleIncreasePoints = async () => {
    if (!user) return;

    setIsIncreasingPoints(true);
    try {
      const res = await fetch("/api/increase-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId: user.telegramId }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setUser({ ...user, points: data.points });
        setNotification("Points increased successfully!");
        setTimeout(() => setNotification(""), 3000);
      } else {
        throw new Error(data.error || "Failed to increase points");
      }
    } catch (err) {
      setError({
        type: "INCREASE_POINTS_ERROR",
        message:
          err instanceof Error
            ? err.message
            : "An error occurred while increasing points",
      });
    } finally {
      setIsIncreasingPoints(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper title="Loading">
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="Error">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </PageWrapper>
    );
  }

  if (!user) return null;

  return (
    <PageWrapper title="Earn">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h1>
        <p className="text-lg mb-4">
          Your current points: <span className="font-bold">{user.points}</span>
        </p>
        <Button onClick={handleIncreasePoints} disabled={isIncreasingPoints}>
          {isIncreasingPoints ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Increasing...
            </>
          ) : (
            "Increase Points"
          )}
        </Button>
        {notification && (
          <Alert className="mt-4" variant="default">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{notification}</AlertDescription>
          </Alert>
        )}
      </div>
    </PageWrapper>
  );
}
