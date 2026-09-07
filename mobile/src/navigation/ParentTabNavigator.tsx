import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { ParentDashboardScreen } from '../screens/parent/ParentDashboardScreen';
import { ParentChildrenScreen } from '../screens/parent/ParentChildrenScreen';
import { ParentReportsScreen } from '../screens/parent/ParentReportsScreen';
import { StudyGroupsScreen } from '../screens/student/StudyGroupsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { LayoutDashboard, HeartHandshake, BarChart3, MessagesSquare, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export const ParentTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.cardBorder,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="ParentHome"
        component={ParentDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size - 2} color={color} />,
        }}
      />

      <Tab.Screen
        name="ParentChildrenTab"
        component={ParentChildrenScreen}
        options={{
          tabBarLabel: 'Children',
          tabBarIcon: ({ color, size }) => <HeartHandshake size={size - 2} color={color} />,
        }}
      />

      <Tab.Screen
        name="ParentReportsTab"
        component={ParentReportsScreen}
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color, size }) => <BarChart3 size={size - 2} color={color} />,
        }}
      />

      <Tab.Screen
        name="ParentMessagesTab"
        component={StudyGroupsScreen}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }) => <MessagesSquare size={size - 2} color={color} />,
        }}
      />

      <Tab.Screen
        name="ParentProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size - 2} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
