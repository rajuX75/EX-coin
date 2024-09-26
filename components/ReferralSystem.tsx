import React, { useState, useEffect } from "react";
import { initUtils } from "@telegram-apps/sdk";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, Users } from "lucide-react";

interface ReferralSystemProps {
  initData: string;
  userId: string;
  startParam: string;
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({
  initData,
  userId,
  startParam,
}) => {
  const [referrals, setReferrals] = useState<string[]>([]);
  const [referrer, setReferrer] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState("");
  const INVITE_URL = "https://t.me/excoin_rjx_bot/start";

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
    alert("Invite link copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto p-4"
    >
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Referral System
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrer && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <Badge variant="secondary" className="text-sm">
                Referred by user {referrer}
              </Badge>
            </motion.div>
          )}
          <div className="space-y-4">
            <Input
              value={inviteLink}
              readOnly
              className="bg-gray-100 text-sm"
            />
            <div className="flex space-x-2">
              <Button onClick={handleInviteFriend} className="flex-1">
                <Share2 className="mr-2 h-4 w-4" /> Invite Friend
              </Button>
              <Button onClick={handleCopyLink} variant="outline" className="flex-1">
                <Copy className="mr-2 h-4 w-4" /> Copy Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {referrals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Users className="mr-2" /> Your Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {referrals.map((referral, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md"
                  >
                    <Avatar>
                      <AvatarFallback>{referral.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>User {referral}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReferralSystem;