// Multi-language support - Albanian, Macedonian, Turkish
export type Language = 'sq' | 'mk' | 'tr';

export interface Translations {
    // App
    appName: string;

    // Navigation
    home: string;
    adhkar: string;
    videos: string;
    reminders: string;
    quran: string;
    qibla: string;
    menu: string;
    donation: string;

    // Prayer Times Screen
    freePalestine: string;
    alQudsLana: string;
    nextPrayer: string;
    todaysPrayerTimes: string;
    loading: string;

    // Prayer Names
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;

    // Adhkar
    morningAdhkar: string;
    eveningAdhkar: string;
    morning: string;
    evening: string;
    selectCategory: string;
    items: string;
    progress: string;
    resetAll: string;
    completed: string;
    tapToCount: string;
    longPressTranslation: string;
    adhkarDescription: string;

    // Qibla
    qiblaDirection: string;
    qiblaDistance: string;
    toMecca: string;
    degrees: string;
    km: string;
    calibrate: string;
    pointToQibla: string;
    locationRequired: string;
    compassNotAvailable: string;
    aligned: string;
    qiblaCalibrationTitle: string;
    qiblaCalibrationMessage: string;
    qiblaCalibrationButton: string;

    // Videos
    islamicContent: string;
    watchVideos: string;
    configureChannels: string;
    featuredChannels: string;
    allChannels: string;
    openChannel: string;
    howToAdd: string;

    // Reminders
    yourReminders: string;
    noReminders: string;
    tapPlusToAddReminder: string;
    addReminder: string;
    editReminder: string;
    newReminder: string;
    error: string;
    enterReminderTitle: string;
    failedToSaveReminder: string;
    confirmDeleteReminder: string;
    unableToOpenLink: string;
    title: string;
    description: string;
    optionalNotes: string;
    reminderTitlePlaceholder: string;
    reminderDescriptionPlaceholder: string;
    dateTime: string;
    repeat: string;
    none: string;
    once: string;
    daily: string;
    weekly: string;
    save: string;
    cancel: string;
    delete: string;
    back: string;
    enabled: string;
    disabled: string;
    notificationsNotEnabled: string;

    // Settings / Theme
    language: string;
    settings: string;
    selectLanguage: string;
    appSection: string;
    versionLabel: string;
    theme: string;
    darkTheme: string;
    lightTheme: string;

    // Common
    today: string;
    tomorrow: string;
    at: string;
    next: string;
    followUsOn: string;
    readQuran: string;
    readQuranSubtitle: string;
    qiblaShortcutSubtitle: string;
    donationSubtitle: string;
    seeAll: string;
    arnautiMosque: string;
    january: string;
    february: string;
    march: string;
    april: string;
    may: string;
    june: string;
    july: string;
    august: string;
    september: string;
    october: string;
    november: string;
    december: string;
}

