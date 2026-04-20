import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { PrayerWidget } from './PrayerWidget';
import { getSelectedCity } from './services/storage';
import { fetchPrayerTimes, PrayerName } from './services/prayerApi';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  if (
    props.widgetAction === 'WIDGET_ADDED' ||
    props.widgetAction === 'WIDGET_UPDATE' ||
    props.widgetAction === 'WIDGET_RESIZED'
  ) {
    try {
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
          cityName={city.name}
          timings={prayerTimes.timings}
          nextPrayer={nextPrayer}
        />
      );
    } catch (e) {
      console.warn('PrayerWidget failed to update', e);
      props.renderWidget(
        <PrayerWidget cityName="Skopje" timings={null} />
      );
    }
  }
}
