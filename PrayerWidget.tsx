import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface PrayerWidgetProps {
    cityName: string;
    timings: Record<string, string> | null;
    nextPrayer?: string | null;
    theme?: 'light' | 'dark';
    language?: 'sq' | 'mk' | 'tr';
}

const PRAYERS: { key: string }[] = [
    { key: 'Fajr' },
    { key: 'Sunrise' },
    { key: 'Dhuhr' },
    { key: 'Asr' },
    { key: 'Maghrib' },
    { key: 'Isha' },
];

const PRAYER_LABELS: Record<'sq' | 'mk' | 'tr', Record<string, string>> = {
    sq: {
        Fajr: 'Sabahu',
        Sunrise: 'Lindja e Diellit',
        Dhuhr: 'Dreka',
        Asr: 'Ikindia',
        Maghrib: 'Akshami',
        Isha: 'Jacia',
    },
    mk: {
        Fajr: 'Зора',
        Sunrise: 'Изгрев',
        Dhuhr: 'Пладне',
        Asr: 'Икиндија',
        Maghrib: 'Акшам',
        Isha: 'Јација',
    },
    tr: {
        Fajr: 'Sabah',
        Sunrise: 'Gunes Dogusu',
        Dhuhr: 'Ogle',
        Asr: 'Ikindi',
        Maghrib: 'Aksam',
        Isha: 'Yatsi',
    },
};

const NEXT_LABEL: Record<'sq' | 'mk' | 'tr', string> = {
    sq: 'Tjetra',
    mk: 'Следна',
    tr: 'Sonraki',
};

function cleanTime(raw: string | undefined): string {
    if (!raw) return '--:--';
    return raw.replace(/\s*\(.*\)/, '').trim();
}

export function PrayerWidget({ cityName, timings, nextPrayer, theme = 'dark', language = 'sq' }: PrayerWidgetProps) {
    const widgetTheme = theme;
    const localizedPrayerLabels = PRAYER_LABELS[language] ?? PRAYER_LABELS.sq;
    const nextLabel = nextPrayer
        ? localizedPrayerLabels[nextPrayer] ?? nextPrayer
        : null;
    const palette =
        widgetTheme === 'light'
            ? {
                  background: '#F7F8FB',
                  cardBorder: 'rgba(15,23,42,0.08)',
                  headerSub: '#667085',
                  divider: 'rgba(15,23,42,0.08)',
                  rowBg: 'rgba(255,255,255,0.76)',
                  rowBorder: 'rgba(15,23,42,0.08)',
                  rowNextBg: '#FFF7DA',
                  rowNextBorder: 'rgba(201,162,39,0.42)',
                  label: '#344054',
                  labelNext: '#A37D12',
                  time: '#0F172A',
                  timeNext: '#0F172A',
                  muted: '#6B7280',
                  highlight: '#C9A227',
              }
            : {
                  background: '#081A2E',
                  cardBorder: 'rgba(212,175,55,0.18)',
                  headerSub: '#94A3B8',
                  divider: 'rgba(212,175,55,0.18)',
                  rowBg: '#0E243A',
                  rowBorder: 'rgba(148,163,184,0.15)',
                  rowNextBg: '#16314D',
                  rowNextBorder: 'rgba(212,175,55,0.48)',
                  label: '#CBD5E1',
                  labelNext: '#D4AF37',
                  time: '#E2E8F0',
                  timeNext: '#FFFFFF',
                  muted: '#6B7280',
                  highlight: '#D4AF37',
              };

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: palette.background,
                borderRadius: 22,
                borderWidth: 1,
                borderColor: palette.cardBorder,
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
                <FlexWidget style={{ flexDirection: 'column', flex: 1 }}>
                    <TextWidget
                        text="Hoxhë Abdulkadër Arnauti"
                        style={{
                            fontSize: 13,
                            fontFamily: 'sans-serif-medium',
                            color: palette.highlight,
                        }}
                    />
                    <TextWidget
                        text={cityName}
                        style={{ fontSize: 10, color: palette.headerSub }}
                    />
                </FlexWidget>
                {nextLabel && (
                    <TextWidget
                        text={`${NEXT_LABEL[language]}: ${nextLabel}`}
                        style={{
                            fontSize: 10,
                            color: palette.labelNext,
                            fontFamily: 'sans-serif-medium',
                        }}
                    />
                )}
            </FlexWidget>

            {/* ── Divider ── */}
            <FlexWidget
                style={{
                    width: 'match_parent',
                    height: 1,
                    backgroundColor: palette.divider,
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
                                    backgroundColor: isNext ? palette.rowNextBg : palette.rowBg,
                                    borderRadius: 11,
                                    paddingHorizontal: 12,
                                    paddingVertical: 7,
                                    borderWidth: 1,
                                    borderColor: isNext ? palette.rowNextBorder : palette.rowBorder,
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
                                                color: palette.highlight,
                                                marginRight: 6,
                                            }}
                                        />
                                    )}
                                    <TextWidget
                                        text={localizedPrayerLabels[prayer.key] ?? prayer.key}
                                        style={{
                                            fontSize: 13,
                                            color: isNext ? palette.labelNext : palette.label,
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
                                        color: isNext ? palette.timeNext : palette.time,
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
                        style={{ color: palette.muted, fontSize: 12 }}
                    />
                </FlexWidget>
            )}
        </FlexWidget>
    );
}
