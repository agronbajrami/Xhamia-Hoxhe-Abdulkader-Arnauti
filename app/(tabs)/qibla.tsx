import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

import { COLORS, SIZES } from '@/constants/Colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');
const COMPASS_SIZE = Math.min(width * 0.8, 340);
const GUIDE_SIZE = COMPASS_SIZE * 0.64;
const ALIGNMENT_THRESHOLD = 8;
const HEADING_SMOOTHING = 0.18;
const QIBLA_CALIBRATION_KEY = '@takvim/qibla_calibration_seen';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

const normalizeDegrees = (value: number) => ((value % 360) + 360) % 360;

const getShortestAngle = (from: number, to: number) => {
    const diff = normalizeDegrees(to - from);
    return diff > 180 ? diff - 360 : diff;
};

const calculateQiblaDirection = (lat: number, lng: number) => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
    const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;

    const y = Math.sin(kaabaLngRad - lngRad);
    const x =
        Math.cos(latRad) * Math.tan(kaabaLatRad) -
        Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);

    return Math.round(normalizeDegrees(Math.atan2(y, x) * (180 / Math.PI)));
};

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const earthRadiusKm = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

    return Math.round(earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))));
};

const getBestHeading = (heading: Location.LocationHeadingObject) => {
    if (Number.isFinite(heading.trueHeading) && heading.trueHeading >= 0) {
        return heading.trueHeading;
    }

    if (Number.isFinite(heading.magHeading) && heading.magHeading >= 0) {
        return heading.magHeading;
    }

    return null;
};

export default function QiblaScreen() {
    const { t } = useLanguage();
    const { colors, isDark } = useTheme();
    const [heading, setHeading] = useState<number | null>(null);
    const [qiblaDirection, setQiblaDirection] = useState(0);
    const [distance, setDistance] = useState<number | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isMagnetometerAvailable, setIsMagnetometerAvailable] = useState(true);
    const [isAligned, setIsAligned] = useState(false);
    const [alignmentDelta, setAlignmentDelta] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showCalibrationModal, setShowCalibrationModal] = useState(false);

    const rotation = useSharedValue(0);
    const qiblaDirectionRef = useRef(0);
    const headingRef = useRef<number | null>(null);
    const alignmentRef = useRef(false);

    const syncHeading = useCallback(
        (nextHeading: number) => {
            const previousHeading = headingRef.current;
            const smoothedHeading =
                previousHeading === null
                    ? normalizeDegrees(nextHeading)
                    : normalizeDegrees(
                          previousHeading +
                              getShortestAngle(previousHeading, nextHeading) * HEADING_SMOOTHING
                      );

            headingRef.current = smoothedHeading;

            const qibla = qiblaDirectionRef.current;
            const relativeRotation = getShortestAngle(smoothedHeading, qibla);
            const delta = Math.abs(relativeRotation);
            const aligned = delta <= ALIGNMENT_THRESHOLD;

            setHeading(Math.round(smoothedHeading));
            setAlignmentDelta(Math.round(delta));
            setIsAligned(aligned);

            if (aligned && !alignmentRef.current) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            alignmentRef.current = aligned;

            rotation.value = withSpring(relativeRotation, {
                damping: 22,
                stiffness: 140,
                mass: 0.6,
            });
        },
        [rotation]
    );

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            let subscription: Location.LocationSubscription | null = null;

            const setup = async () => {
                setIsLoading(true);
                setIsAligned(false);
                setAlignmentDelta(null);
                setHeading(null);
                headingRef.current = null;
                alignmentRef.current = false;
                rotation.value = 0;

                try {
                    const { status } = await Location.requestForegroundPermissionsAsync();

                    if (!isActive) {
                        return;
                    }

                    const permissionGranted = status === 'granted';
                    setHasPermission(permissionGranted);

                    if (!permissionGranted) {
                        setIsLoading(false);
                        return;
                    }

                    const [currentLocation, lastKnownLocation] = await Promise.all([
                        Location.getCurrentPositionAsync({
                            accuracy: Location.Accuracy.Balanced,
                        }).catch(() => null),
                        Location.getLastKnownPositionAsync(),
                    ]);

                    if (!isActive) {
                        return;
                    }

                    const resolvedLocation = currentLocation ?? lastKnownLocation;

                    if (!resolvedLocation) {
                        setIsLoading(false);
                        return;
                    }

                    const nextQiblaDirection = calculateQiblaDirection(
                        resolvedLocation.coords.latitude,
                        resolvedLocation.coords.longitude
                    );

                    qiblaDirectionRef.current = nextQiblaDirection;
                    setQiblaDirection(nextQiblaDirection);
                    setDistance(
                        calculateDistance(
                            resolvedLocation.coords.latitude,
                            resolvedLocation.coords.longitude,
                            KAABA_LAT,
                            KAABA_LNG
                        )
                    );

                    try {
                        const initialHeading = await Location.getHeadingAsync();
                        if (isActive) {
                            const resolvedHeading = getBestHeading(initialHeading);
                            if (resolvedHeading !== null) {
                                setIsMagnetometerAvailable(true);
                                syncHeading(resolvedHeading);
                            }
                        }
                    } catch (error) {
                        if (isActive) {
                            setIsMagnetometerAvailable(false);
                        }
                    }

                    subscription = await Location.watchHeadingAsync((headingUpdate) => {
                        if (!isActive) {
                            return;
                        }

                        const resolvedHeading = getBestHeading(headingUpdate);

                        if (resolvedHeading === null) {
                            setIsMagnetometerAvailable(false);
                            return;
                        }

                        setIsMagnetometerAvailable(true);
                        syncHeading(resolvedHeading);
                    });
                } catch (error) {
                    console.error('Error loading Qibla finder:', error);
                    if (isActive) {
                        setIsMagnetometerAvailable(false);
                    }
                } finally {
                    if (isActive) {
                        setIsLoading(false);
                    }
                }
            };

            setup();

            return () => {
                isActive = false;
                subscription?.remove();
            };
        }, [rotation, syncHeading])
    );

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const checkCalibrationHint = async () => {
                try {
                    const seenCalibrationHint = await AsyncStorage.getItem(QIBLA_CALIBRATION_KEY);

                    if (isActive && !seenCalibrationHint) {
                        setShowCalibrationModal(true);
                    }
                } catch (error) {
                    if (isActive) {
                        setShowCalibrationModal(true);
                    }
                }
            };

            checkCalibrationHint();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const closeCalibrationModal = useCallback(async () => {
        setShowCalibrationModal(false);

        try {
            await AsyncStorage.setItem(QIBLA_CALIBRATION_KEY, 'true');
        } catch (error) {
            console.error('Error saving calibration hint state:', error);
        }
    }, []);

    const animatedGuideStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const qiblaValue = useMemo(() => {
        if (isLoading) {
            return t.loading;
        }

        return `${qiblaDirection}° ${t.toMecca}`;
    }, [isLoading, qiblaDirection, t]);

    const distanceValue = useMemo(() => {
        if (isLoading || distance === null) {
            return t.loading;
        }

        return `${distance.toLocaleString()} ${t.km}`;
    }, [distance, isLoading, t]);

    const statusText = isLoading ? t.loading : isAligned ? t.aligned : t.pointToQibla;
    const backgroundGradient = isDark
        ? ['#07111F', '#0B2441', '#07111F']
        : ['#F8F5ED', '#FFFFFF', '#F3EFE3'];
    const heroGradient = isDark
        ? ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']
        : ['rgba(255,255,255,0.96)', 'rgba(242,236,220,0.9)'];

    if (!isMagnetometerAvailable && !isLoading) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={backgroundGradient as [string, string, string]}
                    style={styles.errorContainer}
                >
                    <Ionicons name="compass-outline" size={64} color={colors.textMuted} />
                    <Text style={[styles.errorText, { color: colors.textMuted }]}>{t.compassNotAvailable}</Text>
                </LinearGradient>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={backgroundGradient as [string, string, string]}
                    style={styles.errorContainer}
                >
                    <Ionicons name="location-outline" size={64} color={colors.textMuted} />
                    <Text style={[styles.errorText, { color: colors.textMuted }]}>{t.locationRequired}</Text>
                </LinearGradient>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={backgroundGradient as [string, string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />
            <View
                style={[
                    styles.glowTop,
                    { backgroundColor: isDark ? 'rgba(212,175,55,0.12)' : 'rgba(212,175,55,0.18)' },
                ]}
            />
            <View
                style={[
                    styles.glowBottom,
                    { backgroundColor: isDark ? 'rgba(0,98,51,0.16)' : 'rgba(0,98,51,0.10)' },
                ]}
            />

            <Modal
                animationType="fade"
                transparent
                visible={showCalibrationModal}
                onRequestClose={closeCalibrationModal}
            >
                <View
                    style={[
                        styles.modalOverlay,
                        { backgroundColor: isDark ? 'rgba(2, 8, 18, 0.76)' : 'rgba(15, 23, 42, 0.36)' },
                    ]}
                >
                    <View
                        style={[
                            styles.modalCard,
                            {
                                backgroundColor: isDark ? '#0A1A2D' : colors.card,
                                borderColor: isDark ? 'rgba(212,175,55,0.18)' : colors.cardBorder,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.modalIconWrap,
                                { backgroundColor: isDark ? 'rgba(212,175,55,0.12)' : 'rgba(201,162,39,0.14)' },
                            ]}
                        >
                            <Ionicons name="sync-circle" size={40} color={colors.brandGold} />
                        </View>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{t.qiblaCalibrationTitle}</Text>
                        <Text style={[styles.modalText, { color: colors.textSecondary }]}>
                            {t.qiblaCalibrationMessage}
                        </Text>

                        <View
                            style={[
                                styles.modalPreview,
                                {
                                    backgroundColor: isDark
                                        ? 'rgba(255,255,255,0.04)'
                                        : 'rgba(0,43,69,0.04)',
                                },
                            ]}
                        >
                            <Image
                                source={require('../../znaqk_page-0001-removebg-preview.png')}
                                style={styles.modalPreviewImage}
                                resizeMode="contain"
                            />
                        </View>

                        <Pressable
                            style={[styles.modalButton, { backgroundColor: colors.brandGold }]}
                            onPress={closeCalibrationModal}
                        >
                            <Text style={[styles.modalButtonText, { color: isDark ? COLORS.background : '#1F2937' }]}>
                                {t.qiblaCalibrationButton}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <View style={styles.content}>
                <View style={styles.header}>
                    <View
                        style={[
                            styles.headerBadge,
                            {
                                backgroundColor: isDark ? 'rgba(212,175,55,0.12)' : 'rgba(201,162,39,0.12)',
                                borderColor: isDark ? 'rgba(212,175,55,0.22)' : 'rgba(0,43,69,0.10)',
                            },
                        ]}
                    >
                        <Ionicons name="navigate" size={14} color={colors.brandGold} />
                        <Text style={[styles.headerBadgeText, { color: colors.brandGold }]}>{t.qibla}</Text>
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>{t.qiblaDirection}</Text>
                    <Text style={[styles.subtitle, { color: colors.textMuted }]}>{statusText}</Text>
                </View>

                <LinearGradient
                    colors={heroGradient as [string, string]}
                    style={[
                        styles.heroCard,
                        {
                            borderColor: isDark ? 'rgba(255,255,255,0.08)' : colors.cardBorder,
                        },
                    ]}
                >
                    <View style={styles.statusRow}>
                        <View
                            style={[
                                styles.statusPill,
                                {
                                    backgroundColor: isDark
                                        ? 'rgba(255,255,255,0.08)'
                                        : 'rgba(0,43,69,0.06)',
                                },
                                isAligned && styles.statusPillAligned,
                                isAligned && { backgroundColor: colors.brandGold },
                            ]}
                        >
                            <Ionicons
                                name={isAligned ? 'checkmark-circle' : 'radio-button-on'}
                                size={16}
                                color={isAligned ? (isDark ? COLORS.background : '#1F2937') : colors.brandGold}
                            />
                            <Text
                                style={[
                                    styles.statusPillText,
                                    { color: colors.text },
                                    isAligned && styles.statusPillTextAligned,
                                    isAligned && { color: isDark ? COLORS.background : '#1F2937' },
                                ]}
                            >
                                {isLoading ? t.loading : isAligned ? t.aligned : `${alignmentDelta ?? 0}°`}
                            </Text>
                        </View>

                        <Text style={[styles.headingValue, { color: colors.text }]}>
                            {heading === null || isLoading ? t.loading : `${heading}°`}
                        </Text>
                    </View>

                    <View style={styles.compassFrame}>
                        <View style={styles.topTarget}>
                            <LinearGradient
                                colors={COLORS.gradientGold}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.topTargetInner}
                            />
                        </View>

                        <View
                            style={[
                                styles.compassFace,
                                {
                                    backgroundColor: isDark ? 'rgba(3,14,28,0.86)' : 'rgba(255,255,255,0.94)',
                                    borderColor: isDark ? 'rgba(212,175,55,0.16)' : 'rgba(0,43,69,0.12)',
                                    shadowColor: isDark ? '#000000' : '#0F172A',
                                },
                                isAligned && styles.compassFaceAligned,
                                isAligned && {
                                    borderColor: isDark ? 'rgba(212,175,55,0.72)' : 'rgba(201,162,39,0.68)',
                                    shadowColor: colors.brandGold,
                                },
                            ]}
                        >
                            {[...Array(24)].map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.tick,
                                        {
                                            backgroundColor: isDark
                                                ? 'rgba(255,255,255,0.18)'
                                                : 'rgba(0,43,69,0.14)',
                                        },
                                        {
                                            transform: [
                                                { rotate: `${index * 15}deg` },
                                                { translateY: -COMPASS_SIZE / 2 + 22 },
                                            ],
                                        },
                                        index % 6 === 0 && styles.majorTick,
                                        index % 6 === 0 && {
                                            backgroundColor: isDark
                                                ? 'rgba(212,175,55,0.45)'
                                                : 'rgba(201,162,39,0.50)',
                                        },
                                        isAligned && index % 6 === 0 && styles.majorTickAligned,
                                        isAligned && index % 6 === 0 && { backgroundColor: colors.brandGold },
                                    ]}
                                />
                            ))}

                            <Text
                                style={[
                                    styles.directionText,
                                    styles.north,
                                    { color: colors.brandGold },
                                ]}
                            >
                                N
                            </Text>
                            <Text
                                style={[
                                    styles.directionText,
                                    styles.east,
                                    { color: isDark ? 'rgba(255,255,255,0.62)' : 'rgba(13,27,42,0.58)' },
                                ]}
                            >
                                E
                            </Text>
                            <Text
                                style={[
                                    styles.directionText,
                                    styles.south,
                                    { color: isDark ? 'rgba(255,255,255,0.62)' : 'rgba(13,27,42,0.58)' },
                                ]}
                            >
                                S
                            </Text>
                            <Text
                                style={[
                                    styles.directionText,
                                    styles.west,
                                    { color: isDark ? 'rgba(255,255,255,0.62)' : 'rgba(13,27,42,0.58)' },
                                ]}
                            >
                                W
                            </Text>

                            <Animated.View style={[styles.guideWrap, animatedGuideStyle]}>
                                <Image
                                    source={require('../../znaqk_page-0001-removebg-preview.png')}
                                    style={[styles.guideImage, isAligned && styles.guideImageAligned]}
                                    resizeMode="contain"
                                />
                            </Animated.View>

                            <View
                                style={[
                                    styles.centerCore,
                                    {
                                        backgroundColor: isDark ? 'rgba(7,17,31,0.94)' : 'rgba(248,245,237,0.96)',
                                        borderColor: isDark
                                            ? 'rgba(212,175,55,0.42)'
                                            : 'rgba(0,43,69,0.16)',
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.centerGlow,
                                        {
                                            backgroundColor: isDark
                                                ? 'rgba(212,175,55,0.16)'
                                                : 'rgba(201,162,39,0.18)',
                                        },
                                    ]}
                                />
                                <View
                                    style={[
                                        styles.centerDot,
                                        {
                                            backgroundColor: colors.brandGold,
                                            borderColor: isDark
                                                ? 'rgba(255,255,255,0.24)'
                                                : 'rgba(255,255,255,0.78)',
                                        },
                                    ]}
                                />
                            </View>
                        </View>
                    </View>

                    <Text style={[styles.helperText, { color: colors.textMuted }]}>{t.calibrate}</Text>
                </LinearGradient>

                <View style={styles.infoContainer}>
                    <View
                        style={[
                            styles.infoCard,
                            {
                                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : colors.card,
                                borderColor: isDark ? 'rgba(255,255,255,0.07)' : colors.cardBorder,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.infoIcon,
                                styles.infoIconPrimary,
                                {
                                    backgroundColor: isDark
                                        ? 'rgba(212,175,55,0.14)'
                                        : 'rgba(201,162,39,0.12)',
                                },
                            ]}
                        >
                            <Ionicons name="compass" size={18} color={colors.brandGold} />
                        </View>
                        <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{t.qiblaDirection}</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{qiblaValue}</Text>
                    </View>

                    <View
                        style={[
                            styles.infoCard,
                            {
                                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : colors.card,
                                borderColor: isDark ? 'rgba(255,255,255,0.07)' : colors.cardBorder,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.infoIcon,
                                styles.infoIconAccent,
                                {
                                    backgroundColor: isDark ? 'rgba(0,98,51,0.7)' : 'rgba(0,98,51,0.12)',
                                },
                            ]}
                        >
                            <Ionicons
                                name="location"
                                size={18}
                                color={isDark ? COLORS.white : colors.primary}
                            />
                        </View>
                        <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{t.qiblaDistance}</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{distanceValue}</Text>
                    </View>
                </View>

                {isLoading && (
                    <View style={styles.loadingRow}>
                        <ActivityIndicator color={colors.brandGold} />
                        <Text style={[styles.loadingText, { color: colors.textMuted }]}>{t.loading}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        paddingTop: SIZES.padding * 4.5,
        paddingBottom: SIZES.padding * 1.5,
        justifyContent: 'space-between',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(2, 8, 18, 0.76)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalCard: {
        width: '100%',
        maxWidth: 360,
        borderRadius: 28,
        paddingHorizontal: 22,
        paddingTop: 24,
        paddingBottom: 20,
        backgroundColor: '#0A1A2D',
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.18)',
        alignItems: 'center',
    },
    modalIconWrap: {
        width: 68,
        height: 68,
        borderRadius: 34,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(212,175,55,0.12)',
        marginBottom: 14,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    modalPreview: {
        width: 120,
        height: 120,
        marginTop: 18,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
    modalPreviewImage: {
        width: 92,
        height: 92,
    },
    modalButton: {
        minWidth: 150,
        borderRadius: 999,
        paddingHorizontal: 24,
        paddingVertical: 14,
        backgroundColor: COLORS.brandGold,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonText: {
        color: COLORS.background,
        fontSize: 15,
        fontWeight: '800',
    },
    glowTop: {
        position: 'absolute',
        top: -60,
        right: -20,
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: 'rgba(212,175,55,0.12)',
    },
    glowBottom: {
        position: 'absolute',
        bottom: 40,
        left: -60,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(0,98,51,0.16)',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding * 2,
    },
    errorText: {
        fontSize: 18,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: 16,
    },
    header: {
        alignItems: 'center',
        gap: 10,
    },
    headerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: 'rgba(212,175,55,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.22)',
    },
    headerBadgeText: {
        color: COLORS.brandGold,
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.white,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 21,
        color: COLORS.textMuted,
        textAlign: 'center',
        maxWidth: 280,
    },
    heroCard: {
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 16,
        overflow: 'hidden',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    statusPillAligned: {
        backgroundColor: COLORS.brandGold,
    },
    statusPillText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '700',
    },
    statusPillTextAligned: {
        color: COLORS.background,
    },
    headingValue: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: '800',
    },
    compassFrame: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 18,
    },
    topTarget: {
        width: 34,
        height: 34,
        borderRadius: 17,
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: -18,
        zIndex: 2,
    },
    topTargetInner: {
        flex: 1,
        borderRadius: 999,
    },
    compassFace: {
        width: COMPASS_SIZE,
        height: COMPASS_SIZE,
        borderRadius: COMPASS_SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(3,14,28,0.86)',
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.16)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.24,
        shadowRadius: 18,
        elevation: 12,
    },
    compassFaceAligned: {
        borderColor: 'rgba(212,175,55,0.72)',
        shadowColor: COLORS.brandGold,
        shadowOpacity: 0.28,
    },
    tick: {
        position: 'absolute',
        width: 1.5,
        height: 10,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.18)',
    },
    majorTick: {
        height: 16,
        width: 2.5,
        backgroundColor: 'rgba(212,175,55,0.45)',
    },
    majorTickAligned: {
        backgroundColor: COLORS.brandGold,
    },
    directionText: {
        position: 'absolute',
        fontSize: 15,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.62)',
    },
    north: {
        top: 28,
        color: COLORS.brandGold,
    },
    east: {
        right: 32,
    },
    south: {
        bottom: 30,
    },
    west: {
        left: 32,
    },
    guideWrap: {
        width: GUIDE_SIZE,
        height: GUIDE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guideImage: {
        width: GUIDE_SIZE,
        height: GUIDE_SIZE,
        opacity: 0.94,
    },
    guideImageAligned: {
        opacity: 1,
    },
    centerCore: {
        position: 'absolute',
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: 'rgba(7,17,31,0.94)',
        borderWidth: 1.5,
        borderColor: 'rgba(212,175,55,0.42)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerGlow: {
        position: 'absolute',
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(212,175,55,0.16)',
    },
    centerDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.brandGold,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.24)',
    },
    helperText: {
        fontSize: 12,
        lineHeight: 18,
        color: COLORS.textMuted,
        textAlign: 'center',
        paddingHorizontal: 8,
    },
    infoContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 14,
    },
    infoCard: {
        flex: 1,
        borderRadius: 22,
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
        gap: 10,
    },
    infoIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoIconPrimary: {
        backgroundColor: 'rgba(212,175,55,0.14)',
    },
    infoIconAccent: {
        backgroundColor: 'rgba(0,98,51,0.7)',
    },
    infoLabel: {
        color: COLORS.textMuted,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    infoValue: {
        color: COLORS.white,
        fontSize: 17,
        fontWeight: '800',
        lineHeight: 23,
    },
    loadingRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingTop: 16,
    },
    loadingText: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
});
