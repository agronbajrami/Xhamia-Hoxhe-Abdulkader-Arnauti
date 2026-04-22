import SwiftUI
import WidgetKit

struct PrayerTime: Codable {
    let name: String
    let time: String
}

struct PrayerData: Codable {
    let cityName: String
    let date: String
    let prayers: [PrayerTime]
    let theme: String?
    let language: String?
    let lastUpdated: Double
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> PrayerEntry {
        PrayerEntry(
            date: Date(),
            cityName: "Shkup",
            theme: "dark",
            language: "sq",
            prayers: [
                PrayerTime(name: "Fajr", time: "04:30"),
                PrayerTime(name: "Lindja", time: "06:05"),
                PrayerTime(name: "Dhuhr", time: "12:45"),
                PrayerTime(name: "Asr", time: "16:15"),
                PrayerTime(name: "Maghrib", time: "19:30"),
                PrayerTime(name: "Isha", time: "21:00"),
            ]
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (PrayerEntry) -> Void) {
        let entry = loadPrayerEntry()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<PrayerEntry>) -> Void) {
        let entry = loadPrayerEntry()
        let nextUpdate = nextRefreshDate(from: entry.prayers, now: Date())
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }

    private func nextRefreshDate(from prayers: [PrayerTime], now: Date) -> Date {
        var prayerDates: [Date] = []

        for prayer in prayers {
            let cleaned = prayer.time.replacingOccurrences(of: #"\s*\(.*\)"#, with: "", options: .regularExpression)
            let parts = cleaned.split(separator: ":")
            guard parts.count >= 2,
                  let hour = Int(parts[0]),
                  let minute = Int(parts[1]),
                  let date = Calendar.current.date(bySettingHour: hour, minute: minute, second: 0, of: now) else {
                continue
            }
            prayerDates.append(date)
        }

        let target = prayerDates.first(where: { $0 > now }) ?? {
            guard let firstToday = prayerDates.first else {
                return Calendar.current.date(byAdding: .minute, value: 30, to: now) ?? now
            }
            return Calendar.current.date(byAdding: .day, value: 1, to: firstToday) ?? firstToday
        }()

        return Calendar.current.date(byAdding: .minute, value: 1, to: target) ?? target
    }

    private func loadPrayerEntry() -> PrayerEntry {
        let defaults = UserDefaults(suiteName: "group.com.takvim.app")
        if let jsonString = defaults?.string(forKey: "prayerWidgetData"),
           let jsonData = jsonString.data(using: .utf8),
           let data = try? JSONDecoder().decode(PrayerData.self, from: jsonData) {
            return PrayerEntry(
                date: Date(),
                cityName: data.cityName,
                theme: data.theme ?? "dark",
                language: data.language ?? "sq",
                prayers: data.prayers
            )
        }
        return PrayerEntry(
            date: Date(),
            cityName: "Shkup",
            theme: "dark",
            language: "sq",
            prayers: [
                PrayerTime(name: "Fajr", time: "04:30"),
                PrayerTime(name: "Lindja", time: "06:05"),
                PrayerTime(name: "Dhuhr", time: "12:45"),
                PrayerTime(name: "Asr", time: "16:15"),
                PrayerTime(name: "Maghrib", time: "19:30"),
                PrayerTime(name: "Isha", time: "21:00"),
            ]
        )
    }
}

struct PrayerEntry: TimelineEntry {
    let date: Date
    let cityName: String
    let theme: String
    let language: String
    let prayers: [PrayerTime]
}

// ── Reusable prayer cell ──
struct PrayerCell: View {
    let name: String
    let time: String
    let isLight: Bool

    var body: some View {
        VStack(spacing: 2) {
            Text(name)
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(isLight ? Color(red: 0.2, green: 0.26, blue: 0.33) : Color.white.opacity(0.55))
            Text(cleanTime(time))
                .font(.system(size: 14, weight: .bold, design: .rounded))
                .foregroundColor(isLight ? Color(red: 0.06, green: 0.09, blue: 0.15) : .white)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 6)
        .background(
            RoundedRectangle(cornerRadius: 10)
                .fill(isLight ? Color.white : Color(red: 0.051, green: 0.161, blue: 0.251))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(isLight ? Color.black.opacity(0.06) : Color.white.opacity(0.08), lineWidth: 1)
        )
    }

    private func cleanTime(_ raw: String) -> String {
        raw.replacingOccurrences(of: #"\s*\(.*\)"#, with: "", options: .regularExpression)
    }
}

struct PrayerWidgetEntryView: View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    private var isLight: Bool { entry.theme == "light" }
    private var brandGold: Color { isLight ? Color(red: 0.776, green: 0.624, blue: 0.145) : Color(red: 0.831, green: 0.686, blue: 0.216) }
    private var bgColor: Color { isLight ? Color(red: 0.969, green: 0.973, blue: 0.984) : Color(red: 0.0, green: 0.102, blue: 0.173) }
    private var cardColor: Color { isLight ? Color.white.opacity(0.74) : Color(red: 0.051, green: 0.161, blue: 0.251) }
    private var bodyText: Color { isLight ? Color(red: 0.2, green: 0.26, blue: 0.33) : Color.white.opacity(0.55) }
    private var strongText: Color { isLight ? Color(red: 0.06, green: 0.09, blue: 0.15) : .white }
    private var nextPrefix: String {
        switch entry.language {
        case "mk": return "Следна"
        case "tr": return "Sonraki"
        default: return "Tjetra"
        }
    }
    private var nextPrayerCountdownText: String? { countdownInfo?.countdown }
    private var nextPrayerNameText: String? { countdownInfo?.name }

