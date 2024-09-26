import React, { useState, useEffect } from "react";
import { initUtils } from "@telegram-apps/sdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  Copy,
  Users,
  Gift,
  Sparkles,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ReferralSystemProps {
  initData: string;
  userId: string;
  startParam: string;
  onBack: () => void; // New prop for handling back action
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({
  initData,
  userId,
  startParam,
  onBack,
}) => {
  const [referrals, setReferrals] = useState<string[]>([]);
  const [referrer, setReferrer] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const INVITE_URL = "https://t.me/excoin_rjx_bot/";

  useEffect(() => {
    const checkReferral = async () => {
      if (startParam && userId) {
        try {
          const response = await fetch("/api/referrals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, referrerId: startParam }),
          });
          if (!response.ok) throw new Error("Failed to save referral");
        } catch (error) {
          console.error("Error saving referral:", error);
        }
      }
    };

    const fetchReferrals = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/referrals?userId=${userId}`);
          if (!response.ok) throw new Error("Failed to fetch referrals");
          const data = await response.json();
          setReferrals(data.referrals);
          setReferrer(data.referrer);
        } catch (error) {
          console.error("Error fetching referrals:", error);
        }
      }
    };

    checkReferral();
    fetchReferrals();
    setInviteLink(`${INVITE_URL}?startapp=${userId}`);
  }, [userId, startParam]);

  const handleInviteFriend = () => {
    const utils = initUtils();
    const shareText = `Join me on this awesome Telegram mini app!`;
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(
      inviteLink
    )}&text=${encodeURIComponent(shareText)}`;
    utils.openTelegramLink(fullUrl);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateProgress = () => {
    const goal = 10;
    return (referrals.length / goal) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm mx-auto space-y-4"
      >
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="mb-4 hover:bg-white/50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              <Sparkles className="mr-2 h-6 w-6" /> Referral Program
            </CardTitle>
            <CardDescription className="text-center text-white/90 mt-2">
              Invite friends, earn awesome rewards!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {referrer && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4"
              >
                <Badge
                  variant="secondary"
                  className="text-sm px-3 py-1 w-full justify-center"
                >
                  🎉 Referred by user {referrer}
                </Badge>
              </motion.div>
            )}
            <div className="space-y-4">
              <div className="relative">
                <Input
                  value={inviteLink}
                  readOnly
                  className="bg-gray-100 text-sm pr-24 rounded-full"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <Button
                onClick={handleInviteFriend}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-full py-6"
              >
                <Share2 className="mr-2 h-5 w-5" /> Invite Friend
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Gift className="mr-2 text-purple-500" /> Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress
                value={calculateProgress()}
                className="w-full h-3 rounded-full"
              />
              <p className="text-sm text-gray-600 text-center">
                {referrals.length}/10 referrals to next reward
              </p>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence>
          {referrals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Users className="mr-2 text-blue-500" /> Your Referrals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {referrals.slice(0, 3).map((referral, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={`https://api.dicebear.com/6.x/initials/svg?seed=${referral}`}
                            />
                            <AvatarFallback>
                              {referral.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">User {referral}</p>
                            <p className="text-xs text-gray-500">
                              Joined recently
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </motion.li>
                    ))}
                  </ul>
                  {referrals.length > 3 && (
                    <Button variant="link" className="w-full mt-2 text-sm">
                      View all {referrals.length} referrals
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {referrals.length === 0 && (
          <Alert>
            <AlertTitle>No referrals yet</AlertTitle>
            <AlertDescription>
              Start inviting friends to earn rewards and see them listed here!
            </AlertDescription>
          </Alert>
        )}
      </motion.div>
    </div>
  );
};

export default ReferralSystem;
