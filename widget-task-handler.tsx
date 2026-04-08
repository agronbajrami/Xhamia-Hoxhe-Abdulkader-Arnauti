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
      props.renderWidget(<PrayerWidget cityName={city.name} timings={prayerTimes.timings} />);
    } catch (e) {
      console.warn("PrayerWidget failed to update", e);
      props.renderWidget(<PrayerWidget cityName="Loading..." timings={null} />);
    }
  }
}
