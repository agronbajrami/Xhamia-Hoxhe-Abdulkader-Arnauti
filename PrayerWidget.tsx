import React from 'react';
import { FlexWidget, TextWidget, ImageWidget } from 'react-native-android-widget';

interface PrayerWidgetProps {
    cityName: string;
    timings: Record<string, string> | null;
    nextPrayer?: string | null;
}

const PRAYERS: { key: string; label: string }[] = [
    { key: 'Fajr',    label: 'Sabahu'  },
    { key: 'Sunrise', label: 'Lindja'  },
    { key: 'Dhuhr',   label: 'Dreka'   },
    { key: 'Asr',     label: 'Ikindia' },
    { key: 'Maghrib', label: 'Akshami' },
    { key: 'Isha',    label: 'Jacia'   },
];

function cleanTime(raw: string | undefined): string {
    if (!raw) return '--:--';
    return raw.replace(/\s*\(.*\)/, '').trim();
}

export function PrayerWidget({ cityName, timings, nextPrayer }: PrayerWidgetProps) {
    const nextLabel = nextPrayer
        ? PRAYERS.find((p) => p.key === nextPrayer)?.label ?? nextPrayer
        : null;

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#0A1929',
                borderRadius: 24,
                flexDirection: 'column',
                padding: 16,
            }}
        >
            {/* ── Header ── */}
            <FlexWidget
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: 'match_parent',
                }}
            >
                <ImageWidget
                    image={require('./assets/images/icon-transparent.png')}
                    imageWidth={28}
                    imageHeight={28}
                />
                <FlexWidget style={{ flexDirection: 'column', marginLeft: 10, flex: 1 }}>
                    <TextWidget
                        text="Hoxhë Abdulkadër Arnauti"
                        style={{
                            fontSize: 13,
                            fontFamily: 'sans-serif-medium',
                            color: '#D4AF37',
                        }}
                    />
                    <TextWidget
                        text={cityName}
                        style={{ fontSize: 10, color: '#6B7280' }}
                    />
                </FlexWidget>
            </FlexWidget>

            {/* ── Divider ── */}
            <FlexWidget
                style={{
                    width: 'match_parent',
                    height: 1,
                    backgroundColor: '#1E3A5F',
                    marginTop: 12,
                    marginBottom: 8,
                }}
            />

            {/* ── Prayer List ── */}
            {timings ? (
                <FlexWidget
                    style={{
                        flexDirection: 'column',
                        width: 'match_parent',
                        flex: 1,
                        justifyContent: 'space-evenly',
                    }}
                >
                    {PRAYERS.map((prayer) => {
                        const isNext = nextPrayer === prayer.key;
                        return (
                            <FlexWidget
                                key={prayer.key}
                                style={{
                                    flexDirection: 'row',
                                    width: 'match_parent',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: isNext ? '#162D4A' : 'transparent',
                                    borderRadius: 12,
                                    paddingHorizontal: 12,
                                    paddingVertical: 8,
                                    borderWidth: isNext ? 1 : 0,
                                    borderColor: isNext ? 'rgba(212,175,55,0.4)' : 'transparent',
                                }}
                            >
                                <FlexWidget
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    {isNext && (
                                        <TextWidget
                                            text="▸"
                                            style={{
                                                fontSize: 12,
                                                color: '#D4AF37',
                                                marginRight: 6,
                                            }}
                                        />
                                    )}
                                    <TextWidget
                                        text={prayer.label}
                                        style={{
                                            fontSize: 13,
                                            color: isNext ? '#D4AF37' : '#94A3B8',
                                            fontFamily: isNext
                                                ? 'sans-serif-medium'
                                                : 'sans-serif',
                                        }}
                                    />
                                </FlexWidget>
                                <TextWidget
                                    text={cleanTime(timings[prayer.key])}
                                    style={{
                                        fontSize: 15,
                                        fontFamily: 'sans-serif-medium',
                                        color: isNext ? '#FFFFFF' : '#CBD5E1',
                                    }}
                                />
                            </FlexWidget>
                        );
                    })}
                </FlexWidget>
            ) : (
                <FlexWidget
                    style={{
                        flex: 1,
                        width: 'match_parent',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <TextWidget
                        text="Hap aplikacionin..."
                        style={{ color: '#6B7280', fontSize: 12 }}
                    />
                </FlexWidget>
            )}
        </FlexWidget>
    );
}
