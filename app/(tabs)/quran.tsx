import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { COLORS } from '@/constants/Colors';
import { useLanguage } from '@/contexts/LanguageContext';

export default function QuranScreen() {
    const { t } = useLanguage();
    const webViewRef = useRef<WebView>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Refresh WebView when focused to ensure correct state
    useFocusEffect(
        useCallback(() => {
            // Optional: Reload logic if needed
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t.readQuran}</Text>
            </View>

            <View style={styles.webviewContainer}>
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.brandGold} />
                        <Text style={styles.loadingText}>{t.loading}</Text>
                    </View>
                )}

                <WebView
                    ref={webViewRef}
                    source={{ uri: 'https://quran.com/1?font=uthmani' }}
                    style={styles.webview}
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: 20,
        backgroundColor: COLORS.brandNavy,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(212,175,55,0.2)',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: COLORS.brandGold,
        letterSpacing: 0.5,
    },
    webviewContainer: {
        flex: 1,
    },
    webview: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        zIndex: 1,
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.textMuted,
    },
});
