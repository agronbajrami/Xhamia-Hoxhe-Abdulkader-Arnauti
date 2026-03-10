import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
    // Core backgrounds
    background: string;
    backgroundSecondary: string;
    card: string;
    cardBorder: string;

    // Brand
    brandNavy: string;
    brandGold: string;
    goldDark: string;

    // Text
    white: string;
    text: string;
    textSecondary: string;
    textMuted: string;

    // UI
    tabBar: string;
    tabBarBorder: string;
    tabActive: string;
    tabInactive: string;
    inputBg: string;
    inputBorder: string;
    separator: string;

    // Status
    success: string;
    error: string;
    warning: string;
    accent: string;
    primary: string;
}

export const DARK_THEME: ThemeColors = {
    background: '#001A2C',
    backgroundSecondary: '#001220',
    card: '#0D2940',
    cardBorder: 'rgba(212,175,55,0.12)',

    brandNavy: '#002B45',
    brandGold: '#D4AF37',
    goldDark: '#B4942E',

    white: '#FFFFFF',
    text: '#FFFFFF',
    textSecondary: '#E5E5E5',
    textMuted: '#9CA3AF',

    tabBar: '#001A2C',
    tabBarBorder: 'rgba(255,255,255,0.06)',
    tabActive: '#D4AF37',
    tabInactive: '#6B7280',
    inputBg: 'rgba(255,255,255,0.06)',
    inputBorder: 'rgba(255,255,255,0.1)',
    separator: 'rgba(255,255,255,0.07)',

    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    accent: '#FF3B30',
    primary: '#006233',
};

export const LIGHT_THEME: ThemeColors = {
    background: '#F5F5F0',
    backgroundSecondary: '#EBEBEB',
    card: '#FFFFFF',
    cardBorder: 'rgba(0,43,69,0.1)',

    brandNavy: '#002B45',
    brandGold: '#C9A227',
    goldDark: '#A6861F',

    white: '#FFFFFF',
    text: '#0D1B2A',
    textSecondary: '#334155',
    textMuted: '#6B7280',

    tabBar: '#FFFFFF',
    tabBarBorder: 'rgba(0,0,0,0.08)',
    tabActive: '#C9A227',
    tabInactive: '#9CA3AF',
    inputBg: 'rgba(0,43,69,0.05)',
    inputBorder: 'rgba(0,43,69,0.15)',
    separator: 'rgba(0,0,0,0.06)',

    success: '#059669',
    error: '#DC2626',
    warning: '#D97706',
    accent: '#C41E3A',
    primary: '#006233',
};

interface ThemeContextType {
    theme: ThemeMode;
    colors: ThemeColors;
    isDark: boolean;
    toggleTheme: () => Promise<void>;
    setTheme: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_KEY = '@takvim/theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>('dark');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(THEME_KEY).then((saved) => {
            if (saved === 'light' || saved === 'dark') {
                setThemeState(saved);
            }
            setIsLoaded(true);
        });
    }, []);

    const setTheme = async (mode: ThemeMode) => {
        await AsyncStorage.setItem(THEME_KEY, mode);
        setThemeState(mode);
    };

    const toggleTheme = async () => {
        const next: ThemeMode = theme === 'dark' ? 'light' : 'dark';
        await setTheme(next);
    };

    if (!isLoaded) return null;

    return (
        <ThemeContext.Provider
            value={{
                theme,
                colors: theme === 'dark' ? DARK_THEME : LIGHT_THEME,
                isDark: theme === 'dark',
                toggleTheme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
}

export default ThemeContext;
