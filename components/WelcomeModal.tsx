import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS, SIZES } from '@/constants/Colors';
import { useWelcome } from '@/contexts/WelcomeContext';

export default function WelcomeModal() {
    const { isVisible, hideWelcome } = useWelcome();

    if (!isVisible) return null;

    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <View style={styles.container}>
                <View style={styles.backdrop} />
                <View style={styles.content}>
                    <LinearGradient
                        colors={[COLORS.primary, COLORS.background]}
                        style={styles.card}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name="heart" size={64} color={COLORS.accent} />
                        </View>

                        <Text style={styles.message}>
                            I LOVE YOU RUMEJSA'M I HOPE YOU LOVE THIS GIFT
                        </Text>

                        <TouchableOpacity style={styles.button} onPress={hideWelcome}>
                            <Text style={styles.buttonText}>Start App</Text>
                            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    content: {
        width: '85%',
        maxWidth: 400,
        borderRadius: SIZES.radius * 2,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: COLORS.gold,
    },
    card: {
        padding: SIZES.padding * 2,
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 2,
        borderColor: COLORS.gold,
    },
    message: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 32,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.accent,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        gap: 8,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
    },
});
