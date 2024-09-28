"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Toast } from "@/components/ui/toast";

const EXcoinLoadingPage = () => {
  const [miningProgress, setMiningProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [currentInfo, setCurrentInfo] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [showRipple, setShowRipple] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const infoItems = [
    "EXcoin uses advanced quantum-resistant algorithms",
    "Our blockchain can process 100,000 transactions per second",
    "EXcoin is committed to 100% renewable energy mining",
    "Join our community of over 1 million early adopters"
  ];

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

    const interval = setInterval(() => {
      setMiningProgress(prev => (prev < 100 ? prev + 1 : 0));
    }, 1000);

    const countdownInterval = setInterval(() => {
      const launchDate = new Date('2025-01-01T00:00:00').getTime();
      const now = new Date().getTime();
      const distance = launchDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    const infoInterval = setInterval(() => {
      setCurrentInfo(prev => (prev + 1) % infoItems.length);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
      clearInterval(infoInterval);
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

  const gradientTextClass = "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600";

  return (
    <div 
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-between p-6 relative overflow-hidden cursor-pointer"
      onClick={handleTap}
    >
      {/* SVG Background */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Enhanced Water Ripple Effect */}
      <AnimatePresence>
        {showRipple && (
          <motion.div
            className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-600 opacity-50"
            style={{ left: tapPosition.x, top: tapPosition.y }}
            initial={{ width: 0, height: 0 }}
            animate={{ width: 500, height: 500, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            onAnimationComplete={() => setShowRipple(false)}
          />
        )}
      </AnimatePresence>

      <div className="z-10 w-full max-w-xs space-y-8">
        <h1 className={`text-5xl font-bold text-center mb-2 ${gradientTextClass} animate-pulse`}>EXcoin</h1>
        <p className="text-lg text-center mb-4 text-blue-200">The Future of Crypto</p>

        {/* Improved Visualizer Loader */}
        <div className="relative w-full h-64">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            {[...Array(12)].map((_, index) => (
              <motion.rect
                key={index}
                x={97}
                y={20}
                width="6"
                height="60"
                rx="3"
                fill="url(#loaderGradient)"
                transform={`rotate(${index * 30} 100 100)`}
                animate={{
                  scaleY: [1, 1.8, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
              />
            ))}
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="url(#loaderGradient)"
              strokeWidth="4"
              strokeDasharray={`${miningProgress * 3.77} 377`}
              transform="rotate(-90 100 100)"
            />
            <text x="100" y="100" textAnchor="middle" dy="0.3em" fill="#ffffff" fontSize="24" fontWeight="bold">
              {miningProgress}%
            </text>
          </svg>
        </div>

        {/* Countdown */}
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 backdrop-blur-sm">
          <div className="grid grid-cols-4 gap-2 text-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit}>
                <p className={`text-xl font-bold ${gradientTextClass}`}>{value}</p>
                <p className="text-xs text-gray-300">{unit.charAt(0).toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info Carousel */}
        <div className="h-16 bg-gray-800 bg-opacity-50 rounded-lg p-4 backdrop-blur-sm flex items-center justify-center">
          <p className="text-sm text-blue-200 text-center">{infoItems[currentInfo]}</p>
        </div>

        {/* Tap Instruction */}
        <p className="text-blue-200 text-center animate-pulse">
          {isAuthenticated
            ? "Tap anywhere to access the protected page"
            : "Tap anywhere to authenticate and continue"}
        </p>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      <footer className="text-center text-xs text-blue-200 z-10">
        <p>EXcoin &copy; 2024-2025 | v0.6.0</p>
      </footer>

      <Toast />
    </div>
  );
};

export default EXcoinLoadingPage;