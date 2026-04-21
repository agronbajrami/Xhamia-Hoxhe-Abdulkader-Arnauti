import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

/**
 * ── Mock Widget View ──
 * This replicates the EXACT look of your current PrayerWidget.tsx (Vertical List).
 * You can tweak this mockup to see changes instantly in Expo Go.
 */
function MockWidget({ cityName, timings, nextPrayer }: any) {
    // Current prayer labels/keys for the widget
    const prayers = [
        { key: 'Fajr',    label: 'Sabahu'  },
        { key: 'Sunrise', label: 'Lindja'  },
        { key: 'Dhuhr',   label: 'Dreka'   },
        { key: 'Asr',     label: 'Ikindia' },
        { key: 'Maghrib', label: 'Akshami' },
        { key: 'Isha',    label: 'Jacia'   },
    ];

    return (
        <View style={mockStyles.container}>
            {/* Header */}
            <View style={mockStyles.header}>
                <Image 
                    source={require('@/assets/images/icon-transparent.png')} 
                    style={mockStyles.logo} 
                />
                <View style={{ marginLeft: 10 }}>
                    <Text style={mockStyles.title}>Hoxhë Abdulkadër Arnauti</Text>
                    <Text style={mockStyles.city}>{cityName}</Text>
                </View>
            </View>

            {/* Divider */}
            <View style={mockStyles.divider} />

            {/* Vertical Prayer List */}
            <View style={mockStyles.list}>
                {prayers.map((prayer) => {
                    const isNext = nextPrayer === prayer.key;
                    return (
                        <View 
                            key={prayer.key} 
                            style={[
                                mockStyles.row, 
                                isNext && mockStyles.rowActive
                            ]}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {isNext && <Text style={mockStyles.indicator}>▸</Text>}
                                <Text style={[
                                    mockStyles.pLabel, 
                                    isNext && { color: '#D4AF37', fontWeight: 'bold' }
                                ]}>
                                    {prayer.label}
                                </Text>
                            </View>
                            <Text style={[
                                mockStyles.pTime, 
                                isNext && { color: '#FFFFFF', fontWeight: 'bold' }
                            ]}>
                                {timings[prayer.key]}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

export default function PreviewScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    const mockTimings = {
        Fajr: '04:30',
        Sunrise: '06:05',
        Dhuhr: '12:45',
        Asr: '16:15',
        Maghrib: '19:30',
        Isha: '21:00',
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Ionicons 
                    name="arrow-back" 
                    size={24} 
                    color={colors.brandGold} 
                    onPress={() => router.back()} 
                />
                <Text style={[styles.headerTitle, { color: colors.text }]}>Design Preview</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.brandGold }]}>Home Screen Widget Mockup</Text>
                <View style={styles.previewBox}>
                    <MockWidget 
                        cityName="Shkup" 
                        timings={mockTimings} 
                        nextPrayer="Asr" 
                    />
                </View>
                <Text style={[styles.infoText, { color: colors.textMuted }]}>
                    This is how the vertical widget looks after the latest redesign. 
                    Edit app/preview.tsx to tweak the mockup live in Expo Go.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.brandGold }]}>App Icons (assets/images/icon.png)</Text>
                <View style={styles.iconRow}>
                    <View style={styles.iconContainer}>
                        <Image source={require('@/assets/images/icon.png')} style={styles.mainIcon} />
                        <Text style={[styles.iconLabel, { color: colors.textMuted }]}>Main Icon</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <View style={{ backgroundColor: '#001A2C', padding: 10, borderRadius: 10 }}>
                            <Image source={require('@/assets/images/adaptive-foreground.png')} style={styles.adaptiveIcon} />
                        </View>
                        <Text style={[styles.iconLabel, { color: colors.textMuted }]}>Adaptive</Text>
                    </View>
                </View>
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const mockStyles = StyleSheet.create({
    container: {
        width: 300,
        backgroundColor: '#0A1929',
        borderRadius: 24,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 30,
        height: 30,
    },
    title: {
        color: '#D4AF37',
        fontSize: 13,
        fontWeight: '600',
    },
    city: {
        color: '#6B7280',
        fontSize: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#1E3A5F',
        marginTop: 12,
        marginBottom: 8,
    },
    list: {
        gap: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    rowActive: {
        backgroundColor: '#162D4A',
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.4)',
    },
    indicator: {
        color: '#D4AF37',
        fontSize: 12,
        marginRight: 6,
    },
    pLabel: {
        color: '#94A3B8',
        fontSize: 13,
    },
    pTime: {
        color: '#CBD5E1',
        fontSize: 15,
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    section: {
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 16,
        letterSpacing: 1,
    },
    previewBox: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        borderRadius: 30,
        backgroundColor: '#000000',
        marginBottom: 12,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    iconContainer: {
        alignItems: 'center',
    },
    mainIcon: {
        width: 80,
        height: 80,
        borderRadius: 16,
    },
    adaptiveIcon: {
        width: 60,
        height: 60,
    },
    iconLabel: {
        fontSize: 12,
        marginTop: 8,
    },
    infoText: {
        fontSize: 13,
        lineHeight: 18,
    }
});