    private var countdownInfo: (name: String, countdown: String)? {
        let now = Date()
        var schedule: [(String, Date)] = []

        for prayer in entry.prayers {
            let cleaned = cleanTime(prayer.time)
            let parts = cleaned.split(separator: ":")
            guard parts.count >= 2,
                  let hour = Int(parts[0]),
                  let minute = Int(parts[1]) else { continue }

            var prayerDate = Calendar.current.date(bySettingHour: hour, minute: minute, second: 0, of: now)
            if prayerDate == nil { continue }
            if let date = prayerDate {
                schedule.append((prayer.name, date))
            }
        }

        guard !schedule.isEmpty else { return nil }

        let next = schedule.first { $0.1 > now } ?? {
            var tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: now) ?? now
            let first = schedule[0]
            let comps = Calendar.current.dateComponents([.hour, .minute], from: first.1)
            tomorrow = Calendar.current.date(bySettingHour: comps.hour ?? 0, minute: comps.minute ?? 0, second: 0, of: tomorrow) ?? tomorrow
            return (first.0, tomorrow)
        }()

        let diffMinutes = max(0, Int(ceil(next.1.timeIntervalSince(now) / 60)))
        let hours = diffMinutes / 60
        let minutes = diffMinutes % 60
        let countdown: String
        if hours < 1 {
            countdown = "\(diffMinutes)m"
        } else if minutes == 0 {
            countdown = "\(hours)h"
        } else {
            countdown = "\(hours)h \(minutes)m"
        }
        return (next.0, countdown)
    }

    @ViewBuilder
    var body: some View {
        let content = VStack(spacing: 8) {
                // ── Header ──
                HStack(spacing: 8) {
                    VStack(alignment: .leading, spacing: 0) {
                        Text("Hoxhë Abdulkadër Arnauti")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(brandGold)
                        Text(entry.cityName)
                            .font(.system(size: 9, weight: .medium))
                            .foregroundColor(isLight ? Color(red: 0.39, green: 0.45, blue: 0.53) : Color.white.opacity(0.4))
                    }

                    Spacer()

                    if let nextName = nextPrayerNameText, let countdown = nextPrayerCountdownText {
                        VStack(alignment: .trailing, spacing: 1) {
                            Text("\(nextPrefix) \(nextName)")
                                .font(.system(size: 8, weight: .semibold))
                                .foregroundColor(isLight ? Color(red: 0.45, green: 0.35, blue: 0.12) : brandGold.opacity(0.85))
                            Text(countdown)
                                .font(.system(size: 11, weight: .bold, design: .rounded))
                                .foregroundColor(brandGold)
                        }
                    }
                }

                // ── Divider ──
                Rectangle()
                    .fill(isLight ? Color.black.opacity(0.08) : brandGold.opacity(0.2))
                    .frame(height: 0.5)

                // ── Prayer Grid ──
                if family == .systemSmall {
                    // Small: vertical list
                    VStack(spacing: 3) {
                        ForEach(entry.prayers, id: \.name) { prayer in
                            HStack {
                                Text(prayer.name)
                                    .font(.system(size: 11, weight: .medium))
                                    .foregroundColor(bodyText)
                                Spacer()
                                Text(cleanTime(prayer.time))
                                    .font(.system(size: 12, weight: .bold, design: .rounded))
                                    .foregroundColor(strongText)
                            }
                            .padding(.horizontal, 6)
                            .padding(.vertical, 3)
                            .background(
                                RoundedRectangle(cornerRadius: 6)
                                    .fill(cardColor)
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 6)
                                    .stroke(isLight ? Color.black.opacity(0.06) : Color.white.opacity(0.08), lineWidth: 1)
                            )
                        }
                    }
                } else {
                    // Medium / Large: 3×2 grid
                    VStack(spacing: 4) {
                        HStack(spacing: 4) {
                            ForEach(entry.prayers.prefix(3), id: \.name) { prayer in
                                PrayerCell(name: prayer.name, time: prayer.time, isLight: isLight)
                            }
                        }
                        HStack(spacing: 4) {
                            ForEach(entry.prayers.suffix(3), id: \.name) { prayer in
                                PrayerCell(name: prayer.name, time: prayer.time, isLight: isLight)
                            }
                        }
                    }
                }
        }
        .padding(12)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)

        if #available(iOSApplicationExtension 17.0, *) {
            content.containerBackground(bgColor, for: .widget)
        } else {
            ZStack {
                bgColor
                content
            }
        }
    }

    private func cleanTime(_ raw: String) -> String {
        raw.replacingOccurrences(of: #"\s*\(.*\)"#, with: "", options: .regularExpression)
    }
}

@main
struct TakvimPrayerWidget: Widget {
    let kind: String = "TakvimPrayerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            PrayerWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Takvim Prayers")
        .description("View daily prayer times at a glance.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct TakvimPrayerWidget_Previews: PreviewProvider {
    static var previews: some View {
        PrayerWidgetEntryView(entry: PrayerEntry(
            date: Date(),
            cityName: "Shkup",
            theme: "dark",
            language: "sq",
            prayers: [
                PrayerTime(name: "Fajr", time: "04:30"),
                PrayerTime(name: "Lindja", time: "06:05"),
                PrayerTime(name: "Dhuhr", time: "12:45"),
                PrayerTime(name: "Asr", time: "16:15"),
                PrayerTime(name: "Maghrib", time: "19:30"),
                PrayerTime(name: "Isha", time: "21:00"),
            ]
        ))
        .previewContext(WidgetPreviewContext(family: .systemMedium))
    }
}
