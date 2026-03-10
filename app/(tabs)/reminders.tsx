import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { SHADOWS } from '@/constants/Colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
    cancelNotification,
    requestPermissions,
    scheduleReminderNotification,
} from '@/services/notifications';
import {
    Reminder,
    addReminder,
    deleteReminder,
    generateId,
    getReminders,
    updateReminder,
} from '@/services/storage';

type RepeatOption = 'none' | 'daily' | 'weekly';

export default function RemindersScreen() {
    const { t } = useLanguage();
    const { colors } = useTheme();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
    const [permissionGranted, setPermissionGranted] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [repeat, setRepeat] = useState<RepeatOption>('none');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Load reminders on focus
    useFocusEffect(
        useCallback(() => {
            loadReminders();
            checkPermissions();
        }, [])
    );

    const checkPermissions = async () => {
        const granted = await requestPermissions();
        setPermissionGranted(granted);
    };

    const loadReminders = async () => {
        const data = await getReminders();
        // Sort by time
        data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        setReminders(data);
    };

    const openAddModal = () => {
        setEditingReminder(null);
        setTitle('');
        setDescription('');
        setSelectedDate(new Date());
        setRepeat('none');
        setShowModal(true);
    };

    const openEditModal = (reminder: Reminder) => {
        setEditingReminder(reminder);
        setTitle(reminder.title);
        setDescription(reminder.description || '');
        setSelectedDate(new Date(reminder.time));
        setRepeat(reminder.repeat);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert(t.error, t.enterReminderTitle);
            return;
        }

        try {
            if (editingReminder) {
                // Update existing reminder
                if (editingReminder.notificationId) {
                    await cancelNotification(editingReminder.notificationId);
                }

                const updated: Reminder = {
                    ...editingReminder,
                    title: title.trim(),
                    description: description.trim() || undefined,
                    time: selectedDate.toISOString(),
                    repeat,
                };

                if (updated.enabled && permissionGranted) {
                    const notificationId = await scheduleReminderNotification(updated);
                    updated.notificationId = notificationId || undefined;
                }

                await updateReminder(updated);
            } else {
                // Create new reminder
                const newReminder: Reminder = {
                    id: generateId(),
                    title: title.trim(),
                    description: description.trim() || undefined,
                    time: selectedDate.toISOString(),
                    repeat,
                    enabled: true,
                };

                if (permissionGranted) {
                    const notificationId = await scheduleReminderNotification(newReminder);
                    newReminder.notificationId = notificationId || undefined;
                }

                await addReminder(newReminder);
            }

            setShowModal(false);
            loadReminders();
        } catch (error) {
            console.error('Error saving reminder:', error);
            Alert.alert(t.error, t.failedToSaveReminder);
        }
    };

    const handleDelete = async (id: string) => {
        Alert.alert(t.delete, t.confirmDeleteReminder, [
            { text: t.cancel, style: 'cancel' },
            {
                text: t.delete,
                style: 'destructive',
                onPress: async () => {
                    try {
                        const reminder = reminders.find(r => r.id === id);
                        if (reminder?.notificationId) {
                            await cancelNotification(reminder.notificationId);
                        }
                        await deleteReminder(id);
                        setShowModal(false);
                        loadReminders();
                    } catch (error) {
                        console.error('Error deleting reminder:', error);
                    }
                },
            },
        ]);
    };

    const handleToggle = async (reminder: Reminder, newValue: boolean) => {
        try {
            const updated = { ...reminder, enabled: newValue };

            if (updated.enabled && permissionGranted) {
                const notificationId = await scheduleReminderNotification(updated);
                updated.notificationId = notificationId || undefined;
            } else if (!updated.enabled && reminder.notificationId) {
                await cancelNotification(reminder.notificationId);
                updated.notificationId = undefined;
            }

            await updateReminder(updated);
            loadReminders();
        } catch (error) {
            console.error('Error toggling reminder:', error);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (date.toDateString() === now.toDateString()) {
            return `Sot në ${timeStr}`;
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return `Nesër në ${timeStr}`;
        } else {
            return `${date.toLocaleDateString()} në ${timeStr}`;
        }
    };

    const getRepeatLabel = (repeat: RepeatOption) => {
        switch (repeat) {
            case 'daily':
                return 'Repeats daily';
            case 'weekly':
                return 'Repeats weekly';
            default:
                return 'One-time';
        }
    };

    const onDateChange = (event: any, date?: Date) => {
        setShowDatePicker(false);
        if (date) {
            const newDate = new Date(selectedDate);
            newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
            setSelectedDate(newDate);
        }
    };

    const onTimeChange = (event: any, date?: Date) => {
        setShowTimePicker(false);
        if (date) {
            const newDate = new Date(selectedDate);
            newDate.setHours(date.getHours(), date.getMinutes());
            setSelectedDate(newDate);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header Overlay (optional styling piece) */}
            <View style={{ height: 10 }} />

            {/* Permission Alert (if needed) */}
            {!permissionGranted && (
                <View style={[styles.permissionAlert, { backgroundColor: `${colors.error}15`, borderColor: `${colors.error}30` }]}>
                    <Ionicons name="warning" size={20} color={colors.error} />
                    <Text style={[styles.permissionText, { color: colors.error }]}>
                        Njoftimet nuk janë të lejuara. Ju lutemi, aktivizoni ato në cilësimet e telefonit për të marrë rikujtuesit.
                    </Text>
                </View>
            )}

            {/* Float Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={openAddModal}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={[colors.brandGold, colors.goldDark]}
                    style={styles.fabGradient}
                >
                    <Ionicons name="add" size={28} color={colors.brandNavy} />
                </LinearGradient>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {reminders.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="notifications-off-outline" size={64} color={colors.textMuted} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t.noReminders}</Text>
                        <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>{t.tapPlusToAddReminder}</Text>
                    </View>
                ) : (
                    reminders.map((reminder) => (
                        <TouchableOpacity
                            key={reminder.id}
                            style={[styles.reminderCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                            onPress={() => openEditModal(reminder)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.reminderInfo}>
                                <View style={styles.reminderHeader}>
                                    <Ionicons
                                        name="notifications-circle"
                                        size={24}
                                        color={reminder.enabled ? colors.brandGold : colors.textMuted}
                                    />
                                    <Text
                                        style={[
                                            styles.reminderTitle,
                                            { color: colors.text },
                                            !reminder.enabled && { color: colors.textMuted, textDecorationLine: 'line-through' },
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {reminder.title}
                                    </Text>
                                </View>
                                <View style={styles.timeInfo}>
                                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>{formatTime(reminder.time)}</Text>
                                    {reminder.repeat !== 'none' && (
                                        <View style={[styles.repeatBadge, { backgroundColor: colors.inputBg }]}>
                                            <Ionicons name="repeat" size={12} color={colors.textMuted} />
                                            <Text style={[styles.repeatText, { color: colors.textMuted }]}>
                                                {reminder.repeat === 'daily' ? t.daily : reminder.repeat === 'weekly' ? t.weekly : t.none}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <Switch
                                value={reminder.enabled}
                                onValueChange={(val) => handleToggle(reminder, val)}
                                trackColor={{ false: colors.separator, true: `${colors.brandGold}50` }}
                                thumbColor={reminder.enabled ? colors.brandGold : colors.textMuted}
                            />
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* Add/Edit Modal */}
            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.separator }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {editingReminder ? t.editReminder : t.newReminder}
                            </Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Ionicons name="close" size={24} color={colors.textMuted} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalForm}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t.title}</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.cardBorder }]}
                                value={title}
                                onChangeText={setTitle}
                                placeholder={t.reminderTitlePlaceholder}
                                placeholderTextColor={colors.textMuted}
                            />

                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t.optionalNotes}</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.cardBorder }]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder={t.reminderDescriptionPlaceholder}
                                placeholderTextColor={colors.textMuted}
                                multiline
                            />

                            <View style={styles.formRow}>
                                <TouchableOpacity
                                    style={[styles.pickerBtn, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Ionicons name="calendar-outline" size={20} color={colors.brandGold} />
                                    <Text style={[styles.pickerBtnText, { color: colors.text }]}>{selectedDate.toLocaleDateString()}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.pickerBtn, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}
                                    onPress={() => setShowTimePicker(true)}
                                >
                                    <Ionicons name="time-outline" size={20} color={colors.brandGold} />
                                    <Text style={[styles.pickerBtnText, { color: colors.text }]}>
                                        {selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Repeat Options */}
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t.repeat}</Text>
                            <View style={styles.repeatOptions}>
                                {(['none', 'daily', 'weekly'] as RepeatOption[]).map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.repeatOption,
                                            { backgroundColor: colors.background, borderColor: colors.cardBorder },
                                            repeat === option && [styles.repeatOptionActive, { borderColor: colors.brandGold, backgroundColor: `${colors.brandGold}10` }]
                                        ]}
                                        onPress={() => setRepeat(option)}
                                    >
                                        <Text
                                            style={[
                                                styles.repeatOptionText,
                                                { color: colors.textSecondary },
                                                repeat === option && { color: colors.brandGold, fontWeight: 'bold' }
                                            ]}
                                        >
                                            {option === 'none' ? t.none : option === 'daily' ? t.daily : t.weekly}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {editingReminder && (
                                <TouchableOpacity
                                    style={[styles.deleteBtn, { backgroundColor: `${colors.error}10` }]}
                                    onPress={() => handleDelete(editingReminder.id)}
                                >
                                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                                    <Text style={[styles.deleteBtnText, { color: colors.error }]}>{t.delete}</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.cancelBtn, { borderColor: colors.cardBorder }]}
                                onPress={() => setShowModal(false)}
                            >
                                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>{t.cancel}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.saveBtn, { backgroundColor: colors.brandGold }]}
                                onPress={handleSave}
                            >
                                <Text style={[styles.saveBtnText, { color: colors.brandNavy }]}>{t.save}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Date Picker Modal */}
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    minimumDate={new Date()}
                    themeVariant="dark"
                />
            )}

            {/* Time Picker Modal */}
            {showTimePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onTimeChange}
                    themeVariant="dark"
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    permissionAlert: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 10,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    permissionText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 13,
        fontWeight: '500',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        zIndex: 100,
        ...SHADOWS.large,
    },
    fabGradient: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    reminderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        ...SHADOWS.medium,
    },
    reminderInfo: {
        flex: 1,
    },
    reminderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    reminderTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
        flex: 1,
    },
    timeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 14,
        fontWeight: '600',
    },
    repeatBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 12,
    },
    repeatText: {
        fontSize: 11,
        fontWeight: 'bold',
        marginLeft: 4,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 8,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        maxHeight: '90%',
        borderWidth: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    modalForm: {
        flexGrow: 0,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 8,
    },
    input: {
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    formRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 20,
    },
    pickerBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
    },
    pickerBtnText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    repeatOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 24,
    },
    repeatOption: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
    },
    repeatOptionActive: {
        borderWidth: 1.5,
    },
    repeatOptionText: {
        fontSize: 13,
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    deleteBtnText: {
        marginLeft: 8,
        fontSize: 15,
        fontWeight: 'bold',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 10,
    },
    cancelBtn: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
    },
    cancelBtnText: {
        fontSize: 16,
        fontWeight: '700',
    },
    saveBtn: {
        flex: 2,
        padding: 16,
        alignItems: 'center',
        borderRadius: 12,
        ...SHADOWS.medium,
    },
    saveBtnText: {
        fontSize: 16,
        fontWeight: '900',
    },
});
