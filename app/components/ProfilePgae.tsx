'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Briefcase, Book, Award, 
  Settings, Shield, Bell, CreditCard, Languages, Activity
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';


const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const personalInfo = {
    id: 123456,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    occupation: 'Software Engineer',
    achievements: [],
    activityData: []
  };

  const achievements = [
    { name: 'Tasks Completed', value: 120 },
    { name: 'Rewards Earned', value: 1500 },
    { name: 'Streak Days', value: 30 },
    { name: 'Badges', value: 15 },
  ];

  const activityData = [
    { name: 'Mon', tasks: 4 },
    { name: 'Tue', tasks: 3 },
    { name: 'Wed', tasks: 5 },
    { name: 'Thu', tasks: 2 },
    { name: 'Fri', tasks: 6 },
    { name: 'Sat', tasks: 1 },
    { name: 'Sun', tasks: 3 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Profile</CardTitle>
            <CardDescription>Manage your account and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              <Button 
                variant={activeTab === 'personal' ? 'default' : 'outline'}
                onClick={() => setActiveTab('personal')}
              >
                Personal Info
              </Button>
              <Button 
                variant={activeTab === 'achievements' ? 'default' : 'outline'}
                onClick={() => setActiveTab('achievements')}
              >
                Achievements
              </Button>
              <Button 
                variant={activeTab === 'preferences' ? 'default' : 'outline'}
                onClick={() => setActiveTab('preferences')}
              >
                Preferences
              </Button>
              <Button 
                variant={activeTab === 'security' ? 'default' : 'outline'}
                onClick={() => setActiveTab('security')}
              >
                Security
              </Button>
            </div>

            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <span>{personalInfo.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span>{personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span>{personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>{personalInfo.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  <span>{personalInfo.occupation}</span>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          {achievement.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{achievement.value}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="tasks" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="notifications">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notifications
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Email Notifications</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Push Notifications</span>
                        <Switch />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="language">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Languages className="w-5 h-5" />
                      Language
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        English
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Spanish
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        French
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="theme">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Theme
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        Light
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Dark
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        System
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Password</h3>
                  <Button variant="outline">Change Password</Button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <span>Enable 2FA</span>
                    <Switch />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Login History</h3>
                  <Button variant="outline">View Login History</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfilePage;