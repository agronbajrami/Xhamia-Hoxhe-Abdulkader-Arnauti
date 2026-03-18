import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text
} from 'react-native';

import { COLORS } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export default function CustomSplashScreen({ onFinish }: { onFinish?: () => void }) {
    const logoScale = useRef(new Animated.Value(0.3)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleTranslateY = useRef(new Animated.Value(20)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const lineWidth = useRef(new Animated.Value(0)).current;
    const fadeOut = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            // 1. Logo fades in and scales up
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),

            // 2. Decorative line expands
            Animated.timing(lineWidth, {
                toValue: 1,
                duration: 400,
                useNativeDriver: false,
            }),

            // 3. Title slides up and fades in
            Animated.parallel([
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(titleTranslateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),

            // 4. Subtitle fades in
            Animated.timing(subtitleOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),

            // 5. Hold for a moment
            Animated.delay(1200),

            // 6. Fade everything out
            Animated.timing(fadeOut, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onFinish) onFinish();
        });
    }, []);

    const animatedLineWidth = lineWidth.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 60],
    });

    return (
        <Animated.View style={[styles.container, { opacity: fadeOut }]}>
            <LinearGradient
                colors={['#002B45', '#001A2C', '#000E1A']}
                style={styles.gradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            >
                {/* Logo */}
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            opacity: logoOpacity,
                            transform: [{ scale: logoScale }],
                        },
                    ]}
                >
                    <Image
                        source={require('@/assets/images/icon-transparent.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>

                {/* Decorative Line */}
                {/* <Animated.View
                    style={[
                        styles.decorativeLine,
                        { width: animatedLineWidth },
                    ]}
                /> */}

                {/* App Name */}
                <Animated.View
                    style={[
                        styles.titleContainer,
                        {
                            opacity: titleOpacity,
                            transform: [{ translateY: titleTranslateY }],
                        },
                    ]}
                >
                    <Text style={styles.title}>Hoxhë Abdulkadër</Text>
                    <Text style={styles.titleSecond}>Arnauti</Text>
                </Animated.View>

                {/* Subtitle */}
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 70,
    },
    logoContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 240,
        height: 240,
    },
    decorativeLine: {
        height: 2,
        backgroundColor: COLORS.brandGold,
        marginVertical: 24,
        borderRadius: 1,
        opacity: 0.6,
    },
    titleContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.white,
        letterSpacing: 1,
        textAlign: 'center',
    },
    titleSecond: {
        fontSize: 36,
        fontWeight: '900',
        color: COLORS.brandGold,
        letterSpacing: 2,
        marginTop: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.textMuted,
        marginTop: 16,
        letterSpacing: 3,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
});
