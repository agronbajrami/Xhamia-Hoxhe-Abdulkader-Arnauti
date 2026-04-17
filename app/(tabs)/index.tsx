import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  CITIES,
  City,
  DEFAULT_CITY,
  getCityDisplayName,
} from "@/constants/Cities";
import { SHADOWS } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  fetchPrayerTimes,
  formatRemainingTime,
  formatTimeTo12Hour,
  getNextPrayer,
  PrayerName,
  PrayerTimesResponse,
} from "@/services/prayerApi";
import { getSelectedCity, setSelectedCity } from "@/services/storage";
import { syncPrayerWidget } from "@/services/widgetBridge";

const { width } = Dimensions.get("window");

const PRAYER_ICONS: Record<PrayerName, string> = {
  Fajr: "moon-outline",
  Sunrise: "partly-sunny-outline",
  Dhuhr: "sunny",
  Asr: "partly-sunny",
  Maghrib: "cloudy-night-outline",
  Isha: "moon",
};

const PRAYER_COLORS: Record<PrayerName, string> = {
  Fajr: "#4F7CAC",
  Sunrise: "#E8985E",
  Dhuhr: "#D4AF37",
  Asr: "#6BA3BE",
  Maghrib: "#C76B6B",
  Isha: "#7B68AE",
};

