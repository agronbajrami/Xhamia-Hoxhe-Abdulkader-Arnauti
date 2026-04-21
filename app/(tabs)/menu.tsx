import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SHADOWS } from '@/constants/Colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function MenuScreen() {
    const { t } = useLanguage();
    const { colors } = useTheme();
    const router = useRouter();

    const menuItems = [
        {
            id: 'qibla',
            title: t.qibla,
            icon: 'compass-outline',
            route: '/qibla',
            color: '#6BA3BE',
            description: t.qiblaShortcutSubtitle,
        },
        {
            id: 'adhkar',
            title: t.adhkar,
            icon: 'book-outline',
            route: '/adhkar',
            color: '#D4AF37',
            description: t.adhkarDescription,
        },
        {
            id: 'donacion',
            title: t.donation,
            icon: 'hand-holding-heart', // Sadaqa icon
            family: 'FontAwesome5',
            route: 'https://arnauti.org/donacione',
            color: '#10B981', // Charity green
            description: t.donationSubtitle,
            isExternal: true,
        },
        {
            id: 'preview',
            title: 'Design Preview',
            icon: 'color-palette-outline',
            route: '/preview',
            color: '#8B5CF6',
            description: 'Preview widget design & icons live',
        },
    ];

    const openExternalUrl = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (!supported) {
                Alert.alert(t.error, t.unableToOpenLink);
                return;
            }
            await Linking.openURL(url);
        } catch (error) {
            console.error('Error opening external URL:', error);
            Alert.alert(t.error, t.unableToOpenLink);
        }
    };

    const handlePress = (item: any) => {
        if (item.isExternal) {
            void openExternalUrl(item.route);
        } else {
            router.push(item.route);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
            <View style={styles.menuGrid}>
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                        onPress={() => handlePress(item)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                            {item.family === 'FontAwesome5' ? (
                                <FontAwesome5 name={item.icon as any} size={28} color={item.color} />
                            ) : (
                                <Ionicons name={item.icon as any} size={32} color={item.color} />
                            )}
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                            <Text style={[styles.description, { color: colors.textMuted }]}>{item.description}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingTop: 30,
    },
    menuGrid: {
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        ...SHADOWS.medium,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
    },
});
