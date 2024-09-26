"use client";

import ReferralSystem from "@/components/ReferralSystem";
import { useEffect, useState } from "react";

export default function Home() {
  const [initData, setInitData] = useState("");
  const [userId, setUserId] = useState("");
  const [startParam, setStartParam] = useState("");

  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== "undefined") {
        const WebApp = (await import("@twa-dev/sdk")).default;
        WebApp.ready();
        setInitData(WebApp.initData);
        setUserId(WebApp.initDataUnsafe.user?.id.toString() || "");
        setStartParam(WebApp.initDataUnsafe.start_param || "");
      }
    };

    initWebApp();
  }, []);

  return (
    <main>
      <ReferralSystem
        initData={initData}
        userId={userId}
        startParam={startParam}
        onBack={() => {
          // Handle navigation back to the previous screen or main menu
        }}
      />
    </main>
  );
}
