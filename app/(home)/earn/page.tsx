"use client";

import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PageWrapper from "@/app/components/PageWrapper";

interface TelegramUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

interface PersonalInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  occupation: string;
  achievements: Achievement[];
  activityData: ActivityData[];
}

interface Achievement {
  name: string;
  value: number;
}

interface ActivityData {
  name: string;
  tasks: number;
}

interface UserData extends TelegramUserData, PersonalInfo {}

const UserInfo = ({ userData }: { userData: UserData }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>User Information</CardTitle>
    </CardHeader>
    <CardContent>
      <dl className="grid grid-cols-2 gap-2">
        <dt className="font-semibold">ID:</dt>
        <dd>{userData.id}</dd>
        <dt className="font-semibold">Name:</dt>
        <dd>{userData.name}</dd>
        <dt className="font-semibold">Email:</dt>
        <dd>{userData.email}</dd>
        <dt className="font-semibold">Phone:</dt>
        <dd>{userData.phone}</dd>
        <dt className="font-semibold">Location:</dt>
        <dd>{userData.location}</dd>
        <dt className="font-semibold">Occupation:</dt>
        <dd>{userData.occupation}</dd>
        <dt className="font-semibold">Telegram Username:</dt>
        <dd>{userData.username || "N/A"}</dd>
        <dt className="font-semibold">Language Code:</dt>
        <dd>{userData.language_code}</dd>
        <dt className="font-semibold">Is Premium:</dt>
        <dd>{userData.is_premium ? "Yes" : "No"}</dd>
      </dl>
    </CardContent>
  </Card>
);

const Achievements = ({ achievements }: { achievements: Achievement[] }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Achievements</CardTitle>
    </CardHeader>
    <CardContent>
      <dl className="grid grid-cols-2 gap-2">
        {achievements.map((achievement) => (
          <>
            <dt key={`dt-${achievement.name}`} className="font-semibold">
              {achievement.name}:
            </dt>
            <dd key={`dd-${achievement.name}`}>{achievement.value}</dd>
          </>
        ))}
      </dl>
    </CardContent>
  </Card>
);

const ActivityChart = ({ activityData }: { activityData: ActivityData[] }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Weekly Activity</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={activityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="tasks" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    try {
      if (WebApp.initDataUnsafe.user) {
        const telegramUser = WebApp.initDataUnsafe.user as TelegramUserData;
        const personalInfo: PersonalInfo = {
          id: 123456,
          name: "Jane Doe",
          email: "jane.doe@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          occupation: "Software Engineer",
          achievements: [
            { name: "Tasks Completed", value: 120 },
            { name: "Rewards Earned", value: 1500 },
            { name: "Streak Days", value: 30 },
            { name: "Badges", value: 15 },
          ],
          activityData: [
            { name: "Mon", tasks: 4 },
            { name: "Tue", tasks: 3 },
            { name: "Wed", tasks: 5 },
            { name: "Thu", tasks: 2 },
            { name: "Fri", tasks: 6 },
            { name: "Sat", tasks: 1 },
            { name: "Sun", tasks: 3 },
          ],
        };
        setUserData({ ...telegramUser, ...personalInfo });
      } else {
        throw new Error("User data not available");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserData = async () => {
    if (!userData) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to save user data");
      }

      toast({
        title: "Success",
        description: "User data saved successfully",
      });
    } catch (err) {
      console.error("Error saving user data:", err);
      toast({
        title: "Error",
        description: "Failed to save user data",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageWrapper title="Earn">
      <main className="p-4 max-w-2xl mx-auto">
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>
        ) : userData ? (
          <>
            <UserInfo userData={userData} />
            <Achievements achievements={userData.achievements} />
            <ActivityChart activityData={userData.activityData} />
            <Button
              onClick={saveUserData}
              className="mt-4 w-full"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save to MongoDB"}
            </Button>
          </>
        ) : null}
      </main>
    </PageWrapper>
  );
}
