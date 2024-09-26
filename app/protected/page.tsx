"use client";

import ReferralSystem from "@/components/ReferralSystem";
import { useEffect, useState } from "react";

export default function ProtectedPage() {
  const [initData, setInitData] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [startParams, setStartParams] = useState<string>("");

  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== "undefined") {
        const WebApp = (await import("@twa-dev/sdk")).default;
        WebApp.ready();
        setInitData(WebApp.initData);
        setUserId(WebApp.initDataUnsafe.user?.id.toString() || "");
        setStartParams(WebApp.initDataUnsafe.start_param || "");
      }
    };
    initWebApp();
  }, []);
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Home Page</h1>
      <ReferralSystem
        initData={initData}
        userId={userId}
        startParams={startParams}
      />
    </div>
  );
}
