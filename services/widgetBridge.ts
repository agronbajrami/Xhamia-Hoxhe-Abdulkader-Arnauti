import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, NativeModules } from 'react-native';
import { fetchPrayerTimes, PrayerName } from './prayerApi';
import { getSelectedCity } from './storage';

const APP_GROUP = 'group.com.takvim.app';

/**
 * Write prayer data to iOS App Group shared UserDefaults
 * so the widget extension can read it.
 */
async function writeToAppGroup(key: string, value: string): Promise<void> {
    if (Platform.OS !== 'ios') return;

    try {
        // Use the RNCAsyncStorage native module to write to suite
        const { RNCAsyncStorage } = NativeModules;
        // Fallback: write via expo-shared-preferences or native bridge
        // For now use a simple native call if available
        if (NativeModules.SharedGroupPreferences) {
            await NativeModules.SharedGroupPreferences.setItem(key, value, APP_GROUP);
        } else {
            // Store locally so the config plugin bridge can pick it up
            await AsyncStorage.setItem(`@widget:${key}`, value);
        }
    } catch (e) {
        console.warn('Failed to write to App Group', e);
    }
}

/**
 * Sync prayer times to the iOS widget.
 * Call this whenever prayer data is fetched or city changes.
 */
export async function syncPrayerWidget(): Promise<void> {
    try {
        const city = await getSelectedCity();
        const now = new Date();
        const data = await fetchPrayerTimes(city.latitude, city.longitude, now);

        const prayerNames: PrayerName[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const prayers = prayerNames.map((name) => ({
            name,
            time: data.timings[name] || '--:--',
        }));

        const widgetData = JSON.stringify({
            cityName: city.name,
            date: now.toISOString().split('T')[0],
            prayers,
            lastUpdated: Date.now(),
        });

        if (Platform.OS === 'ios') {
            await writeToAppGroup('prayerWidgetData', widgetData);
        }

        // Also store for Android widget
        await AsyncStorage.setItem('@widget:prayerData', widgetData);
    } catch (e) {
        console.warn('Failed to sync prayer widget data', e);
    }
}

/**
 * Request the iOS widget to refresh its timeline
 */
export async function reloadIOSWidget(): Promise<void> {
    if (Platform.OS !== 'ios') return;
    try {
        if (NativeModules.WidgetKitManager) {
            NativeModules.WidgetKitManager.reloadAllTimelines();
        }
    } catch (e) {
        console.warn('Failed to reload iOS widget', e);
    }
}
