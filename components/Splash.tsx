"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Linkedin } from "lucide-react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

const APP_VERSION = "1.34a.7";
const COUNTDOWN_TARGET = new Date("2025-01-01T00:00:00").getTime();

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [serverStatus, setServerStatus] = useState<"online" | "offline">(
    "offline"
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [showRipple, setShowRipple] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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
      toast({
        title: "Authentication Error",
        description: "Failed to check authentication status",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    checkAuth();

    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = COUNTDOWN_TARGET - now;

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 50);

    const serverCheckInterval = setInterval(() => {
      setServerStatus(Math.random() > 0.5 ? "online" : "offline");
    }, 3000);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(progressInterval);
      clearInterval(serverCheckInterval);
    };
  }, [checkAuth]);

  const authenticateUser = async () => {
    setIsLoading(true);
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
          toast({
            title: "Authentication Successful",
            description: "Welcome to EXcoin!",
          });
          router.push("/protected");
        } else {
          throw new Error("Authentication failed");
        }
      } else {
        throw new Error("No init data available");
      }
    } catch (error) {
      console.error("Error authenticating user:", error);
      toast({
        title: "Authentication Failed",
        description: "Please try again.",
        variant: "destructive",
      });
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTap = (event: React.MouseEvent<HTMLDivElement>) => {
    setTapPosition({ x: event.clientX, y: event.clientY });
    setShowRipple(true);
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/protected");
      } else {
        authenticateUser();
      }
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 overflow-hidden cursor-pointer"
      onClick={handleTap}
    >
      <AnimatePresence>
        {showRipple && (
          <motion.div
            className="absolute rounded-full bg-blue-500 opacity-30"
            style={{ left: tapPosition.x, top: tapPosition.y }}
            initial={{ width: 0, height: 0 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            onAnimationComplete={() => setShowRipple(false)}
          />
        )}
      </AnimatePresence>

      <motion.h1
        className="text-6xl font-bold mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-blue-400">EX</span>coin
      </motion.h1>

      <motion.p
        className="text-xl mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        The next generation <br /> cryptocurrency exchange platform
      </motion.p>

      <motion.p
        className="text-lg mb-8 text-center text-green-400 font-semibold"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        Now in mining state! <br /> Launching soon on Binance and BTbit!
      </motion.p>

      <div className="w-64 mb-8">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 2 }}
          />
        </div>
      </div>

      <div className="mb-8 text-center">
        <p className="text-lg mb-2">Countdown to 2025 Launch:</p>
        <div className="flex space-x-4">
          {Object.entries(countdown).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <span className="text-2xl font-bold">{value}</span>
              <span className="text-sm">{unit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <span>Server Status:</span>
        <Badge variant={serverStatus === "online" ? "default" : "destructive"}>
          {serverStatus}
        </Badge>
      </div>

      <div className="flex space-x-4 mt-4 mb-8">
        <Button size="icon" variant="ghost"onClick={() => router.push("https://www.facebook.com/rajux75/")}>
          <Twitter className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => router.push("https://www.facebook.com/rajux75/")}>
          <Facebook className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost"onClick={() => router.push("https://www.facebook.com/rajux75/")}>
          <Linkedin className="h-4 w-4" />
        </Button>
      </div>

      {/* <Accordion type="single" collapsible className="w-full max-w-md mb-8">
        <AccordionItem value="details">
          <AccordionTrigger>Project Overview</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-4 space-y-2">
              <li>Currently in mining state</li>
              <li>Preparing for launch on Binance and BTbit</li>
              <li>Advanced blockchain technology</li>
              <li>High-speed transactions</li>
              <li>Enhanced security measures</li>
              <li>Eco-friendly mining process</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion> */}

      <motion.p
        className="text-lg text-center text-blue-300 animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        Tap anywhere to continue
      </motion.p>

      <motion.div
        className="absolute bottom-4 right-4 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        App Version: {APP_VERSION}
      </motion.div>

      <Toast />
    </div>
  );
}
