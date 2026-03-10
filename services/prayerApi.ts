import { CITIES, City } from '../constants/Cities';
import {
    LocalPrayerCsvRow as MkPrayerRow,
    SKOPJE_PRAYER_ROWS,
} from '../data/prayer-times/mk/skopje.generated';

export interface PrayerTimings {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Sunset: string;
    Isha: string;
    Imsak: string;
    Midnight: string;
}

export interface HijriDate {
    date: string;
    day: string;
    weekday: { en: string; ar: string };
    month: { number: number; en: string; ar: string };
    year: string;
    designation: { abbreviated: string; expanded: string };
}

export interface GregorianDate {
    date: string;
    day: string;
    weekday: { en: string };
    month: { number: number; en: string };
    year: string;
}

export interface PrayerTimesResponse {
    timings: PrayerTimings;
    date: {
        hijri: HijriDate;
        gregorian: GregorianDate;
    };
    meta: {
        latitude: number;
        longitude: number;
        timezone: string;
        method: {
            id: number;
            name: string;
        };
    };
    source?: 'csv';
}
const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'long' });
const LOCAL_DATA_METHOD = {
    id: 0,
    name: 'Muslimani Ideal bundled CSV',
};
const CITY_COORDINATE_TOLERANCE = 0.2;
type AnyPrayerRow = MkPrayerRow;

const localPrayerDataByCityId: Record<string, AnyPrayerRow[]> = {
    skopje: SKOPJE_PRAYER_ROWS,
    tetovo: SKOPJE_PRAYER_ROWS,
    kumanovo: SKOPJE_PRAYER_ROWS,
    ohrid: SKOPJE_PRAYER_ROWS,
    struga: SKOPJE_PRAYER_ROWS,
    gostivar: SKOPJE_PRAYER_ROWS,
};

const localPrayerLookupByCityId = Object.fromEntries(
    Object.entries(localPrayerDataByCityId).map(([cityId, rows]) => [
        cityId,
        rows.reduce<Record<string, AnyPrayerRow>>((lookup, row) => {
            lookup[row.date] = row;
            return lookup;
        }, {}),
    ])
) as Record<string, Record<string, AnyPrayerRow>>;

const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const resolveBundledCity = (latitude: number, longitude: number): City | null =>
    CITIES.find(
        (city) =>
            Math.abs(latitude - city.latitude) <= CITY_COORDINATE_TOLERANCE &&
            Math.abs(longitude - city.longitude) <= CITY_COORDINATE_TOLERANCE
    ) ?? null;

const buildLocalPrayerResponse = (row: AnyPrayerRow, city: City): PrayerTimesResponse => {
    const localDate = new Date(`${row.date}T12:00:00`);
    const weekday = DATE_FORMATTER.format(localDate);
    const monthName = MONTH_FORMATTER.format(localDate);

    return {
        timings: {
            Fajr: row.fajr,
            Sunrise: row.sunrise,
            Dhuhr: row.dhuhr,
            Asr: row.asr,
            Maghrib: row.maghrib,
            Sunset: row.maghrib,
            Isha: row.isha,
            Imsak: row.imsak,
            Midnight: '--:--',
        },
        date: {
            hijri: {
                date: '',
                day: '',
                weekday: { en: '', ar: '' },
                month: { number: 0, en: '', ar: '' },
                year: '',
                designation: { abbreviated: 'AH', expanded: 'Anno Hegirae' },
            },
            gregorian: {
                date: `${row.date.slice(8, 10)}-${row.date.slice(5, 7)}-${row.date.slice(0, 4)}`,
                day: row.date.slice(8, 10),
                weekday: { en: weekday },
                month: { number: Number(row.date.slice(5, 7)), en: monthName },
                year: row.date.slice(0, 4),
            },
        },
        meta: {
            latitude: city.latitude,
            longitude: city.longitude,
            timezone: city.timezone,
            method: LOCAL_DATA_METHOD,
        },
        source: 'csv',
    };
};

const getBundledPrayerTimes = (
    latitude: number,
    longitude: number,
    date: Date
): PrayerTimesResponse | null => {
    const city = resolveBundledCity(latitude, longitude);

    if (!city) {
        return null;
    }

    const row = localPrayerLookupByCityId[city.id]?.[formatDateKey(date)];
    return row ? buildLocalPrayerResponse(row, city) : null;
};

const getBundledMonthlyPrayerTimes = (
    latitude: number,
    longitude: number,
    month: number,
    year: number
): PrayerTimesResponse[] | null => {
    const city = resolveBundledCity(latitude, longitude);

    if (!city) {
        return null;
    }

    const monthKey = `${year}-${`${month}`.padStart(2, '0')}-`;
    const rows = (localPrayerDataByCityId[city.id] ?? []).filter((row) => row.date.startsWith(monthKey));

    if (rows.length === 0) {
        return null;
    }

    return rows.map((row) => buildLocalPrayerResponse(row, city));
};

/**
 * Fetch prayer times for a specific date and location
 */
export async function fetchPrayerTimes(
    latitude: number,
    longitude: number,
    date?: Date
): Promise<PrayerTimesResponse> {
    const targetDate = date || new Date();
    const bundledData = getBundledPrayerTimes(latitude, longitude, targetDate);

    if (bundledData) {
        return bundledData;
    }

    throw new Error('Prayer times are only available for the bundled Muslimani Ideal cities.');
}

/**
 * Fetch prayer times for a full month
 */
export async function fetchMonthlyPrayerTimes(
    latitude: number,
    longitude: number,
    month: number,
    year: number
): Promise<PrayerTimesResponse[]> {
    const bundledData = getBundledMonthlyPrayerTimes(latitude, longitude, month, year);

    if (bundledData) {
        return bundledData;
    }

    throw new Error('Monthly prayer times are only available for the bundled Muslimani Ideal cities.');
}

/**
 * Convert time string (HH:MM) to Date object for today
 */
export function parseTimeToDate(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

/**
 * Get the next prayer based on current time
 */
export function getNextPrayer(timings: PrayerTimings): {
    name: PrayerName;
    time: string;
    remainingMs: number;
} | null {
    const now = new Date();

    const prayerOrder: PrayerName[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    for (const prayer of prayerOrder) {
        const prayerTime = parseTimeToDate(timings[prayer]);

        if (prayerTime > now) {
            return {
                name: prayer,
                time: timings[prayer],
                remainingMs: prayerTime.getTime() - now.getTime(),
            };
        }
    }

    // If all prayers have passed, next is Fajr tomorrow
    const tomorrowFajr = parseTimeToDate(timings.Fajr);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);

    return {
        name: 'Fajr',
        time: timings.Fajr,
        remainingMs: tomorrowFajr.getTime() - now.getTime(),
    };
}

/**
 * Format remaining time as HH:MM:SS
 */
export function formatRemainingTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format time to 24-hour format
 */
export function formatTimeTo12Hour(timeString: string): string {
    const [hours, minutes] = timeString.split(':').map(Number);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export default {
    fetchPrayerTimes,
    fetchMonthlyPrayerTimes,
    parseTimeToDate,
    getNextPrayer,
    formatRemainingTime,
    formatTimeTo12Hour,
};
