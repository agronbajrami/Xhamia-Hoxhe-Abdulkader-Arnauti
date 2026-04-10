import React from 'react';
import { FlexWidget, TextWidget, ImageWidget } from 'react-native-android-widget';

interface PrayerWidgetProps {
    cityName: string;
    timings: Record<string, string> | null;
    nextPrayer?: string | null;
}

const PRAYER_LABELS: { key: string; label: string; icon: string }[] = [
    { key: 'Fajr',    label: 'Fajr',    icon: '🌙' },
    { key: 'Sunrise', label: 'Lindja',  icon: '🌅' },
    { key: 'Dhuhr',   label: 'Dhuhr',   icon: '☀️' },
    { key: 'Asr',     label: 'Asr',     icon: '🌤️' },
    { key: 'Maghrib', label: 'Maghrib', icon: '🌇' },
    { key: 'Isha',    label: 'Isha',    icon: '🌑' },
];

function cleanTime(raw: string | undefined): string {
    if (!raw) return '--:--';
    // Strip timezone offset like " (CEST)" or " (+02)"
    return raw.replace(/\s*\(.*\)/, '').trim();
}

export function PrayerWidget({ cityName, timings, nextPrayer }: PrayerWidgetProps) {
    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#001A2C',
                borderRadius: 24,
                flexDirection: 'column',
                padding: 16,
            }}
        >
            {/* ── Header Row: Logo + Title + City ── */}
            <FlexWidget
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: 'match_parent',
                    marginBottom: 10,
                }}
            >
                <ImageWidget
                    image={require('./assets/images/icon-transparent.png')}
                    imageWidth={32}
                    imageHeight={32}
                />
                <FlexWidget style={{ flexDirection: 'column', marginLeft: 10, flex: 1 }}>
                    <TextWidget
                        text="Hoxhë Abdulkadër Arnauti"
                        style={{
                            fontSize: 16,
                            fontFamily: 'sans-serif-bold',
                            color: '#D4AF37',
                        }}
                    />
                    <TextWidget
                        text={cityName}
                        style={{
                            fontSize: 11,
                            color: '#9CA3AF',
                        }}
                    />
                </FlexWidget>
            </FlexWidget>

            {/* ── Spacer ── */}
            <FlexWidget style={{ height: 6 }} />

            {/* ── Prayer Times Grid: 2 columns × 3 rows ── */}
            {timings ? (
                <FlexWidget style={{ flexDirection: 'column', width: 'match_parent', flex: 1 }}>
                    {[0, 2, 4].map((startIndex) => (
                        <FlexWidget 
                            key={startIndex} 
                            style={{ 
                                flexDirection: 'row', 
                                width: 'match_parent', 
                                flex: 1, 
                                marginBottom: startIndex < 4 ? 6 : 0 
                            }}
                        >
                            {PRAYER_LABELS.slice(startIndex, startIndex + 2).map((prayer) => {
                                const isNext = nextPrayer === prayer.key;
                                return (
                                    <FlexWidget
                                        key={prayer.key}
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            backgroundColor: isNext ? '#1A334D' : '#0D2940',
                                            borderColor: isNext ? '#D4AF37' : '#1A334D',
                                            borderWidth: isNext ? 1.5 : 0,
                                            borderRadius: 14,
                                            paddingHorizontal: 10,
                                            paddingVertical: 8,
                                            marginHorizontal: 3,
                                        }}
                                    >
                                        <TextWidget
                                            text={prayer.label}
                                            style={{
                                                fontSize: 11,
                                                color: isNext ? '#D4AF37' : '#9CA3AF',
                                                fontWeight: isNext ? 'bold' : 'normal',
                                            }}
                                        />
                                        <TextWidget
                                            text={cleanTime(timings[prayer.key])}
                                            style={{
                                                fontSize: 14,
                                                fontFamily: 'sans-serif-medium',
                                                color: '#FFFFFF',
                                            }}
                                        />
                                    </FlexWidget>
                                );
                            })}
                        </FlexWidget>
                    ))}
                </FlexWidget>
            ) : (
                <FlexWidget style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <TextWidget
                        text="Open app to load prayers..."
                        style={{ color: '#9CA3AF', fontSize: 13 }}
                    />
                </FlexWidget>
            )}
        </FlexWidget>
    );
}
