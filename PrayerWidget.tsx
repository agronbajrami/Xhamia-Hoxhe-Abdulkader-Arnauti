import React from 'react';
import { FlexWidget, TextWidget, ImageWidget } from 'react-native-android-widget';

interface PrayerWidgetProps {
    cityName: string;
    timings: Record<string, string> | null;
    nextPrayer?: string | null;
}

const PRAYER_LABELS: { key: string; label: string }[] = [
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
        ? PRAYER_LABELS.find((p) => p.key === nextPrayer)?.label ?? nextPrayer
        : null;
    const nextTime = nextPrayer && timings ? cleanTime(timings[nextPrayer]) : null;

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#07101C',
                borderRadius: 28,
                flexDirection: 'column',
                padding: 0,
            }}
        >
            {/* ── Header ── */}
            <FlexWidget
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingTop: 14,
                    paddingBottom: 10,
                    borderRadius: 28,
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
                            fontFamily: 'sans-serif-bold',
                            color: '#D4AF37',
                        }}
                    />
                    <TextWidget
                        text={cityName}
                        style={{
                            fontSize: 10,
                            color: '#6B7280',
                            fontFamily: 'sans-serif',
                        }}
                    />
                </FlexWidget>
                {nextLabel && nextTime ? (
                    <FlexWidget
                        style={{
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                        }}
                    >
                        <TextWidget
                            text={nextLabel}
                            style={{
                                fontSize: 10,
                                color: '#9CA3AF',
                                fontFamily: 'sans-serif',
                            }}
                        />
                        <TextWidget
                            text={nextTime}
                            style={{
                                fontSize: 15,
                                fontFamily: 'sans-serif-bold',
                                color: '#D4AF37',
                            }}
                        />
                    </FlexWidget>
                ) : null}
            </FlexWidget>

            {/* ── Thin gold divider ── */}
            <FlexWidget
                style={{
                    height: 1,
                    backgroundColor: '#1F2937',
                    marginHorizontal: 14,
                    marginBottom: 8,
                }}
            />

            {/* ── Prayer Times: 2 columns × 3 rows ── */}
            {timings ? (
                <FlexWidget
                    style={{
                        flexDirection: 'column',
                        flex: 1,
                        paddingHorizontal: 10,
                        paddingBottom: 12,
                    }}
                >
                    {[0, 2, 4].map((startIndex) => (
                        <FlexWidget
                            key={startIndex}
                            style={{
                                flexDirection: 'row',
                                flex: 1,
                                marginBottom: startIndex < 4 ? 6 : 0,
                            }}
                        >
                            {PRAYER_LABELS.slice(startIndex, startIndex + 2).map((prayer) => {
                                const isNext = nextPrayer === prayer.key;
                                return (
                                    <FlexWidget
                                        key={prayer.key}
                                        style={{
                                            flex: 1,
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: isNext
                                                ? 'rgba(212,175,55,0.13)'
                                                : '#0E1E2E',
                                            borderRadius: 16,
                                            marginHorizontal: 4,
                                            paddingVertical: 8,
                                            borderWidth: isNext ? 1 : 0,
                                            borderColor: isNext ? '#D4AF37' : 'transparent',
                                        }}
                                    >
                                        <TextWidget
                                            text={prayer.label}
                                            style={{
                                                fontSize: 10,
                                                color: isNext ? '#D4AF37' : '#6B7280',
                                                fontFamily: isNext
                                                    ? 'sans-serif-medium'
                                                    : 'sans-serif',
                                            }}
                                        />
                                        <TextWidget
                                            text={cleanTime(timings[prayer.key])}
                                            style={{
                                                fontSize: 15,
                                                fontFamily: 'sans-serif-bold',
                                                color: isNext ? '#FFFFFF' : '#CBD5E1',
                                                marginTop: 2,
                                            }}
                                        />
                                        {isNext && (
                                            <TextWidget
                                                text="▶"
                                                style={{
                                                    fontSize: 7,
                                                    color: '#D4AF37',
                                                    marginTop: 3,
                                                }}
                                            />
                                        )}
                                    </FlexWidget>
                                );
                            })}
                        </FlexWidget>
                    ))}
                </FlexWidget>
            ) : (
                <FlexWidget style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <TextWidget
                        text="Hap aplikacionin për kohët e namazit"
                        style={{ color: '#6B7280', fontSize: 12 }}
                    />
                </FlexWidget>
            )}
        </FlexWidget>
    );
}
