import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, NativeModules } from 'react-native';
import { fetchPrayerTimes, PrayerName } from './prayerApi';
import { getSelectedCity } from './storage';
import { Language, PRAYER_NAMES_I18N } from '@/constants/translations';

const APP_GROUP = 'group.com.takvim.app';

/**
 * Write prayer data to iOS App Group shared UserDefaults
 * so the widget extension can read it.
 */
async function writeToAppGroup(key: string, value: string): Promise<void> {
    if (Platform.OS !== 'ios') return;

    try {
        if (NativeModules.SharedGroupPreferences) {
            await NativeModules.SharedGroupPreferences.setItem(key, value, APP_GROUP);
        } else if (NativeModules.RNSharedGroupPreferences) {
            await NativeModules.RNSharedGroupPreferences.setItem(key, value, APP_GROUP);
        } else {
            // Local fallback only; widget extension cannot read this.
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
        const savedTheme = await AsyncStorage.getItem('@takvim/theme');
        const theme = savedTheme === 'light' ? 'light' : 'dark';
        const savedLanguage = await AsyncStorage.getItem('@takvim/language');
        const language: Language =
            savedLanguage === 'mk' || savedLanguage === 'tr' ? savedLanguage : 'sq';

        const prayerNames: PrayerName[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const prayers = prayerNames.map((name) => ({
            key: name,
            name: PRAYER_NAMES_I18N[name][language] ?? name,
            time: data.timings[name] || '--:--',
        }));

        const widgetData = JSON.stringify({
            cityName: city.localizedNames?.[language] ?? city.name,
            date: now.toISOString().split('T')[0],
            prayers,
            theme,
            language,
            lastUpdated: Date.now(),
        });

        if (Platform.OS === 'ios') {
            await writeToAppGroup('prayerWidgetData', widgetData);
            await reloadIOSWidget();
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
