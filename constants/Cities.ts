import type { Language } from './translations';

// City configurations for bundled prayer times
export interface City {
    id: string;
    name: string;
    localizedNames: Record<Language, string>;
    country: string;
    countryCode: string;
    latitude: number;
    longitude: number;
    timezone: string;
}

export const CITIES: City[] = [
    {
        id: 'skopje',
        name: 'Skopje',
        localizedNames: {
            sq: 'Shkup',
            mk: 'Скопје',
            tr: 'Uskup',
        },
        country: 'North Macedonia',
        countryCode: 'MK',
        latitude: 41.9981,
        longitude: 21.4254,
        timezone: 'Europe/Skopje',
    },
    {
        id: 'tetovo',
        name: 'Tetovo',
        localizedNames: {
            sq: 'Tetove',
            mk: 'Тетово',
            tr: 'Kalkandelen',
        },
        country: 'North Macedonia',
        countryCode: 'MK',
        latitude: 42.0097,
        longitude: 20.9716,
        timezone: 'Europe/Skopje',
    },
    {
        id: 'kumanovo',
        name: 'Kumanovo',
        localizedNames: {
            sq: 'Kumanove',
            mk: 'Куманово',
            tr: 'Kumanova',
        },
        country: 'North Macedonia',
        countryCode: 'MK',
        latitude: 42.1322,
        longitude: 21.7144,
        timezone: 'Europe/Skopje',
    },
    {
        id: 'ohrid',
        name: 'Ohrid',
        localizedNames: {
            sq: 'Oher',
            mk: 'Охрид',
            tr: 'Ohri',
        },
        country: 'North Macedonia',
        countryCode: 'MK',
        latitude: 41.1172,
        longitude: 20.8016,
        timezone: 'Europe/Skopje',
    },
    {
        id: 'struga',
        name: 'Struga',
        localizedNames: {
            sq: 'Struge',
            mk: 'Струга',
            tr: 'Struga',
        },
        country: 'North Macedonia',
        countryCode: 'MK',
        latitude: 41.1770,
        longitude: 20.6776,
        timezone: 'Europe/Skopje',
    },
    {
        id: 'gostivar',
        name: 'Gostivar',
        localizedNames: {
            sq: 'Gostivar',
            mk: 'Гостивар',
            tr: 'Gostivar',
        },
        country: 'North Macedonia',
        countryCode: 'MK',
        latitude: 41.7960,
        longitude: 20.9082,
        timezone: 'Europe/Skopje',
    },
];

export const DEFAULT_CITY = CITIES[0]; // Skopje as default

export function getCityDisplayName(city: City, language: Language): string {
    return city.localizedNames[language] ?? city.name;
}

// Prayer names with Arabic
export const PRAYER_NAMES = {
    Fajr: { english: 'Fajr', arabic: 'الفجر', transliteration: 'Fajr' },
    Sunrise: { english: 'Sunrise', arabic: 'الشروق', transliteration: 'Shurūq' },
    Dhuhr: { english: 'Dhuhr', arabic: 'الظهر', transliteration: 'Ẓuhr' },
    Asr: { english: 'Asr', arabic: 'العصر', transliteration: 'ʿAṣr' },
    Maghrib: { english: 'Maghrib', arabic: 'المغرب', transliteration: 'Maghrib' },
    Isha: { english: 'Isha', arabic: 'العشاء', transliteration: 'ʿIshāʾ' },
};

export default { CITIES, DEFAULT_CITY, PRAYER_NAMES, getCityDisplayName };
