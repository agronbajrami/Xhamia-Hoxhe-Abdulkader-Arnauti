import AsyncStorage from '@react-native-async-storage/async-storage';
import { City, DEFAULT_CITY } from '../constants/Cities';

// Storage keys
const KEYS = {
    SELECTED_CITY: '@takvim/selected_city',
    REMINDERS: '@takvim/reminders',
    ADHKAR_PROGRESS: '@takvim/adhkar_progress',
    SETTINGS: '@takvim/settings',
};

// Types
export interface Reminder {
    id: string;
    title: string;
    description?: string;
    time: string; // ISO string
    repeat: 'none' | 'daily' | 'weekly';
    enabled: boolean;
    notificationId?: string;
}

export interface AdhkarProgress {
    date: string; // YYYY-MM-DD
    morning: { [adhkarId: string]: number };
    evening: { [adhkarId: string]: number };
}

export interface Settings {
    use24HourFormat: boolean;
    showSunrise: boolean;
    notificationsEnabled: boolean;
    adhkarNotifications: boolean;
}

const DEFAULT_SETTINGS: Settings = {
    use24HourFormat: true,
    showSunrise: true,
    notificationsEnabled: true,
    adhkarNotifications: false,
};

// City Storage
export async function getSelectedCity(): Promise<City> {
    try {
        const cityJson = await AsyncStorage.getItem(KEYS.SELECTED_CITY);
        if (cityJson) {
            return JSON.parse(cityJson);
        }
        return DEFAULT_CITY;
    } catch (error) {
        console.error('Error reading selected city:', error);
        return DEFAULT_CITY;
    }
}

export async function setSelectedCity(city: City): Promise<void> {
    try {
        await AsyncStorage.setItem(KEYS.SELECTED_CITY, JSON.stringify(city));
    } catch (error) {
        console.error('Error saving selected city:', error);
        throw error;
    }
}

// Reminders Storage
export async function getReminders(): Promise<Reminder[]> {
    try {
        const remindersJson = await AsyncStorage.getItem(KEYS.REMINDERS);
        if (remindersJson) {
            return JSON.parse(remindersJson);
        }
        return [];
    } catch (error) {
        console.error('Error reading reminders:', error);
        return [];
    }
}

export async function saveReminders(reminders: Reminder[]): Promise<void> {
    try {
        await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
    } catch (error) {
        console.error('Error saving reminders:', error);
        throw error;
    }
}

export async function addReminder(reminder: Reminder): Promise<void> {
    const reminders = await getReminders();
    reminders.push(reminder);
    await saveReminders(reminders);
}

export async function updateReminder(updatedReminder: Reminder): Promise<void> {
    const reminders = await getReminders();
    const index = reminders.findIndex(r => r.id === updatedReminder.id);
    if (index !== -1) {
        reminders[index] = updatedReminder;
        await saveReminders(reminders);
    }
}

export async function deleteReminder(id: string): Promise<void> {
    const reminders = await getReminders();
    const filtered = reminders.filter(r => r.id !== id);
    await saveReminders(filtered);
}

// Adhkar Progress Storage
export async function getAdhkarProgress(date: string): Promise<AdhkarProgress | null> {
    try {
        const progressJson = await AsyncStorage.getItem(`${KEYS.ADHKAR_PROGRESS}_${date}`);
        if (progressJson) {
            return JSON.parse(progressJson);
        }
        return null;
    } catch (error) {
        console.error('Error reading adhkar progress:', error);
        return null;
    }
}

export async function saveAdhkarProgress(progress: AdhkarProgress): Promise<void> {
    try {
        await AsyncStorage.setItem(
            `${KEYS.ADHKAR_PROGRESS}_${progress.date}`,
            JSON.stringify(progress)
        );
    } catch (error) {
        console.error('Error saving adhkar progress:', error);
        throw error;
    }
}

// Settings Storage
export async function getSettings(): Promise<Settings> {
    try {
        const settingsJson = await AsyncStorage.getItem(KEYS.SETTINGS);
        if (settingsJson) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(settingsJson) };
        }
        return DEFAULT_SETTINGS;
    } catch (error) {
        console.error('Error reading settings:', error);
        return DEFAULT_SETTINGS;
    }
}

export async function saveSettings(settings: Settings): Promise<void> {
    try {
        await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
}

// Generate unique ID
export function generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default {
    getSelectedCity,
    setSelectedCity,
    getReminders,
    saveReminders,
    addReminder,
    updateReminder,
    deleteReminder,
    getAdhkarProgress,
    saveAdhkarProgress,
    getSettings,
    saveSettings,
    generateId,
};
