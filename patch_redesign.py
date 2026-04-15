import re

with open("app/(tabs)/index.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# We need to replace everything from `if (loading && !prayerData) {` to the end of the file.

new_render = """
  // Parse countdown into parts to style seconds smaller
  const countdownParts = countdown.split(":");
  const hoursMins =
    countdownParts.length === 3
      ? `${countdownParts[0]}:${countdownParts[1]}`
      : "--:--";
  const seconds = countdownParts.length === 3 ? countdownParts[2] : "--";
  const hasHijriDate = Boolean(prayerData?.date.hijri.day);

  const nextColor = nextPrayer ? PRAYER_COLORS[nextPrayer.name as PrayerName] : colors.brandGold;
  const nextIcon = nextPrayer ? PRAYER_ICONS[nextPrayer.name as PrayerName] as any : "time-outline";

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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={[nextColor + '1A', colors.background]}
        locations={[0, 0.4]}
        style={[StyleSheet.absoluteFill, { opacity: isDark ? 0.8 : 0.4 }]}
      />
      <ScrollView
        style={styles.container}
        bounces={true}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.brandGold}
          />
        }
      >
        <View style={[styles.header, { marginTop: insets.top + 20 }]}>
          <View>
            <View style={styles.brandSubtitleRow}>
              <Image
                source={require("@/assets/images/icon-transparent.png")}
                style={styles.brandSubtitleLogo}
                resizeMode="contain"
              />
              <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
                {t.arnautiMosque}
              </Text>
            </View>
            {prayerData && hasHijriDate && (
              <Text style={[styles.dateText, { color: colors.text }]}>
                {prayerData.date.hijri.day}{" "}
                {language === "sq"
                  ? "Muharrem"
                  : prayerData.date.hijri.month.en}{" "}
                {prayerData.date.hijri.year} AH
              </Text>
            )}
          </View>

          <View style={{ position: 'relative' }}>
            <TouchableOpacity
              style={[styles.citySelector, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              onPress={() => setShowCityPicker(!showCityPicker)}
            >
              <Ionicons name="location" size={14} color={colors.brandGold} />
              <Text style={[styles.cityName, { color: colors.text }]}>
                {getCityDisplayName(selectedCity, language)}
              </Text>
              <Ionicons
                name={showCityPicker ? "chevron-up" : "chevron-down"}
                size={12}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

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
                        selectedCity.id === city.id && styles.cityOptionTextActive,
                        selectedCity.id === city.id && { color: colors.brandGold },
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
          </View>
        </View>

        {/* Main Countdown Area */}
        <View style={styles.countdownContainer}>
          <View style={[styles.countdownIconWrapper, { backgroundColor: nextColor + '20' }]}>
            <Ionicons name={nextIcon} size={48} color={nextColor} />
          </View>
          <View style={styles.timeRow}>
            <Text style={[styles.countdownLarge, { color: colors.text }]}>
              {hoursMins}
            </Text>
            <Text style={[styles.countdownSmall, { color: colors.textMuted }]}>
              {seconds}
            </Text>
          </View>
          <Text style={[styles.countdownLabel, { color: colors.textSecondary }]}>
            {language === "sq"
              ? "deri në"
              : language === "tr"
                ? "kadar"
                : "до"}{" "}
            <Text style={[styles.countdownLabelBold, { color: colors.text }]}>
              {nextPrayer ? getPrayerName(nextPrayer.name).name : ""}
            </Text>
          </Text>
        </View>

        {/* Vertical Prayer List instead of Horizontal Cards */}
        <View style={styles.prayersList}>
          {prayerData && prayers.map((prayer) => {
            const isNext = nextPrayer?.name === prayer;
            const time = prayerData.timings[prayer];
            const prayerInfo = getPrayerName(prayer);
            const color = PRAYER_COLORS[prayer];

            return (
              <View
                key={prayer}
                style={[
                  styles.prayerRowItem,
                  { backgroundColor: isNext ? nextColor : colors.card, borderColor: isNext ? nextColor : colors.cardBorder },
                  isNext && styles.prayerRowItemActive
                ]}
              >
                <View style={styles.prayerRowLeft}>
                  <Ionicons
                    name={PRAYER_ICONS[prayer] as any}
                    size={22}
                    color={isNext ? '#FFFFFF' : color}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={[styles.prayerRowName, { color: isNext ? '#FFFFFF' : colors.text }]}>
                    {prayerInfo.name}
                  </Text>
                </View>
                <Text style={[styles.prayerRowTime, { color: isNext ? '#FFFFFF' : colors.text }]}>
                  {formatTimeTo12Hour(time)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Promo Banner */}
        <TouchableOpacity
          style={styles.promoBanner}
          onPress={() => void openExternalUrl("https://www.youtube.com/@ThirrjaIslame")}
          activeOpacity={0.9}
        >
          <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=800&auto=format&fit=crop" }}
            style={styles.promoBannerBg}
            imageStyle={{ borderRadius: 16 }}
          >
            <LinearGradient
              colors={isDark ? ["rgba(0,43,69,0.7)", "rgba(0,26,44,0.95)"] : ["rgba(255,255,255,0.8)", colors.card]}
              style={styles.promoBannerGradient}
            >
              <View style={styles.promoIconBadge}>
                <Ionicons name="logo-youtube" size={18} color="#FFFFFF" />
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
        </TouchableOpacity>

        {/* Actions Cards */}
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
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

        {/* Videos Section */}
        <View style={styles.videosSection}>
          <View style={styles.videosSectionHeader}>
            <Text style={[styles.videosSectionTitle, { color: colors.text }]}>
              {t.videos}
            </Text>
            <TouchableOpacity onPress={() => void openExternalUrl("https://www.youtube.com/@ThirrjaIslame")}>
              <Text style={styles.seeAllText}>{t.seeAll}</Text>
            </TouchableOpacity>
          </View>

          {recentVideos.length === 0 && (
            <ActivityIndicator size="large" color={colors.brandGold} style={{ marginTop: 20 }} />
          )}

          {recentVideos.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={[styles.videoCardRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              onPress={() => void openExternalUrl(video.url)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} />
              <View style={styles.videoInfo}>
                <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={2}>
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
    </View>
  );
}

const styles = StyleSheet.create({
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

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    zIndex: 10,
  },
  brandSubtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  brandSubtitleLogo: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  citySelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  cityName: {
    fontSize: 13,
    fontWeight: "600",
    marginHorizontal: 6,
  },
  cityDropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    width: 180,
    zIndex: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
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

  // Countdown area
  countdownContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 32,
  },
  countdownIconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  countdownLarge: {
    fontSize: 56,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
    letterSpacing: -2,
  },
  countdownSmall: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
    marginLeft: 4,
    fontVariant: ["tabular-nums"],
  },
  countdownLabel: {
    fontSize: 16,
    marginTop: 8,
  },
  countdownLabelBold: {
    fontWeight: "800",
  },

  // Prayers Vertical List
  prayersList: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 20,
  },
  prayerRowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  prayerRowItemActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  prayerRowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  prayerRowName: {
    fontSize: 17,
    fontWeight: "700",
  },
  prayerRowTime: {
    fontSize: 17,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },

  // Promo Banner
  promoBanner: {
    marginHorizontal: 24,
    marginTop: 16,
    height: 120,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  promoBannerBg: {
    width: "100%",
    height: "100%",
  },
  promoBannerGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 24,
  },
  promoIconBadge: {
    position: "absolute",
    right: 20,
    top: 20,
    backgroundColor: "#EF4444",
    padding: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  promoTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  promoSubtitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  promoHandle: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
  },

  // Action Card
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  actionIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(212,175,55,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionTextWrapper: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  actionSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },

  // Videos
  videosSection: {
    marginHorizontal: 24,
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
    fontWeight: "700",
  },
  videoCardRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
  },
  videoThumbnail: {
    width: 100,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
  },
  videoInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
    lineHeight: 20,
  },
  videoDate: {
    fontSize: 12,
  },
});
"""

# Find the start of the replace block.
start_idx = code.find('  const countdownParts = countdown.split(":");')
if start_idx == -1:
    print("Could not find start idx!")
else:
    new_code = code[:start_idx] + new_render
    with open("app/(tabs)/index.tsx", "w", encoding="utf-8") as f:
        f.write(new_code)
    print("Success!")
