import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const WELCOME_KEY = '@takvim_welcome_seen';

interface WelcomeContextType {
    isVisible: boolean;
    showWelcome: () => void;
    hideWelcome: () => Promise<void>;
}

const WelcomeContext = createContext<WelcomeContextType>({
    isVisible: false,
    showWelcome: () => { },
    hideWelcome: async () => { },
});

export const useWelcome = () => useContext(WelcomeContext);

export function WelcomeProvider({ children }: { children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        checkWelcome();
    }, []);

    const checkWelcome = async () => {
        try {
            const seen = await AsyncStorage.getItem(WELCOME_KEY);
            if (!seen) {
                setIsVisible(true);
            }
        } catch (error) {
            console.error('Error checking welcome status:', error);
        }
    };

    const showWelcome = () => setIsVisible(true);

    const hideWelcome = async () => {
        try {
            await AsyncStorage.setItem(WELCOME_KEY, 'true');
            setIsVisible(false);
        } catch (error) {
            console.error('Error saving welcome status:', error);
            setIsVisible(false);
        }
    };

    return (
        <WelcomeContext.Provider value={{ isVisible, showWelcome, hideWelcome }}>
            {children}
        </WelcomeContext.Provider>
    );
}
