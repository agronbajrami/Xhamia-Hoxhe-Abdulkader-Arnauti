import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { fetchPrayerTimes, parseTimeToDate, PrayerName } from './prayerApi';
import { Reminder, getSettings, getSelectedCity } from './storage';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Request notification permissions
 */
export async function requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
    }

    // Android specific channel
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('reminders', {
            name: 'Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#006233',
        });

        await Notifications.setNotificationChannelAsync('prayer', {
            name: 'Prayer Times',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#006233',
        });
    }

    return true;
}

/**
 * Schedule a notification for a reminder
 */
export async function scheduleReminderNotification(reminder: Reminder): Promise<string | null> {
    if (!reminder.enabled) {
        return null;
    }

    const triggerDate = new Date(reminder.time);

    // Don't schedule if time has passed (for non-repeating)
    if (reminder.repeat === 'none' && triggerDate <= new Date()) {
        return null;
    }

    let trigger: Notifications.NotificationTriggerInput;

    if (reminder.repeat === 'daily') {
        trigger = {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: triggerDate.getHours(),
            minute: triggerDate.getMinutes(),
        };
    } else if (reminder.repeat === 'weekly') {
        trigger = {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: triggerDate.getDay() + 1, // 1-7 for Expo
            hour: triggerDate.getHours(),
            minute: triggerDate.getMinutes(),
        };
    } else {
        trigger = {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
        };
    }

    try {
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'TAKVIM Reminder',
                body: reminder.title,
                data: { reminderId: reminder.id },
                sound: true,
            },
            trigger,
        });

        return notificationId;
    } catch (error) {
        console.error('Error scheduling notification:', error);
        return null;
    }
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
        console.error('Error canceling notification:', error);
    }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
        console.error('Error canceling all notifications:', error);
    }
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
        return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
        console.error('Error getting scheduled notifications:', error);
        return [];
    }
}

/**
 * Schedule prayer time notification
 */
export async function schedulePrayerNotification(
    prayerName: string,
    time: Date,
    cityName: string
): Promise<string | null> {
    try {
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: `${prayerName} Time`,
                body: `It's time for ${prayerName} prayer in ${cityName}`,
                data: { type: 'prayer', prayer: prayerName },
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: time,
            },
        });

        return notificationId;
    } catch (error) {
        console.error('Error scheduling prayer notification:', error);
        return null;
    }
}

export async function reschedulePrayerNotifications(): Promise<void> {
    const allNotifications = await getScheduledNotifications();
    for (const notif of allNotifications) {
        if (notif.content.data?.type === 'prayer') {
            await Notifications.cancelScheduledNotificationAsync(notif.identifier);
        }
    }

    const settings = await getSettings();
    if (!settings.notificationsEnabled) return;

    const city = await getSelectedCity();
    const now = new Date();
    const prayerNames: PrayerName[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const targetDate = new Date();
        targetDate.setDate(now.getDate() + dayOffset);

        try {
            const prayerTimes = await fetchPrayerTimes(city.latitude, city.longitude, targetDate);

            for (const prayer of prayerNames) {
                if (settings.prayerNotifications[prayer]) {
                    const timeString = prayerTimes.timings[prayer];
                    const prayerTime = parseTimeToDate(timeString);
                    prayerTime.setFullYear(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

                    if (prayerTime > now) {
                        await schedulePrayerNotification(prayer, prayerTime, city.name);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching prayer times for scheduling:', error);
        }
    }
}

export default {
    requestPermissions,
    scheduleReminderNotification,
    cancelNotification,
    cancelAllNotifications,
    getScheduledNotifications,
    schedulePrayerNotification,
    reschedulePrayerNotifications,
};