export default function PrayerTimesScreen() {
  const { t, getPrayerName, language } = useLanguage();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedCity, setSelectedCityState] = useState<City>(CITIES[0]);
  const [prayerData, setPrayerData] = useState<PrayerTimesResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [countdown, setCountdown] = useState<string>("");
  const [nextPrayer, setNextPrayer] = useState<{
    name: string;
    time: string;
  } | null>(null);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const openExternalUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(t.error, t.unableToOpenLink);
        return;
      }
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening external URL:", error);
      Alert.alert(t.error, t.unableToOpenLink);
    }
  };

  const prayers: PrayerName[] = [
    "Fajr",
    "Sunrise",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha",
  ];

  useEffect(() => {
    loadSavedCity();
    loadRecentVideos();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      loadPrayerTimes();
    }
  }, [selectedCity]);

  useEffect(() => {
    if (!prayerData) return;

    const updateCountdown = () => {
      const next = getNextPrayer(prayerData.timings);
      if (next) {
        setNextPrayer({ name: next.name, time: next.time });
        setCountdown(formatRemainingTime(next.remainingMs));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [prayerData]);

  // Auto-scroll the prayer list to center the active prayer
  useEffect(() => {
    if (nextPrayer && scrollViewRef.current) {
      const index = prayers.indexOf(nextPrayer.name as PrayerName);
      if (index !== -1) {
        // Approximate width of each item is 140px + 12px gap = 152px
        // We center it by subtracting half the screen width
        const itemWidth = 152;
        const offset = Math.max(
          0,
          index * itemWidth - width / 2 + itemWidth / 2 + 20,
        );

        // Slight delay to ensure layout is complete before scrolling
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ x: offset, animated: true });
        }, 500);
      }
    }
  }, [nextPrayer?.name]);

  const loadSavedCity = async () => {
    const city = await getSelectedCity();

    const supportedCity =
      CITIES.find((item) => item.id === city.id) ?? DEFAULT_CITY;

    setSelectedCityState(supportedCity);

    if (supportedCity.id !== city.id) {
      await setSelectedCity(supportedCity);
    }
  };

  const loadRecentVideos = async () => {
    try {
      const response = await fetch(
        "https://www.youtube.com/feeds/videos.xml?channel_id=UCGE2WP-EJNI2n8X05_lv_jg",
      );
      const text = await response.text();

      const entryOptions = text.match(/<entry>([\s\S]*?)<\/entry>/g);
      if (entryOptions) {
        const parsedVideos = entryOptions
          .slice(0, 4)
          .map((entry) => {
            const idMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
            const titleMatch = entry.match(/<title>(.*?)<\/title>/);
            const publishedMatch = entry.match(/<published>(.*?)<\/published>/);
            const thumbMatch = entry.match(/<media:thumbnail url="(.*?)"/);

            if (idMatch && titleMatch && publishedMatch) {
              const id = idMatch[1];
              const title = titleMatch[1];
              const date = new Date(publishedMatch[1]);
              const months = [
                t.january,
                t.february,
                t.march,
                t.april,
                t.may,
                t.june,
                t.july,
                t.august,
                t.september,
                t.october,
                t.november,
                t.december,
              ];
              const formattedDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;

              return {
                id,
                // basic unescape to fix &amp; to &
                title: title
                  .replace(/&amp;/g, "&")
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'"),
                date: formattedDate,
                thumbnail: thumbMatch
                  ? thumbMatch[1]
                  : `https://i3.ytimg.com/vi/${id}/hqdefault.jpg`,
                url: `https://www.youtube.com/watch?v=${id}`,
              };
            }
            return null;
          })
          .filter(Boolean);
        setRecentVideos(parsedVideos);
      }
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
    }
  };

  const loadPrayerTimes = async () => {
    try {
      setLoading(true);
      const data = await fetchPrayerTimes(
        selectedCity.latitude,
        selectedCity.longitude,
      );
      setPrayerData(data);
      // Sync data to home screen widgets
      syncPrayerWidget().catch(() => { });
    } catch (error) {
      console.error("Error loading prayer times:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadPrayerTimes(), loadRecentVideos()]);
    setRefreshing(false);
  };

  const handleCitySelect = async (city: City) => {
    setSelectedCityState(city);
    await setSelectedCity(city);
    setShowCityPicker(false);
  };

  // Parse countdown into parts to style seconds smaller
  const countdownParts = countdown.split(":");
  const hoursMins =
    countdownParts.length === 3
      ? `${countdownParts[0]}:${countdownParts[1]}`
      : "--:--";
  const seconds = countdownParts.length === 3 ? countdownParts[2] : "--";
  const hasHijriDate = Boolean(prayerData?.date.hijri.day);

  if (loading && !prayerData) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Image
          source={require("@/assets/images/icon-transparent.png")}
          style={styles.loadingLogo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color={colors.brandGold} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>
          {t.loading}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      bounces={false}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.brandGold}
        />
      }
    >
      {/* Hero Background Image */}
      <ImageBackground
        source={require("@/assets/images/masjid_al_aqsa.png")}
        style={[styles.heroBackground, { height: 350 + insets.top }]}
        resizeMode="cover"
      >
        <LinearGradient
          colors={
            isDark
              ? ["rgba(0,26,44,0.3)", "rgba(0,26,44,0.6)", colors.background]
              : [
                "rgba(255,255,255,0.4)",
                "rgba(255,255,255,0.85)",
                colors.background,
              ]
          }
          style={styles.heroGradient}
        >
          <View style={[styles.header, { marginTop: insets.top + 10 }]}>
            <View>
              <View style={styles.brandSubtitleRow}>
                <Image
                  source={require("@/assets/images/icon-transparent.png")}
                  style={styles.brandSubtitleLogo}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.brandSubtitleText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {t.arnautiMosque}
                </Text>
              </View>
              {prayerData && hasHijriDate && (
                <Text style={styles.hijriDate}>
                  {prayerData.date.hijri.day}{" "}
                  {language === "sq"
                    ? "Muharrem"
                    : prayerData.date.hijri.month.en}{" "}
                  {prayerData.date.hijri.year} AH
                </Text>
              )}
            </View>

            {/* City Selector Top Right */}
            <TouchableOpacity
              style={styles.citySelector}
              onPress={() => setShowCityPicker(!showCityPicker)}
            >
              <Ionicons name="location" size={14} color={colors.brandGold} />
              <Text style={styles.cityName}>
                {getCityDisplayName(selectedCity, language)}
              </Text>
              <Ionicons
                name={showCityPicker ? "chevron-up" : "chevron-down"}
                size={12}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>

          {/* City Dropdown Overlap */}
          {showCityPicker && (
            <View
              style={[
                styles.cityDropdown,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              {CITIES.map((city) => (
                <TouchableOpacity
                  key={city.id}
                  style={[
                    styles.cityOption,
                    { borderBottomColor: colors.separator },
                    selectedCity.id === city.id && styles.cityOptionActive,
                  ]}
                  onPress={() => handleCitySelect(city)}
                >
                  <Text
                    style={[
                      styles.cityOptionText,
                      { color: colors.textSecondary },
                      selectedCity.id === city.id &&
                      styles.cityOptionTextActive,
                      selectedCity.id === city.id && {
                        color: colors.brandGold,
                      },
                    ]}
                  >
                    {getCityDisplayName(city, language)}
                  </Text>
                  {selectedCity.id === city.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={colors.brandGold}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Spacer to push card down */}
          <View style={{ flex: 1 }} />

          {/* Beautiful Circular Logo/Time Container Overlapping */}
          <View style={styles.circularDialWrapper}>
            <View style={styles.dialRing}>
              {/* Logo embedded softly inside the dial */}
              <Image
                source={require("@/assets/images/icon-transparent.png")}
                style={styles.dialLogoInner}
                resizeMode="contain"
              />

              <Text style={[styles.dialCityText, { color: colors.textSecondary }]}>
                {getCityDisplayName(selectedCity, language)}
              </Text>

              <View style={styles.dialTimeRow}>
                <Text style={[styles.dialTimeMain, { color: colors.text }]}>{hoursMins}</Text>
                <Text style={[styles.dialTimeSec, { color: colors.textSecondary }]}>{seconds}</Text>
              </View>

              {nextPrayer && (
                <View style={styles.dialNextContainer}>
                  <Text style={[styles.dialNextLabel, { color: colors.textSecondary }]}>
                    {language === "sq" ? "deri në" : language === "tr" ? "kadar" : "до"}{" "}
                    <Text style={[styles.dialNextName, { color: colors.brandGold }]}>
                      {getPrayerName(nextPrayer.name).name}
                    </Text>
                  </Text>
                  {countdownParts.length === 3 && (
                    <Text style={[styles.dialMinutesLeft, { color: colors.textMuted }]}>
                      {language === "sq"
                        ? `${parseInt(countdownParts[0]) * 60 + parseInt(countdownParts[1])} min mbetur`
                        : language === "tr"
                        ? `${parseInt(countdownParts[0]) * 60 + parseInt(countdownParts[1])} dk kaldı`
                        : `${parseInt(countdownParts[0]) * 60 + parseInt(countdownParts[1])} мин остало`}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* Vertical Prayer Times Timeline */}

      <View style={styles.prayerTimelineContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        >
          {prayerData && prayers.map((prayer, index) => {
            const isNext = nextPrayer?.name === prayer;
            const time = prayerData.timings[prayer];
            const prayerInfo = getPrayerName(prayer);
            const color = PRAYER_COLORS[prayer];

            return (
              <View
                key={prayer}
                style={[
                  styles.prayerColumn,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                  isNext && [styles.prayerColumnActive, { borderColor: colors.brandGold }]
                ]}
              >
                <Ionicons
                  name={PRAYER_ICONS[prayer] as any}
                  size={28}
                  color={isNext ? colors.brandGold : color}
                  style={{ marginBottom: 12 }}
                />
                <Text
                  style={[
                    styles.prayerColTime,
                    { color: isNext ? colors.brandGold : colors.text },
                  ]}
                >
                  {formatTimeTo12Hour(time)}
                </Text>
                <Text
                  style={[
                    styles.prayerColName,
                    { color: isNext ? colors.text : colors.textSecondary },
                  ]}
                >
                  {prayerInfo.name}
                </Text>
                {isNext && (
                  <View
                    style={[
                      styles.activeDot,
                      { backgroundColor: colors.brandGold },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Na ndiqni në Telegram / YouTube Promotional Banner */}
      {/* <TouchableOpacity
        style={styles.promoBanner}
        onPress={() => void openExternalUrl("https://www.youtube.com/@ThirrjaIslame")
        }
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=800&auto=format&fit=crop",
          }}
          style={styles.promoBannerBg}
          imageStyle={{ borderRadius: 16 }}
        >
          <LinearGradient
            colors={
              isDark
                ? ["rgba(0,43,69,0.5)", "rgba(0,26,44,0.9)"]
                : ["rgba(255,255,255,0.7)", colors.card]
            }
            style={styles.promoBannerGradient}
          >
            <View style={styles.promoIconBadge}>
              <Ionicons name="logo-youtube" size={20} color="#FFFFFF" />
            </View>
            <Text style={[styles.promoTitle, { color: colors.text }]}>
              {t.followUsOn}
            </Text>
            <Text style={[styles.promoSubtitle, { color: colors.brandGold }]}>
              YouTube
            </Text>
            <Text style={[styles.promoHandle, { color: colors.textMuted }]}>
              @ThirrjaIslame
            </Text>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity> */}

      {/* Quick Action Cards */}
      <TouchableOpacity
        style={
          [
            styles.actionCard,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        onPress={() => router.push("/qibla" as any)}
        activeOpacity={0.8}
      >
        <View style={styles.actionIconWrapper}>
          <Ionicons name="compass-outline" size={24} color={colors.brandGold} />
        </View>
        <View style={styles.actionTextWrapper}>
          <Text style={[styles.actionTitle, { color: colors.text }]}>
            {t.qibla}
          </Text>
          <Text style={[styles.actionSubtitle, { color: colors.textMuted }]}>
            {t.qiblaShortcutSubtitle}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.brandGold} />
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        onPress={() => Linking.openURL('https://arnauti.org/donacione')}
        activeOpacity={0.8}
      >
        <View style={styles.actionIconWrapper}>
          <Ionicons name="heart-outline" size={24} color={colors.brandGold} />
        </View>
        <View style={styles.actionTextWrapper}>
          <Text style={[styles.actionTitle, { color: colors.text }]}>{t.donation}</Text>
          <Text style={[styles.actionSubtitle, { color: colors.textMuted }]}>{t.donationSubtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.brandGold} />
      </TouchableOpacity> */}

      {/* Videos Section */}
      <View style={styles.videosSection}>
        <View style={styles.videosSectionHeader}>
          <Text style={[styles.videosSectionTitle, { color: colors.text }]}>
            {t.videos}
          </Text>
          <TouchableOpacity
            onPress={() => void openExternalUrl("https://www.youtube.com/@ThirrjaIslame")}
          >
            <Text style={styles.seeAllText}>{t.seeAll}</Text>
          </TouchableOpacity>
        </View>

        {recentVideos.length === 0 && (
          <ActivityIndicator
            size="large"
            color={colors.brandGold}
            style={{ marginTop: 20 }}
          />
        )}

        {recentVideos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCardRow}
            onPress={() => void openExternalUrl(video.url)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: video.thumbnail }}
              style={styles.videoThumbnail}
            />
            <View style={styles.videoInfo}>
              <Text
                style={[styles.videoTitle, { color: colors.text }]}
                numberOfLines={2}
              >
                {video.title}
              </Text>
              <Text style={[styles.videoDate, { color: colors.textMuted }]}>
                {video.date}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  circularDialWrapper: {
    alignItems: 'center',
    marginVertical: 20,
    marginTop: -20, // pull up slightly into the gradient
  },
  dialRing: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dialLogoInner: {
    position: 'absolute',
    width: 240,
    height: 240,
    opacity: 0.2,
  },
  dialCityText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  dialTimeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dialTimeMain: {
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
    lineHeight: 70,
  },
  dialTimeSec: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
    marginLeft: 4,
    fontVariant: ['tabular-nums'],
  },
  dialNextContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  dialNextLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  dialNextName: {
    fontWeight: '800',
    fontSize: 16,
  },
  dialMinutesLeft: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 0.3,
  },

  prayerTimelineContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  prayerColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 140, // Makes them have same standard width for consistency
  },
  prayerColumnActive: {
    borderWidth: 1.5,
    backgroundColor: 'rgba(212,175,55,0.08)',
  },
  prayerColTime: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
    fontVariant: ['tabular-nums'],
  },
  prayerColName: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },

  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingLogo: {
    width: 80,
    height: 80,
    marginBottom: 24,
    opacity: 0.9,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "500",
  },

  // Hero Section
  heroBackground: {
    width: "100%",
  },
  heroGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  brandSubtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  brandSubtitleLogo: {
    width: 24,
    height: 24,
    marginRight: 6,
  },
  brandSubtitleText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  hijriDate: {
    fontSize: 14,
    color: "#D4AF37",
    fontWeight: "600",
    marginTop: 4,
  },
  citySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cityName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    marginHorizontal: 6,
  },

  // Custom City Dropdown Overlap
  cityDropdown: {
    position: "absolute",
    top: 100,
    right: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    width: 180,
    zIndex: 50,
    ...SHADOWS.large,
  },
  cityOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  cityOptionActive: {
    backgroundColor: "rgba(212,175,55,0.1)",
  },
  cityOptionText: {
    fontSize: 14,
  },
  cityOptionTextActive: {
    fontWeight: "700",
  },

  // Countdown Card
  countdownCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    ...SHADOWS.large,
  },
  countdownLeft: {
    flex: 1,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  countdownLarge: {
    fontSize: 48,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
    letterSpacing: -1,
  },
  countdownSmall: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 6,
    marginLeft: 4,
    fontVariant: ["tabular-nums"],
  },
  countdownLabel: {
    fontSize: 15,
    marginTop: 4,
  },
  countdownLabelBold: {
    fontWeight: "bold",
  },
  countdownRight: {
    paddingLeft: 20,
  },

  // Prayer Timings Horizontal
  prayersRowContainer: {
    marginTop: -10,
  },
  prayersScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 16,
  },
  prayerColumn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    minWidth: 110,
  },
  prayerColumnActive: {
    backgroundColor: "rgba(212,175,55,0.1)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.3)",
  },
  prayerColTime: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
    fontVariant: ["tabular-nums"],
  },
  prayerColName: {
    fontSize: 12,
    fontWeight: "500",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },

  // Promo Banner (YouTube)
  promoBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  promoBannerBg: {
    width: "100%",
    height: "100%",
  },
  promoBannerGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  promoIconBadge: {
    position: "absolute",
    top: 12,
    backgroundColor: "#EF4444",
    padding: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.small,
  },
  promoTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
  },
  promoSubtitle: {
    color: "#3B82F6",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  promoHandle: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 1,
  },

  // Action Card
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(212,175,55,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionTextWrapper: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  // Videos Section
  videosSection: {
    marginHorizontal: 20,
    marginTop: 32,
  },
  videosSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  videosSectionTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  seeAllText: {
    fontSize: 14,
    color: "#EF4444",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  videoCardRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  videoThumbnail: {
    width: 130,
    height: 75,
    borderRadius: 10,
    backgroundColor: "#1A1A1A",
  },
  videoInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 20,
  },
  videoDate: {
    fontSize: 11,
  },
});
