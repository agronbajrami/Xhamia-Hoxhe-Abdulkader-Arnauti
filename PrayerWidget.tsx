import React from 'react';
import { FlexWidget, TextWidget, ImageWidget } from 'react-native-android-widget';

interface PrayerWidgetProps {
    cityName: string;
    timings: Record<string, string> | null;
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

export function PrayerWidget({ cityName, timings }: PrayerWidgetProps) {
    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#001A2C',
                borderRadius: 20,
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
                    marginBottom: 12,
                }}
            >
                <ImageWidget
                    image={require('./assets/images/icon-transparent.png')}
                    imageWidth={28}
                    imageHeight={28}
                    radius={14}
                />
                <FlexWidget style={{ flexDirection: 'column', marginLeft: 8, flex: 1 }}>
                    <TextWidget
                        text="Takvim"
                        style={{
                            fontSize: 16,
                            fontFamily: 'sans-serif-medium',
                            color: '#D4AF37',
                        }}
                    />
                    <TextWidget
                        text={cityName}
                        style={{
                            fontSize: 11,
                            color: '#6B7280',
                        }}
                    />
                </FlexWidget>
            </FlexWidget>

            {/* ── Divider ── */}
            <FlexWidget
                style={{
                    height: 1,
                    width: 'match_parent',
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    marginBottom: 10,
                }}
            />

            {/* ── Prayer Times Grid: 3 columns × 2 rows ── */}
            {timings ? (
                <FlexWidget style={{ flexDirection: 'column', width: 'match_parent', flex: 1 }}>
                    {/* Row 1 */}
                    <FlexWidget style={{ flexDirection: 'row', width: 'match_parent', flex: 1, marginBottom: 6 }}>
                        {PRAYER_LABELS.slice(0, 3).map((prayer) => (
                            <FlexWidget
                                key={prayer.key}
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#0D2940',
                                    borderRadius: 12,
                                    padding: 6,
                                    marginHorizontal: 3,
                                }}
                            >
                                <TextWidget
                                    text={prayer.label}
                                    style={{
                                        fontSize: 10,
                                        color: '#9CA3AF',
                                        marginBottom: 2,
                                    }}
                                />
                                <TextWidget
                                    text={cleanTime(timings[prayer.key])}
                                    style={{
                                        fontSize: 15,
                                        fontFamily: 'sans-serif-medium',
                                        color: '#FFFFFF',
                                    }}
                                />
                            </FlexWidget>
                        ))}
                    </FlexWidget>
                    {/* Row 2 */}
                    <FlexWidget style={{ flexDirection: 'row', width: 'match_parent', flex: 1 }}>
                        {PRAYER_LABELS.slice(3, 6).map((prayer) => (
                            <FlexWidget
                                key={prayer.key}
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#0D2940',
                                    borderRadius: 12,
                                    padding: 6,
                                    marginHorizontal: 3,
                                }}
                            >
                                <TextWidget
                                    text={prayer.label}
                                    style={{
                                        fontSize: 10,
                                        color: '#9CA3AF',
                                        marginBottom: 2,
                                    }}
                                />
                                <TextWidget
                                    text={cleanTime(timings[prayer.key])}
                                    style={{
                                        fontSize: 15,
                                        fontFamily: 'sans-serif-medium',
                                        color: '#FFFFFF',
                                    }}
                                />
                            </FlexWidget>
                        ))}
                    </FlexWidget>
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
