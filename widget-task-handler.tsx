import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { PrayerWidget } from './PrayerWidget';
import { getSelectedCity } from './services/storage';
import { fetchPrayerTimes, PrayerName } from './services/prayerApi';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  if (props.widgetAction === 'WIDGET_ADDED' || props.widgetAction === 'WIDGET_UPDATE' || props.widgetAction === 'WIDGET_RESIZED') {
    try {
      const city = await getSelectedCity();
      const prayerTimes = await fetchPrayerTimes(city.latitude, city.longitude, new Date());
      
      const now = new Date();
      const prayerOrder: PrayerName[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      let nextPrayer: PrayerName | null = null;
      
      for (const p of prayerOrder) {
        const [h, m] = prayerTimes.timings[p].split(':').map(Number);
        const pDate = new Date();
        pDate.setHours(h, m, 0, 0);
        if (pDate > now) {
          nextPrayer = p;
          break;
        }
      }
      if (!nextPrayer) nextPrayer = 'Fajr';

      props.renderWidget(
        <PrayerWidget 
          cityName={city.name} 
          timings={prayerTimes.timings} 
          nextPrayer={nextPrayer}
        />
      );
    } catch (e) {
      console.warn("PrayerWidget failed to update", e);
      props.renderWidget(<PrayerWidget cityName="Loading..." timings={null} />);
    }
  }
}
