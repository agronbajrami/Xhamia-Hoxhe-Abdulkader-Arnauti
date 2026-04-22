import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { requestPermissions, reschedulePrayerNotifications } from '@/services/notifications';
import { syncPrayerWidget } from '@/services/widgetBridge';

import CustomSplashScreen from '@/components/CustomSplashScreen';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      // Request notification permissions then schedule prayer notifications
      requestPermissions()
        .then((granted) => {
          if (granted) {
            return reschedulePrayerNotifications();
          }
        })
        .catch((e) => console.warn('Notification setup failed:', e));
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <ThemeProvider>
        <LanguageProvider>
          <RootLayoutNav />
        </LanguageProvider>
      </ThemeProvider>
      {showCustomSplash && (
        <CustomSplashScreen onFinish={() => setShowCustomSplash(false)} />
      )}
    </>
  );
}

function RootLayoutNav() {
  const { isDark, colors } = useTheme();

  useEffect(() => {
    // Keep widget data in sync when app starts.
    syncPrayerWidget().catch((e) => console.warn('Widget sync failed:', e));
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        NavigationBar.setBackgroundColorAsync(colors.tabBar);
        NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');
      } catch (e) {
        console.warn('NavigationBar configuration failed', e);
      }
    }
  }, [colors.tabBar, isDark]);

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.cardBorder,
    },
  };

  return (
    <NavThemeProvider value={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
          }}
        />
      </Stack>
    </NavThemeProvider>
  );
}
