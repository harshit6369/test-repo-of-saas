import { Tabs } from 'expo-router';
import React from 'react';
import { 
  Home, 
  Users, 
  Mail, 
  Workflow, 
  Calendar,
  CreditCard,
  Settings,
  LayoutDashboard
} from 'lucide-react-native';
import { useAuth } from '@/providers/auth-provider';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6B46C1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          paddingTop: 5,
          height: Platform.OS === 'ios' ? 85 : 60,
        },
        headerStyle: {
          backgroundColor: '#6B46C1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600' as const,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="campaigns"
        options={{
          title: 'Campaigns',
          tabBarIcon: ({ color }) => <Mail size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="automation"
        options={{
          title: 'Automation',
          tabBarIcon: ({ color }) => <Workflow size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      {isAdmin && (
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
          }}
        />
      )}
    </Tabs>
  );
}
