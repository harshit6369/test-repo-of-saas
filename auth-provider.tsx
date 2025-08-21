import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { User, UserRole } from '@/types/auth';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API call
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'team_member',
      company: 'FramefyInFlow Corp',
      avatar: `https://ui-avatars.com/api/?name=${email}&background=6B46C1&color=fff`,
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    router.replace('/(tabs)');
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, role: UserRole) => {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      company: 'New Company',
      avatar: `https://ui-avatars.com/api/?name=${name}&background=6B46C1&color=fff`,
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    router.replace('/(tabs)');
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    router.replace('/login');
  }, []);

  return useMemo(() => ({
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  }), [user, isLoading, login, signup, logout]);
});