export const translations: Record<Language, Translations> = {
    sq: {
        // App
        appName: 'Hoxhë AbdulKadër Arnauti',

        // Navigation
        home: 'Ballina',
        adhkar: 'Dhikri',
        videos: 'Video',
        reminders: 'Përkujtuesit',
        quran: 'Kurani',
        qibla: 'Kibla',
        menu: 'Menyja',
        donation: 'Donacion',

        // Prayer Times Screen
        freePalestine: '🇵🇸 Liri për Palestinën',
        alQudsLana: 'القدس لنا',
        nextPrayer: 'Namazi i Ardhshëm',
        todaysPrayerTimes: 'Kohët e Namazit Sot',
        loading: 'Duke ngarkuar...',

        // Prayer Names
        fajr: 'Sabahu',
        sunrise: 'Lindja e Diellit',
        dhuhr: 'Dreka',
        asr: 'Ikindia',
        maghrib: 'Akshami',
        isha: 'Jacia',

        // Adhkar
        morningAdhkar: 'Dhikri i Mëngjesit',
        eveningAdhkar: 'Dhikri i Mbrëmjes',
        morning: 'Mëngjesi',
        evening: 'Mbrëmja',
        selectCategory: 'Zgjidhni kategorinë',
        items: 'artikuj',
        progress: 'Progresi',
        resetAll: 'Rivendos',
        completed: 'Të gjitha dhikret u kompletuan! Allahu i pranoftë.',
        tapToCount: 'Prek për të numëruar',
        longPressTranslation: 'Mbaj shtypur për përkthim',
        adhkarDescription: 'Lutje dhe dhikër',

        // Qibla
        qiblaDirection: 'Drejtimi i Kibles',
        qiblaDistance: 'Distanca deri te Qabja',
        toMecca: 'deri në Mekë',
        degrees: 'gradë',
        km: 'km',
        calibrate: 'Kalibroni busullën duke rrotulluar telefonin në formë të 8-tës',
        pointToQibla: 'Drejtoni telefonin drejt shigjetës',
        locationRequired: 'Kërkohet leja e vendndodhjes',
        compassNotAvailable: 'Busulla nuk është e disponueshme në këtë pajisje',
        aligned: 'Drejtuar',
        qiblaCalibrationTitle: 'Para se të filloni',
        qiblaCalibrationMessage: 'Lëvizeni telefonin në formë të 8-tës për të kalibruar busullën. Pastaj rrotullohuni ngadalë derisa pjesa e artë të tregojë drejt Kibles.',
        qiblaCalibrationButton: 'Vazhdo',

        // Videos
        islamicContent: 'Përmbajtje Islame',
        watchVideos: 'Shikoni video të dobishme',
        configureChannels: 'Konfiguro Kanalet',
        featuredChannels: 'Kanalet e Veçuara',
        allChannels: 'Të Gjitha Kanalet',
        openChannel: 'Hap Kanalin',
        howToAdd: 'Si të Shtoni Kanale',

        // Reminders
        yourReminders: 'Përkujtuesit Tuaj',
        noReminders: 'Nuk Ka Përkujtues',
        tapPlusToAddReminder: 'Shtoni një përkujtues të ri duke shtypur butonin +.',
        addReminder: 'Shto Përkujtues',
        editReminder: 'Ndrysho Përkujtuesin',
        newReminder: 'Përkujtues i Ri',
        error: 'Gabim',
        enterReminderTitle: 'Ju lutem shkruani titullin e përkujtuesit',
        failedToSaveReminder: 'Ruajtja e përkujtuesit dështoi',
        confirmDeleteReminder: 'A jeni i sigurt që dëshironi të fshini këtë rikujtues?',
        unableToOpenLink: 'Nuk mund të hapet lidhja në këtë pajisje.',
        title: 'Titulli',
        description: 'Përshkrimi',
        optionalNotes: 'Shënime (opsionale)',
        reminderTitlePlaceholder: 'P.sh. Leximi i Kuranit',
        reminderDescriptionPlaceholder: 'Shto një shënim të shkurtër...',
        dateTime: 'Data & Ora',
        repeat: 'Përsërit',
        none: 'Pa',
        once: 'Një herë',
        daily: 'Çdo Ditë',
        weekly: 'Çdo Javë',
        save: 'Ruaj',
        cancel: 'Anulo',
        delete: 'Fshij',
        back: 'Kthehu',
        enabled: 'Aktivizuar',
        disabled: 'Çaktivizuar',
        notificationsNotEnabled: 'Njoftimet nuk janë aktivizuar. Prek për të aktivizuar.',

        // Settings / Theme
        language: 'Gjuha',
        settings: 'Cilësimet',
        selectLanguage: 'Zgjidhni Gjuhën',
        appSection: 'Aplikacioni',
        versionLabel: 'Versioni',
        theme: 'Tema',
        darkTheme: 'E Errët',
        lightTheme: 'E Ndritshme',

        // Common
        today: 'Sot',
        tomorrow: 'Nesër',
        at: 'në',
        next: 'TJETËR',
        followUsOn: 'Na ndiqni në',
        readQuran: "Lexo Kur'an",
        readQuranSubtitle: 'Lexo Kuranin e Shenjtë',
        qiblaShortcutSubtitle: 'Gjej drejtimin e Kibles',
        donationSubtitle: 'Mbështetni xhaminë me një donacion',
        seeAll: 'Të gjitha',
        arnautiMosque: 'Xhamia Abdulkadër Arnauti',
        january: 'Janar',
        february: 'Shkurt',
        march: 'Mars',
        april: 'Prill',
        may: 'Maj',
        june: 'Qershor',
        july: 'Korrik',
        august: 'Gusht',
        september: 'Shtator',
        october: 'Tetor',
        november: 'Nëntor',
        december: 'Dhjetor',
    },

    mk: {
        // App
        appName: 'Хоџа АбдулКадер Арнаути',

        // Navigation
        home: 'Почетна',
        adhkar: 'Зикр',
        videos: 'Видео',
        reminders: 'Потсетници',
        quran: 'Куран',
        qibla: 'Кибла',
        menu: 'Мени',
        donation: 'Донација',

        // Prayer Times Screen
        freePalestine: '🇵🇸 Слобода за Палестина',
        alQudsLana: 'القدس لنا',
        nextPrayer: 'Следна молитва',
        todaysPrayerTimes: 'Молитвени времиња денес',
        loading: 'Вчитување...',

        // Prayer Names
        fajr: 'Зора',
        sunrise: 'Изгрев',
        dhuhr: 'Пладне',
        asr: 'Икиндија',
        maghrib: 'Акшам',
        isha: 'Јација',

        // Adhkar
        morningAdhkar: 'Утрински зикр',
        eveningAdhkar: 'Вечерен зикр',
        morning: 'Утро',
        evening: 'Вечер',
        selectCategory: 'Изберете категорија',
        items: 'ставки',
        progress: 'Напредок',
        resetAll: 'Ресетирај',
        completed: 'Сите зикрови завршени! Нека прифати Аллах.',
        tapToCount: 'Допри за броење',
        longPressTranslation: 'Задржи за превод',
        adhkarDescription: 'Молитви и зикр',

        // Qibla
        qiblaDirection: 'Правец на Кибла',
        qiblaDistance: 'Оддалеченост до Каба',
        toMecca: 'до Мека',
        degrees: 'степени',
        km: 'км',
        calibrate: 'Калибрирајте го компасот вртејќи го телефонот во форма на 8',
        pointToQibla: 'Насочете го телефонот кон стрелката',
        locationRequired: 'Потребна е дозвола за локација',
        compassNotAvailable: 'Компасот не е достапен на овој уред',
        aligned: 'Наместен',
        qiblaCalibrationTitle: 'Пред да започнете',
        qiblaCalibrationMessage: 'Движете го телефонот во форма на 8 за да го калибрирате компасот. Потоа вртете се полека додека златниот дел не ја покаже Киблата.',
        qiblaCalibrationButton: 'Продолжи',

        // Videos
        islamicContent: 'Исламска содржина',
        watchVideos: 'Гледајте корисни видеа',
        configureChannels: 'Конфигурирај канали',
        featuredChannels: 'Истакнати канали',
        allChannels: 'Сите канали',
        openChannel: 'Отвори канал',
        howToAdd: 'Како да додадете канали',

        // Reminders
        yourReminders: 'Вашите потсетници',
        noReminders: 'Нема потсетници',
        tapPlusToAddReminder: 'Додадете нов потсетник со притискање на копчето +.',
        addReminder: 'Додај потсетник',
        editReminder: 'Уреди потсетник',
        newReminder: 'Нов потсетник',
        error: 'Грешка',
        enterReminderTitle: 'Ве молиме внесете наслов за потсетникот',
        failedToSaveReminder: 'Зачувувањето на потсетникот не успеа',
        confirmDeleteReminder: 'Дали сте сигурни дека сакате да го избришете овој потсетник?',
        unableToOpenLink: 'Не може да се отвори линкот на овој уред.',
        title: 'Наслов',
        description: 'Опис',
        optionalNotes: 'Белешки (опционално)',
        reminderTitlePlaceholder: 'На пр. Читање Куран',
        reminderDescriptionPlaceholder: 'Додадете кратка белешка...',
        dateTime: 'Датум & Час',
        repeat: 'Повтори',
        none: 'Без',
        once: 'Еднаш',
        daily: 'Секој ден',
        weekly: 'Секоја недела',
        save: 'Зачувај',
        cancel: 'Откажи',
        delete: 'Избриши',
        back: 'Назад',
        enabled: 'Овозможено',
        disabled: 'Оневозможено',
        notificationsNotEnabled: 'Известувањата не се овозможени. Допри за да овозможиш.',

        // Settings / Theme
        language: 'Јазик',
        settings: 'Поставки',
        selectLanguage: 'Избери јазик',
        appSection: 'Апликација',
        versionLabel: 'Верзија',
        theme: 'Тема',
        darkTheme: 'Темна',
        lightTheme: 'Светла',

        // Common
        today: 'Денес',
        tomorrow: 'Утре',
        at: 'во',
        next: 'СЛЕДНО',
        followUsOn: 'Следете нè на',
        readQuran: 'Прочитај Куран',
        readQuranSubtitle: 'Прочитајте го Светиот Куран',
        qiblaShortcutSubtitle: 'Пронајди го правецот на Кибла',
        donationSubtitle: 'Поддржете ја џамијата со донација',
        seeAll: 'Види ги сите',
        arnautiMosque: 'Џамија Абдулкадер Арнаути',
        january: 'Јануари',
        february: 'Февруари',
        march: 'Март',
        april: 'Април',
        may: 'Мај',
        june: 'Јуни',
        july: 'Јули',
        august: 'Август',
        september: 'Септември',
        october: 'Октомври',
        november: 'Ноември',
        december: 'Декември',
    },

    tr: {
        // App
        appName: 'Hoca AbdülKadir Arnauti',

        // Navigation
        home: 'Ana Sayfa',
        adhkar: 'Zikir',
        videos: 'Video',
        reminders: 'Hatırlatıcılar',
        quran: 'Kuran',
        qibla: 'Kıble',
        menu: 'Menü',
        donation: 'Bağış',

        // Prayer Times Screen
        freePalestine: '🇵🇸 Özgür Filistin',
        alQudsLana: 'القدس لنا',
        nextPrayer: 'Sonraki Namaz',
        todaysPrayerTimes: 'Bugünün Namaz Vakitleri',
        loading: 'Yükleniyor...',

        // Prayer Names
        fajr: 'Sabah',
        sunrise: 'Güneş Doğuşu',
        dhuhr: 'Öğle',
        asr: 'İkindi',
        maghrib: 'Akşam',
        isha: 'Yatsı',

        // Adhkar
        morningAdhkar: 'Sabah Zikri',
        eveningAdhkar: 'Akşam Zikri',
        morning: 'Sabah',
        evening: 'Akşam',
        selectCategory: 'Kategori seçin',
        items: 'öğe',
        progress: 'İlerleme',
        resetAll: 'Sıfırla',
        completed: 'Tüm zikirler tamamlandı! Allah kabul etsin.',
        tapToCount: 'Saymak için dokun',
        longPressTranslation: 'Çeviri için basılı tut',
        adhkarDescription: 'Dualar ve zikir',

        // Qibla
        qiblaDirection: 'Kıble Yönü',
        qiblaDistance: 'Kabe\'ye Mesafe',
        toMecca: 'Mekke\'ye',
        degrees: 'derece',
        km: 'km',
        calibrate: 'Telefonu 8 şeklinde döndürerek pusulayı kalibre edin',
        pointToQibla: 'Telefonu oka doğru yönlendirin',
        locationRequired: 'Konum izni gerekli',
        compassNotAvailable: 'Pusula bu cihazda mevcut değil',
        aligned: 'Hizalandı',
        qiblaCalibrationTitle: 'Baslamadan once',
        qiblaCalibrationMessage: 'Pusulayi kalibre etmek icin telefonu 8 seklinde hareket ettirin. Sonra altin renkli kisim Kibleyi gosterene kadar yavasca donun.',
        qiblaCalibrationButton: 'Devam et',

        // Videos
        islamicContent: 'İslami İçerik',
        watchVideos: 'Faydalı videolar izleyin',
        configureChannels: 'Kanalları Yapılandır',
        featuredChannels: 'Öne Çıkan Kanallar',
        allChannels: 'Tüm Kanallar',
        openChannel: 'Kanalı Aç',
        howToAdd: 'Nasıl Kanal Eklenir',

        // Reminders
        yourReminders: 'Hatırlatıcılarınız',
        noReminders: 'Hatırlatıcı Yok',
        tapPlusToAddReminder: 'Yeni bir hatırlatıcı eklemek için + düğmesine dokunun.',
        addReminder: 'Hatırlatıcı Ekle',
        editReminder: 'Hatırlatıcıyı Düzenle',
        newReminder: 'Yeni Hatırlatıcı',
        error: 'Hata',
        enterReminderTitle: 'Lütfen bir hatırlatıcı başlığı girin',
        failedToSaveReminder: 'Hatırlatıcı kaydedilemedi',
        confirmDeleteReminder: 'Bu hatırlatıcıyı silmek istediğinizden emin misiniz?',
        unableToOpenLink: 'Bu cihazda baglanti acilamiyor.',
        title: 'Başlık',
        description: 'Açıklama',
        optionalNotes: 'Notlar (isteğe bağlı)',
        reminderTitlePlaceholder: 'Örn. Kuran okuma',
        reminderDescriptionPlaceholder: 'Kısa bir not ekleyin...',
        dateTime: 'Tarih & Saat',
        repeat: 'Tekrar',
        none: 'Yok',
        once: 'Bir kez',
        daily: 'Her Gün',
        weekly: 'Her Hafta',
        save: 'Kaydet',
        cancel: 'İptal',
        delete: 'Sil',
        back: 'Geri',
        enabled: 'Etkin',
        disabled: 'Devre Dışı',
        notificationsNotEnabled: 'Bildirimler etkin değil. Etkinleştirmek için dokun.',

        // Settings / Theme
        language: 'Dil',
        settings: 'Ayarlar',
        selectLanguage: 'Dil Seç',
        appSection: 'Uygulama',
        versionLabel: 'Sürüm',
        theme: 'Tema',
        darkTheme: 'Koyu',
        lightTheme: 'Açık',

        // Common
        today: 'Bugün',
        tomorrow: 'Yarın',
        at: 'saat',
        next: 'SONRAKİ',
        followUsOn: "Bizi takip edin",
        readQuran: "Kuran Oku",
        readQuranSubtitle: "Kuran-ı Kerim'i Oku",
        qiblaShortcutSubtitle: 'Kıble yönünü bulun',
        donationSubtitle: 'Camiye bağışla destek olun',
        seeAll: 'Hepsini Gör',
        arnautiMosque: 'Abdülkadir Arnauti Camii',
        january: 'Ocak',
        february: 'Şubat',
        march: 'Mart',
        april: 'Nisan',
        may: 'Mayıs',
        june: 'Haziran',
        july: 'Temmuz',
        august: 'Ağustos',
        september: 'Eylül',
        october: 'Ekim',
        november: 'Kasım',
        december: 'Aralık',
    },
};

// Prayer names in all supported languages + Arabic
export const PRAYER_NAMES_I18N = {
    Fajr: { sq: 'Sabahu', mk: 'Зора', tr: 'Sabah', ar: 'الفجر' },
    Sunrise: { sq: 'Lindja e Diellit', mk: 'Изгрев', tr: 'Güneş Doğuşu', ar: 'الشروق' },
    Dhuhr: { sq: 'Dreka', mk: 'Пладне', tr: 'Öğle', ar: 'الظهر' },
    Asr: { sq: 'Ikindia', mk: 'Икиндија', tr: 'İkindi', ar: 'العصر' },
    Maghrib: { sq: 'Akshami', mk: 'Акшам', tr: 'Akşam', ar: 'المغرب' },
    Isha: { sq: 'Jacia', mk: 'Јација', tr: 'Yatsı', ar: 'العشاء' },
};

export default translations;
