'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { HomeIcon, DollarSignIcon, ListTodoIcon, UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    { name: 'Home', icon: HomeIcon, path: '/home' },
    { name: 'Earn', icon: DollarSignIcon, path: '/earn' },
    { name: 'Task', icon: ListTodoIcon, path: '/task' },
    { name: 'Me', icon: UserIcon, path: '/me' },
  ];

  return (
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
  );
};

export default Navigation;