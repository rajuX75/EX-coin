"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { FaTelegram, FaFacebook, FaYoutube, FaWallet, FaChartLine, FaExchangeAlt, FaLock } from 'react-icons/fa';

const EXcoinLoadingPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentInfo, setCurrentInfo] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [showRipple, setShowRipple] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [coinRotation, setCoinRotation] = useState(0);
  const [activeTab, setActiveTab] = useState('mine');
  const router = useRouter();
  const { toast } = useToast();

  const infoItems = [
    "EXcoin uses advanced quantum-resistant algorithms",
    "Our blockchain can process 100,000 transactions per second",
    "EXcoin is committed to 100% renewable energy mining",
    "Join our community of over 1 million early adopters",
    "Decentralized finance made easy with EXcoin",
    "Instant, fee-less transactions across the globe",
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

    const countdownInterval = setInterval(() => {
      const launchDate = new Date("2025-01-01T00:00:00").getTime();
      const now = new Date().getTime();
      const distance = launchDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    const infoInterval = setInterval(() => {
      setCurrentInfo((prev) => (prev + 1) % infoItems.length);
    }, 5000);

    const miningInterval = setInterval(() => {
      setMiningProgress((prev) => (prev + 1) % 101);
    }, 100);

    const coinRotationInterval = setInterval(() => {
      setCoinRotation((prev) => (prev + 5) % 360);
    }, 50);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(infoInterval);
      clearInterval(miningInterval);
      clearInterval(coinRotationInterval);
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

  const gradientTextClass = "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600";

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-between p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute inset-0 opacity-30">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-emerald-500"
              style={{
                width: Math.random() * 6 + 2 + "px",
                height: Math.random() * 6 + 2 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                animation: `float ${Math.random() * 10 + 5}s linear infinite`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Ripple Effect */}
      <AnimatePresence>
        {showRipple && (
          <motion.div
            className="absolute rounded-full bg-gradient-to-r from-emerald-400 to-teal-600 opacity-30"
            style={{ left: tapPosition.x, top: tapPosition.y }}
            initial={{ width: 0, height: 0 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            onAnimationComplete={() => setShowRipple(false)}
          />
        )}
      </AnimatePresence>

      <header className="w-full text-center z-10">
        <h1 className={`text-5xl font-bold mb-2 ${gradientTextClass}`}>
          EXcoin
        </h1>
        <p className="text-lg text-emerald-200">
          The Future of Crypto
        </p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-md space-y-6 z-10">
        {/* Coin Animation */}
        <div className="relative w-40 h-40">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-600"
            style={{ rotate: coinRotation }}
          />
          <div className="absolute inset-2 rounded-full bg-gray-900 flex items-center justify-center">
            <span className={`text-3xl font-bold ${gradientTextClass}`}>EX</span>
          </div>
        </div>

        {/* Mining Progress */}
        <div className="w-full bg-gray-800 bg-opacity-30 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-emerald-200 text-center mb-2">Mining Progress</p>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <motion.div
              className="bg-emerald-500 h-2.5 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${miningProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-emerald-200 text-center mt-2">{miningProgress}%</p>
        </div>

        {/* Countdown */}
        <div className="w-full bg-gray-800 bg-opacity-30 rounded-lg p-4 backdrop-blur-sm">
          <div className="grid grid-cols-4 gap-2 text-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="flex flex-col items-center">
                <p className={`text-2xl font-bold ${gradientTextClass}`}>
                  {value}
                </p>
                <p className="text-xs text-emerald-200">
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Info Carousel */}
        <div className="h-16 w-full bg-gray-800 bg-opacity-30 rounded-lg p-2 backdrop-blur-sm flex items-center justify-center">
          <p className="text-sm text-emerald-200 text-center">
            {infoItems[currentInfo]}
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="w-full bg-gray-800 bg-opacity-30 rounded-lg p-2 backdrop-blur-sm">
          <div className="flex justify-around mb-2">
            {[
              { id: 'mine', icon: FaWallet, label: 'Mine' },
              { id: 'trade', icon: FaExchangeAlt, label: 'Trade' },
              { id: 'stats', icon: FaChartLine, label: 'Stats' },
              { id: 'secure', icon: FaLock, label: 'Secure' },
            ].map(({ id, icon: Icon, label }) => (
              <motion.button
                key={id}
                className={`flex flex-col items-center p-2 rounded-lg ${
                  activeTab === id ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(id)}
              >
                <Icon className="text-xl text-emerald-200 mb-1" />
                <span className="text-xs text-emerald-200">{label}</span>
              </motion.button>
            ))}
          </div>
          <div className="text-emerald-200 text-center text-sm mb-8">
            {activeTab === 'mine' && 'Mine EXcoin with your device'}
            {activeTab === 'trade' && 'Trade EXcoin securely'}
            {activeTab === 'stats' && 'View your mining statistics'}
            {activeTab === 'secure' && 'Enhance your account security'}
          </div>
        </div>
      </main>

      <footer className="w-full text-center z-10 mt-4">
        {/* Social Buttons */}
        <div className="flex justify-center space-x-4 mb-4">
          {[
            { Icon: FaTelegram, color: "blue", link: "https://t.me/excoin" },
            { Icon: FaFacebook, color: "blue", link: "https://facebook.com/excoin" },
            { Icon: FaYoutube, color: "red", link: "https://youtube.com/excoin" },
          ].map(({ Icon, color, link }) => (
            <motion.a
              key={link}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-2xl text-${color}-500 hover:text-${color}-400`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon />
            </motion.a>
          ))}
        </div>

        <p className="text-emerald-200 text-xs">
          EXcoin &copy; 2024-2025 | v0.8.0
        </p>
      </footer>

      <Toast />
    </div>
  );
};

export default EXcoinLoadingPage;