import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SHADOWS } from '@/constants/Colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { EVENING_ADHKAR_ITEMS } from '@/data/eveningAdhkar';
import { useTheme } from '@/contexts/ThemeContext';
import adhkarData from '@/data/adhkar.json';
import { MORNING_ADHKAR_ITEMS } from '@/data/morningAdhkar';
import { MORNING_EVENING_INTRO, type LocalizedText } from '@/data/morningEveningIntro';

interface AdhkarItem {
    id: string;
    arabic: string;
    translation: string | LocalizedText;
    transliteration: string | LocalizedText;
    repeat: number;
    source: string | LocalizedText;
    note?: string | LocalizedText;
}

interface Category {
    id: string;
    title: string;
    subtitle: string;
    arabic: string;
    icon: string;
    color: string;
    count: number;
}

const ARABIC_NUMERALS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

const toArabicNumerals = (value: number) =>
    value
        .toString()
        .split('')
        .map((digit) => ARABIC_NUMERALS[Number(digit)] ?? digit)
        .join('');

export default function AdhkarScreen() {
    const { t, language } = useLanguage();
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();

    // null = show menu, category object = show detail
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [showTranslation, setShowTranslation] = useState<Record<string, boolean>>({});
    const [completedAll, setCompletedAll] = useState(false);

    const categories: Category[] = adhkarData.categories as Category[];
    const morningEveningItemsByCategory = {
        morning: MORNING_ADHKAR_ITEMS,
        evening: EVENING_ADHKAR_ITEMS,
    } as const;

    const adhkar: AdhkarItem[] = activeCategory
        ? ((morningEveningItemsByCategory as any)[activeCategory.id] || (adhkarData.items as any)[activeCategory.id] || [])
        : [];

    const getLocalizedText = (value: string | LocalizedText | undefined) => {
        if (!value) return '';
        return typeof value === 'string' ? value : value[language] ?? value.sq;
    };

    const getCategoryTitle = (category: Category) => {
        if (category.id === 'morning') return t.morningAdhkar;
        if (category.id === 'evening') return t.eveningAdhkar;
        return category.title;
    };

    const getCategorySubtitle = (category: Category) => {
        if (category.id === 'morning') {
            return language === 'sq' ? 'Pas Sabahut' : language === 'mk' ? 'По сабах' : 'Sabah namazindan sonra';
        }
        if (category.id === 'evening') {
            return language === 'sq' ? 'Pas Ikindisë' : language === 'mk' ? 'По икиндија' : 'Ikindi namazindan sonra';
        }
        return category.subtitle;
    };

    const getCategoryCount = (category: Category) => {
        if (category.id === 'morning') return MORNING_ADHKAR_ITEMS.length;
        if (category.id === 'evening') return EVENING_ADHKAR_ITEMS.length;
        return category.count;
    };

    useEffect(() => {
        if (!activeCategory) return;
        const allCompleted = adhkar.every((item) => (counts[item.id] || 0) >= item.repeat);
        setCompletedAll(allCompleted);
    }, [counts, adhkar, activeCategory]);

    const handleCount = async (adhkarId: string, maxCount: number) => {
        const currentCount = counts[adhkarId] || 0;
        if (currentCount < maxCount) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setCounts((prev) => ({ ...prev, [adhkarId]: currentCount + 1 }));
            if (currentCount + 1 >= maxCount) {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        }
    };

    const resetCount = (adhkarId: string) => {
        setCounts((prev) => ({ ...prev, [adhkarId]: 0 }));
    };

    const resetAll = () => setCounts({});

    const toggleTranslation = (adhkarId: string) => {
        setShowTranslation((prev) => ({ ...prev, [adhkarId]: !prev[adhkarId] }));
    };

    const getProgress = () => {
        const total = adhkar.length;
        const completed = adhkar.filter((item) => (counts[item.id] || 0) >= item.repeat).length;
        return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
    };

    const renderArabicWithVerseNumbers = (text: string, markerColor: string) => {
        const segments = text
            .split(/\s*۝\s*/u)
            .map((segment) => segment.trim())
            .filter(Boolean);

        if (segments.length <= 1) {
            return text;
        }

        return segments.flatMap((segment, index) => {
            const parts: React.ReactNode[] = [<Text key={`segment-${index}`}>{segment}</Text>];

            if (index < segments.length - 1) {
                parts.push(
                    <Text key={`marker-${index}`} style={[styles.ayahMarker, { color: markerColor }]}>
                        {` ﴿${toArabicNumerals(index + 1)}﴾ `}
                    </Text>
                );
            }

            return parts;
        });
    };

    // ─── MENU VIEW ────────────────────────────────────────────────────────────────
    if (!activeCategory) {
        return (
            <View style={styles.container}>
                {/* Hero Header */}
                <ImageBackground
                    source={require('@/assets/images/masjid_al_aqsa.png')}
                    style={styles.heroBackground}
                    resizeMode="cover"
                >
                    <LinearGradient
                        colors={isDark
                            ? ['rgba(0,26,44,0.35)', 'rgba(0,26,44,0.85)', colors.background]
                            : ['rgba(255,255,255,0.45)', 'rgba(255,255,255,0.85)', colors.background]
                        }
                        style={[styles.heroGradient, { paddingTop: insets.top + 16 }]}
                    >
                        <Text style={[styles.headerTitle, { color: colors.text }]}>{t.adhkar}</Text>
                        <Text style={[styles.headerSubtitle, { color: colors.brandGold }]}>{t.selectCategory}</Text>
                    </LinearGradient>
                </ImageBackground>

                {/* Category Grid */}
                <ScrollView
                    style={styles.menuScroll}
                    contentContainerStyle={styles.menuContent}
                    showsVerticalScrollIndicator={false}
                >
                    {categories.map((cat) => {
                        // Count completions for this category
                        const catItems: AdhkarItem[] = (adhkarData.items as any)[cat.id] || [];
                        const done = catItems.every((item) => (counts[item.id] || 0) >= item.repeat);
                        const anyProgress = catItems.some((item) => (counts[item.id] || 0) > 0);

                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                                onPress={() => setActiveCategory(cat)}
                                activeOpacity={0.8}
                            >
                                {/* Left Icon */}
                                <View style={[styles.menuIconBg, { backgroundColor: `${cat.color}20` }]}>
                                    <Ionicons name={cat.icon as any} size={28} color={cat.color} />
                                </View>

                                {/* Text */}
                                <View style={styles.menuTextBlock}>
                                    <Text style={[styles.menuTitle, { color: colors.text }]}>{getCategoryTitle(cat)}</Text>
                                    <Text style={[styles.menuSubtitle, { color: colors.textMuted }]}>{getCategorySubtitle(cat)}</Text>
                                    <Text style={[styles.menuArabic, { color: colors.brandGold }]}>{cat.arabic}</Text>
                                </View>

                                {/* Right */}
                                <View style={styles.menuRight}>
                                    <View style={[styles.countBadge, { backgroundColor: `${cat.color}20` }]}>
                                        <Text style={[styles.countBadgeText, { color: cat.color }]}>
                                            {getCategoryCount(cat)} {t.items}
                                        </Text>
                                    </View>
                                    {done ? (
                                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={{ marginTop: 8 }} />
                                    ) : anyProgress ? (
                                        <Ionicons name="ellipse-outline" size={20} color={colors.brandGold} style={{ marginTop: 8 }} />
                                    ) : (
                                        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={{ marginTop: 8 }} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        );
    }

    // ─── DETAIL VIEW ─────────────────────────────────────────────────────────────
    const progress = getProgress();

    return (
        <View style={styles.container}>
            {/* Detail Hero Header */}
            <ImageBackground
                source={require('@/assets/images/masjid_al_aqsa.png')}
                style={styles.heroBackground}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={isDark
                        ? ['rgba(0,26,44,0.4)', 'rgba(0,26,44,0.85)', colors.background]
                        : ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.85)', colors.background]
                    }
                    style={[styles.heroGradient, { paddingTop: insets.top + 10 }]}
                >
                    {/* Back button */}
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: `${colors.brandGold}20` }]}
                        onPress={() => { setActiveCategory(null); setCompletedAll(false); }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={20} color={colors.brandGold} />
                        <Text style={[styles.backText, { color: colors.brandGold }]}>{t.back}</Text>
                    </TouchableOpacity>

                    <View style={styles.detailHeaderRow}>
                        <View style={[styles.detailIconBg, { backgroundColor: `${activeCategory.color}25` }]}>
                            <Ionicons name={activeCategory.icon as any} size={28} color={activeCategory.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.headerTitle, { color: colors.text }]}>{activeCategory.title}</Text>
                            <Text style={[styles.headerSubtitle, { color: colors.brandGold }]}>{activeCategory.arabic}</Text>
                        </View>
                    </View>

                    {/* Progress Card */}
                    <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                        <View style={styles.progressRowTop}>
                            <Text style={[styles.progressLabel, { color: colors.brandGold }]}>
                                {t.progress}: <Text style={{ color: colors.text, fontWeight: '800' }}>{progress.completed}</Text>
                                <Text style={{ color: colors.textMuted }}> / {progress.total}</Text>
                            </Text>
                            <TouchableOpacity onPress={resetAll} style={[styles.resetBtn, { backgroundColor: `${colors.brandGold}15` }]} activeOpacity={0.7}>
                                <Ionicons name="refresh-outline" size={15} color={colors.brandGold} />
                                <Text style={[styles.resetBtnText, { color: colors.brandGold }]}>{t.resetAll}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.progressTrack, { backgroundColor: colors.inputBg }]}>
                            <LinearGradient
                                colors={[activeCategory.color, colors.brandGold]}
                                style={[styles.progressFill, { width: `${progress.percentage}%` }]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            />
                        </View>
                        {completedAll && (
                            <Text style={[styles.completedText, { color: colors.brandGold }]}>✨ {t.completed}</Text>
                        )}
                    </View>
                </LinearGradient>
            </ImageBackground>

            {/* Adhkar List */}
            <ScrollView style={styles.adhkarScroll} showsVerticalScrollIndicator={false}>
                {(activeCategory.id === 'morning' || activeCategory.id === 'evening') && (
                    <View
                        style={[
                            styles.introPanel,
                            {
                                backgroundColor: `${activeCategory.color}10`,
                                borderColor: `${activeCategory.color}30`,
                            },
                        ]}
                    >
                        <Text style={[styles.introArabic, { color: colors.text }]}>
                            {MORNING_EVENING_INTRO.arabic}
                        </Text>
                        <Text style={[styles.introTranslit, { color: activeCategory.color }]}>
                            {MORNING_EVENING_INTRO.transliteration}
                        </Text>
                        <Text style={[styles.introTranslation, { color: colors.textSecondary }]}>
                            {getLocalizedText(MORNING_EVENING_INTRO.translation)}
                        </Text>
                        <Text style={[styles.introNote, { color: colors.textMuted }]}>
                            {getLocalizedText(MORNING_EVENING_INTRO.note)}
                        </Text>
                    </View>
                )}
                {adhkar.map((item, index) => {
                    const currentCount = counts[item.id] || 0;
                    const isCompleted = currentCount >= item.repeat;
                    const showTrans = showTranslation[item.id];

                    return (
                        <Pressable
                            key={item.id}
                            style={[
                                styles.adhkarCard,
                                {
                                    backgroundColor: isCompleted ? `${activeCategory.color}10` : colors.card,
                                    borderColor: isCompleted ? `${activeCategory.color}45` : colors.cardBorder,
                                },
                                isCompleted && styles.adhkarCardDone
                            ]}
                            onPress={() => handleCount(item.id, item.repeat)}
                            onLongPress={() => toggleTranslation(item.id)}
                        >
                            {isCompleted && (
                                <View
                                    style={[
                                        styles.doneAccent,
                                        { backgroundColor: activeCategory.color },
                                    ]}
                                />
                            )}

                            {/* Transliteration above */}
                            <Text style={[styles.translit, { color: activeCategory.color }]}>
                                {getLocalizedText(item.transliteration)}
                            </Text>

                            {/* Arabic */}
                            <Text style={[styles.arabic, { color: colors.text }]}>
                                {renderArabicWithVerseNumbers(item.arabic, activeCategory.color)}
                            </Text>

                            {/* Translation toggle */}
                            {showTrans && (
                                <View style={[styles.transBox, { backgroundColor: colors.inputBg, borderLeftColor: activeCategory.color }]}>
                                    <Text style={[styles.transText, { color: colors.textSecondary }]}>{getLocalizedText(item.translation)}</Text>
                                    {item.note && (
                                        <Text style={[styles.noteText, { color: colors.textMuted }]}>
                                            {getLocalizedText(item.note)}
                                        </Text>
                                    )}
                                </View>
                            )}

                            {/* Footer */}
                            <View style={styles.cardFooter}>
                                <View style={[styles.sourceRow, { borderTopColor: colors.separator }]}>
                                    <Ionicons name="book-outline" size={11} color={colors.textMuted} />
                                    <Text style={[styles.sourceText, { color: colors.textMuted }]}>{getLocalizedText(item.source)}</Text>
                                </View>

                                <View style={styles.counterRow}>
                                    <TouchableOpacity
                                        onPress={() => resetCount(item.id)}
                                        style={[styles.iconBtn, { backgroundColor: colors.inputBg }]}
                                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                    >
                                        <Ionicons name="refresh-outline" size={15} color={colors.textMuted} />
                                    </TouchableOpacity>

                                    {/* Tap-to-count pill */}
                                    <Pressable
                                        onPress={() => handleCount(item.id, item.repeat)}
                                        style={[styles.counterPill, { backgroundColor: colors.inputBg, borderColor: `${colors.brandGold}30` }, isCompleted && { backgroundColor: activeCategory.color }]}
                                    >
                                        <Text style={[styles.counterPillText, { color: colors.text }, isCompleted && { color: colors.brandNavy }]}>
                                            {currentCount} / {item.repeat}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>

                            {/* Tap hint */}
                            {!isCompleted && currentCount === 0 && (
                                <Text style={[styles.tapHint, { color: colors.textMuted }]}>{t.tapToCount} {' • '} {t.longPressTranslation}</Text>
                            )}
                        </Pressable>
                    );
                })}
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // ── Hero ──────────────────────────────────────────────────────────
    heroBackground: {
        width: '100%',
    },
    heroGradient: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '900',
        letterSpacing: 0.3,
    },
    headerSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2,
    },

    // ── Menu ──────────────────────────────────────────────────────────
    menuScroll: {
        flex: 1,
    },
    menuContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        gap: 14,
    },
    menuCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        ...SHADOWS.medium,
    },
    menuIconBg: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuTextBlock: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 12,
        marginBottom: 4,
    },
    menuArabic: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'right',
    },
    menuRight: {
        alignItems: 'flex-end',
        marginLeft: 10,
    },
    countBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    countBadgeText: {
        fontSize: 11,
        fontWeight: '700',
    },

    // ── Detail Header ─────────────────────────────────────────────────
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    backText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    detailHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
    },
    detailIconBg: {
        width: 52,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ── Progress ──────────────────────────────────────────────────────
    progressCard: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        ...SHADOWS.large,
    },
    progressRowTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    resetBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    resetBtnText: {
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 5,
    },
    progressTrack: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    completedText: {
        textAlign: 'center',
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 14,
    },

    // ── Adhkar List ────────────────────────────────────────────────────
    adhkarScroll: {
        flex: 1,
    },
    introPanel: {
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 4,
        borderRadius: 18,
        borderWidth: 1,
        padding: 18,
    },
    introArabic: {
        fontSize: 18,
        lineHeight: 32,
        textAlign: 'right',
        marginBottom: 10,
        fontWeight: '500',
    },
    introTranslit: {
        fontSize: 12,
        fontStyle: 'italic',
        marginBottom: 10,
        fontWeight: '600',
    },
    introTranslation: {
        fontSize: 13,
        lineHeight: 21,
    },
    introNote: {
        fontSize: 12,
        lineHeight: 19,
        marginTop: 10,
    },
    adhkarCard: {
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 0,
        borderRadius: 20,
        padding: 24,
        paddingTop: 24,
        borderWidth: 1,
        ...SHADOWS.medium,
    },
    adhkarCardDone: {
        borderWidth: 1,
    },
    doneAccent: {
        position: 'absolute',
        top: 0,
        left: 18,
        right: 18,
        height: 3,
        borderBottomLeftRadius: 999,
        borderBottomRightRadius: 999,
    },
    translit: {
        fontSize: 13,
        fontStyle: 'italic',
        marginBottom: 10,
        fontWeight: '600',
    },
    arabic: {
        fontSize: 24,
        lineHeight: 42,
        textAlign: 'right',
        marginBottom: 16,
        fontWeight: '500',
    },
    ayahMarker: {
        fontSize: 18,
        fontWeight: '700',
    },
    transBox: {
        padding: 14,
        borderRadius: 12,
        marginBottom: 14,
        borderLeftWidth: 3,
    },
    transText: {
        fontSize: 13,
        lineHeight: 21,
    },
    noteText: {
        fontSize: 12,
        lineHeight: 19,
        marginTop: 10,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        paddingTop: 14,
        marginTop: 4,
    },
    sourceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    sourceText: {
        fontSize: 11,
        marginLeft: 5,
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconBtn: {
        padding: 8,
        borderRadius: 10,
    },
    counterPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 24,
        borderWidth: 1,
    },
    counterPillText: {
        fontSize: 15,
        fontWeight: '800',
    },
    tapHint: {
        fontSize: 11,
        textAlign: 'center',
        marginTop: 10,
        fontStyle: 'italic',
    },
});
