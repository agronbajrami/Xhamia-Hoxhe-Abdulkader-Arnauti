import { Language, PRAYER_NAMES_I18N, translations, Translations } from '@/constants/translations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    t: Translations;
    getPrayerName: (prayer: string) => { name: string; arabic: string };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = '@takvim/language';

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('sq');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
            if (saved && (saved === 'sq' || saved === 'mk' || saved === 'tr')) {
                setLanguageState(saved as Language);
            }
        } catch (error) {
            console.error('Error loading language:', error);
        } finally {
            setIsLoaded(true);
        }
    };

    const setLanguage = async (lang: Language) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_KEY, lang);
            setLanguageState(lang);
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    const getPrayerName = (prayer: string) => {
        const prayerData = PRAYER_NAMES_I18N[prayer as keyof typeof PRAYER_NAMES_I18N];
        if (prayerData) {
            return {
                name: (prayerData as any)[language] ?? prayer,
                arabic: prayerData.ar,
            };
        }
        return { name: prayer, arabic: '' };
    };

    if (!isLoaded) {
        return null;
    }

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                t: translations[language],
                getPrayerName,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

export default LanguageContext;
