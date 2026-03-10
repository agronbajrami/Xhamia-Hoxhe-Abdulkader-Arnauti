import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Language } from '@/constants/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const LANGUAGES: { code: Language; label: string; flag: string; native: string }[] = [
    { code: 'sq', label: 'Shqip', flag: '🇦🇱', native: 'Shqip' },
    { code: 'mk', label: 'Македонски', flag: '🇲🇰', native: 'Македонски' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷', native: 'Türkçe' },
];

export default function SettingsScreen() {
    const { t, language, setLanguage } = useLanguage();
    const { colors, isDark, toggleTheme } = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const s = makeStyles(colors);

    return (
        <View style={[s.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <LinearGradient
                colors={isDark
                    ? ['#002B45', '#001A2C'] as [string, string]
                    : ['#FFFFFF', '#F5F5F0'] as [string, string]
                }
                style={s.header}
            >
                <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color={colors.brandGold} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>{t.settings}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

                {/* ── THEME ── */}
                <Text style={s.sectionTitle}>{t.theme}</Text>
                <View style={s.card}>
                    <View style={s.cardRow}>
                        <View style={s.rowLeft}>
                            <View style={[s.iconBox, { backgroundColor: `${colors.brandGold}15` }]}>
                                <Ionicons
                                    name={isDark ? 'moon' : 'sunny'}
                                    size={22}
                                    color={colors.brandGold}
                                />
                            </View>
                            <View>
                                <Text style={s.rowTitle}>
                                    {isDark ? t.darkTheme : t.lightTheme}
                                </Text>
                                <Text style={s.rowSubtitle}>
                                    {isDark ? t.lightTheme + ' →' : t.darkTheme + ' →'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: colors.inputBorder, true: `${colors.brandGold}60` }}
                            thumbColor={isDark ? colors.brandGold : colors.textMuted}
                        />
                    </View>
                </View>

                {/* ── LANGUAGE ── */}
                <Text style={[s.sectionTitle, { marginTop: 28 }]}>{t.selectLanguage}</Text>
                <View style={s.card}>
                    {LANGUAGES.map((lang, index) => {
                        const isSelected = language === lang.code;
                        return (
                            <React.Fragment key={lang.code}>
                                <TouchableOpacity
                                    style={s.langRow}
                                    onPress={() => setLanguage(lang.code)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={s.langFlag}>{lang.flag}</Text>
                                    <View style={s.langTextBlock}>
                                        <Text style={[s.langLabel, isSelected && { color: colors.brandGold }]}>
                                            {lang.native}
                                        </Text>
                                    </View>
                                    {isSelected && (
                                        <Ionicons name="checkmark-circle" size={22} color={colors.brandGold} />
                                    )}
                                </TouchableOpacity>
                                {index < LANGUAGES.length - 1 && <View style={s.divider} />}
                            </React.Fragment>
                        );
                    })}
                </View>

                {/* ── APP INFO ── */}
                <Text style={[s.sectionTitle, { marginTop: 28 }]}>{t.appSection}</Text>
                <View style={s.card}>
                    <View style={s.infoRow}>
                        <Ionicons name="information-circle-outline" size={20} color={colors.textMuted} />
                        <Text style={s.infoText}>Xhamia AbdulKadër Arnauti</Text>
                    </View>
                    <View style={s.divider} />
                    <View style={s.infoRow}>
                        <Ionicons name="globe-outline" size={20} color={colors.textMuted} />
                        <Text style={s.infoText}>arnauti.org</Text>
                    </View>
                    <View style={s.divider} />
                    <View style={s.infoRow}>
                        <Ionicons name="code-slash-outline" size={20} color={colors.textMuted} />
                        <Text style={s.infoText}>{t.versionLabel} 1.0.0</Text>
                    </View>
                </View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.cardBorder,
        },
        backBtn: {
            padding: 8,
            marginRight: 12,
            backgroundColor: `${colors.brandGold}10`,
            borderRadius: 12,
        },
        headerTitle: {
            fontSize: 22,
            fontWeight: '800',
            color: colors.text,
        },
        content: {
            padding: 20,
        },
        sectionTitle: {
            fontSize: 13,
            fontWeight: '700',
            color: colors.textMuted,
            letterSpacing: 1,
            textTransform: 'uppercase',
            marginBottom: 12,
        },
        card: {
            backgroundColor: colors.card,
            borderRadius: 20,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.cardBorder,
        },
        cardRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 18,
        },
        rowLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
        },
        iconBox: {
            width: 44,
            height: 44,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
        rowTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: colors.text,
        },
        rowSubtitle: {
            fontSize: 13,
            color: colors.textMuted,
            marginTop: 2,
        },
        langRow: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 18,
            gap: 14,
        },
        langFlag: {
            fontSize: 28,
        },
        langTextBlock: {
            flex: 1,
        },
        langLabel: {
            fontSize: 16,
            fontWeight: '700',
            color: colors.text,
        },
        divider: {
            height: 1,
            backgroundColor: colors.separator,
            marginLeft: 18,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 16,
        },
        infoText: {
            fontSize: 15,
            color: colors.textSecondary,
            fontWeight: '500',
        },
    });
}
