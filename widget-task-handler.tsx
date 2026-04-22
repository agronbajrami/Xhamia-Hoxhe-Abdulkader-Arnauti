import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrayerWidget } from './PrayerWidget';
import { getSelectedCity } from './services/storage';
import { fetchPrayerTimes, PrayerName } from './services/prayerApi';
import { Language } from '@/constants/translations';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  if (
    props.widgetAction === 'WIDGET_ADDED' ||
    props.widgetAction === 'WIDGET_UPDATE' ||
    props.widgetAction === 'WIDGET_RESIZED'
  ) {
    try {
      const savedTheme = await AsyncStorage.getItem('@takvim/theme');
      const theme = savedTheme === 'light' ? 'light' : 'dark';
      const savedLanguage = await AsyncStorage.getItem('@takvim/language');
      const language: Language =
        savedLanguage === 'mk' || savedLanguage === 'tr' ? savedLanguage : 'sq';
      const city = await getSelectedCity();
      const now = new Date();
      const prayerTimes = await fetchPrayerTimes(city.latitude, city.longitude, now);

      const prayerOrder: PrayerName[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      let nextPrayer: PrayerName | null = null;

      for (const p of prayerOrder) {
        const raw = prayerTimes.timings[p] ?? '';
        // Strip timezone suffix e.g. " (CEST)"
        const clean = raw.replace(/\s*\(.*\)/, '').trim();
        const [h, m] = clean.split(':').map(Number);
        if (isNaN(h) || isNaN(m)) continue;

        const pDate = new Date(now);
        pDate.setHours(h, m, 0, 0);

        if (pDate > now) {
          nextPrayer = p;
          break;
        }
      }

      // If all prayers have passed for today, highlight Fajr (next is tomorrow)
      if (!nextPrayer) {
        nextPrayer = 'Fajr';
      }

      props.renderWidget(
        <PrayerWidget
          cityName={city.localizedNames?.[language] ?? city.name}
          timings={prayerTimes.timings}
          nextPrayer={nextPrayer}
          theme={theme}
          language={language}
        />
      );
    } catch (e) {
      console.warn('PrayerWidget failed to update', e);
      props.renderWidget(
        <PrayerWidget cityName="Shkup" timings={null} theme="dark" language="sq" />
      );
    }
  }
}
