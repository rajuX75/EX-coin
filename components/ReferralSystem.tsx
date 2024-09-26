import { initUtils } from "@telegram-apps/sdk";
import React, { useEffect, useState } from "react";
import { toast, useToast } from "@/hooks/use-toast";

interface refferralSystemProps {
  initData: string;
  userId: string;
  startParams: string;
}

const ReferralSystem: React.FC<refferralSystemProps> = ({
  initData,
  userId,
  startParams,
}) => {
  const [referrals, setReferrals] = useState<string[]>([]);
  const [referrar, setReferrar] = useState<string | null>(null);
  const INVITE_URL = "https://ex-coin.vercel.app/start";

  useEffect(() => {
    const checkReferral = async () => {
      if (startParams && userId) {
        try {
          const response = await fetch("/api/referrals", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              ReferrarId: startParams,
            }),
          });
          if (!response.ok) throw new Error("Failed to save referral");
        } catch (error) {
          console.error("Error saving referral: ", error);
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
          setReferrar(data.referrar);
        } catch (error) {
          console.error("Error fetching referrals: ", error);
        }
      }
    };

    checkReferral();
    fetchReferrals();
  }, [userId, startParams]);

  const handleInviteFriend = () => {
    const utils = initUtils();
    const inviteLink = `${INVITE_URL}?startapp=${userId}`;
    const shareText = `Join me on ExCoin! and get a startup bonus!`;
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(
      inviteLink
    )}&text=${encodeURIComponent(shareText)}`;
    utils.openTelegramLink(fullUrl);
  };
  const handleCopyLink = () => {
    const inviteLink = `${INVITE_URL}?startapp=${userId}`;
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Scheduled: Catch up",
      description: "Friday, February 10, 2023 at 5:57 PM",
    });
  };

  return (
    <div className="w-full max-w-md">
      {referrar && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-center">You are invited by {referrar}</p>
        </div>
      )}
      <div className="flex flex-col space-y-4">
        <button
          onClick={handleInviteFriend}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded"
        >
          Invite friend
        </button>
        <button
          onClick={handleCopyLink}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded"
        >
          Copy invite Link
        </button>
      </div>
      {referrals.length > 0 && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-center">Your referrals:</p>
          <ul className="list-disc pl-6">
            {referrals.map((referral, index) => (
              <li key={index} className="bg-green-100 p-2 mb-2 rounded">
                User {referral}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReferralSystem;
