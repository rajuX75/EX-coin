"use client"

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { HomeIcon, DollarSignIcon, ListTodoIcon, UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    { name: 'Home', icon: HomeIcon, path: '/' },
    { name: 'Earn', icon: DollarSignIcon, path: '/earn' },
    { name: 'Task', icon: ListTodoIcon, path: '/task' },
    { name: 'Me', icon: UserIcon, path: '/me' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <main className="flex-grow p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-3xl shadow-lg">
        <div className="flex justify-around items-center h-20 px-4">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={`flex flex-col items-center py-2 px-4 relative ${
                pathname === item.path ? 'text-blue-600' : 'text-gray-600'
              }`}
              onClick={() => router.push(item.path)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon className="h-6 w-6" />
              </motion.div>
              <span className="text-xs mt-1">{item.name}</span>
              {pathname === item.path && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                  layoutId="underline"
                />
              )}
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
};

const PageWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Card className="w-full max-w-md mx-auto">
    <CardContent className="p-6">
      <motion.h1
        className="text-3xl font-bold mb-4 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {children}
      </motion.div>
    </CardContent>
  </Card>
);

const HomePage: React.FC = () => (
  <PageWrapper title="Home">
    <p className="text-gray-600">Welcome to the home page!</p>
  </PageWrapper>
);

const EarnPage: React.FC = () => (
  <PageWrapper title="Earn">
    <p className="text-gray-600">Here you can find ways to earn rewards.</p>
  </PageWrapper>
);

const TaskPage: React.FC = () => (
  <PageWrapper title="Tasks">
    <p className="text-gray-600">Your tasks and to-do list will appear here.</p>
  </PageWrapper>
);

const MePage: React.FC = () => (
  <PageWrapper title="Me">
    <p className="text-gray-600">Your profile and settings can be found here.</p>
  </PageWrapper>
);

const Home: React.FC = () => (
  <Layout>
    <HomePage />
  </Layout>
);

export const Earn: React.FC = () => (
  <Layout>
    <EarnPage />
  </Layout>
);

export const Task: React.FC = () => (
  <Layout>
    <TaskPage />
  </Layout>
);

export const Me: React.FC = () => (
  <Layout>
    <MePage />
  </Layout>
);

export default Home;