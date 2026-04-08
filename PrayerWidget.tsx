import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface PrayerWidgetProps {
    cityName: string;
    timings: Record<string, string> | null;
}

export function PrayerWidget({ cityName, timings }: PrayerWidgetProps) {
    const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#0A1A2D',
                borderRadius: 16,
                padding: 16,
                flexDirection: 'column',
                justifyContent: 'space_between',
            }}
        >
            <FlexWidget style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
                <TextWidget text="Takvim" style={{ fontSize: 18, color: '#D4AF37', fontWeight: 'bold' }} />
                <TextWidget text={cityName} style={{ fontSize: 12, color: '#9CA3AF' }} />
            </FlexWidget>

            {timings ? (
                <FlexWidget style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space_between' }}>
                    {prayers.map((prayer) => (
                        <FlexWidget key={prayer} style={{ width: '31%', flexDirection: 'column', alignItems: 'center', marginVertical: 4 }}>
                            <TextWidget text={prayer} style={{ fontSize: 12, color: '#9CA3AF' }} />
                            <TextWidget text={timings[prayer] || '--:--'} style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' }} />
                        </FlexWidget>
                    ))}
                </FlexWidget>
            ) : (
                <TextWidget text="Loading prayers..." style={{ color: '#FFFFFF', fontSize: 14 }} />
            )}
        </FlexWidget>
    );
}
