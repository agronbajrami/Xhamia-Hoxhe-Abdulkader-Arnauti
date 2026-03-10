import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  focused?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.iconContainer, props.focused && { backgroundColor: `${colors.brandGold}15` }]}>
      <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />
    </View>
  );
}

function HeaderRight() {
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push('/settings' as any)} style={{ marginRight: 15 }}>
      <Ionicons name="settings-outline" size={22} color={colors.brandGold} />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const { t } = useLanguage();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTitleStyle: {
          color: colors.brandGold,
          fontSize: 18,
          fontWeight: '800',
          letterSpacing: 0.5,
        },
        headerTintColor: colors.text,
        headerRight: () => <HeaderRight />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t.home,
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="qibla"
        options={{
          title: t.qibla,
          href: null,
          headerTitle: t.qiblaDirection,
          headerTransparent: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="compass-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="adhkar"
        options={{
          title: t.adhkar,
          href: null,
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="book-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: t.quran,
          href: null,
          headerTitle: t.quran,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="book-sharp" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: t.menu,
          headerTitle: t.menu,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="grid-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: t.reminders,
          headerTitle: t.yourReminders,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="notifications-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          headerShown: false,
          title: t.settings,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
