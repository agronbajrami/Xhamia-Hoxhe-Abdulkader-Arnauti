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
    let lastUpdated: Double
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> PrayerEntry {
        PrayerEntry(
            date: Date(),
            cityName: "Shkup",
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
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }

    private func loadPrayerEntry() -> PrayerEntry {
        let defaults = UserDefaults(suiteName: "group.com.takvim.app")
        if let jsonString = defaults?.string(forKey: "prayerWidgetData"),
           let jsonData = jsonString.data(using: .utf8),
           let data = try? JSONDecoder().decode(PrayerData.self, from: jsonData) {
            return PrayerEntry(
                date: Date(),
                cityName: data.cityName,
                prayers: data.prayers
            )
        }
        return placeholder(in: .init(family: .systemMedium, isPreview: false))
    }
}

struct PrayerEntry: TimelineEntry {
    let date: Date
    let cityName: String
    let prayers: [PrayerTime]
}

// ── Reusable prayer cell ──
struct PrayerCell: View {
    let name: String
    let time: String

    var body: some View {
        VStack(spacing: 2) {
            Text(name)
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(Color.white.opacity(0.5))
            Text(cleanTime(time))
                .font(.system(size: 14, weight: .bold, design: .rounded))
                .foregroundColor(.white)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 6)
        .background(
            RoundedRectangle(cornerRadius: 10)
                .fill(Color(red: 0.051, green: 0.161, blue: 0.251))
        )
    }

    private func cleanTime(_ raw: String) -> String {
        raw.replacingOccurrences(of: #"\s*\(.*\)"#, with: "", options: .regularExpression)
    }
}

struct PrayerWidgetEntryView: View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    private let brandGold = Color(red: 0.831, green: 0.686, blue: 0.216)
    private let bgColor = Color(red: 0.0, green: 0.102, blue: 0.173)
    private let cardColor = Color(red: 0.051, green: 0.161, blue: 0.251)

    var body: some View {
        ZStack {
            bgColor

            VStack(spacing: 8) {
                // ── Header ──
                HStack(spacing: 6) {
                    // Logo placeholder circle
                    ZStack {
                        Circle()
                            .fill(cardColor)
                            .frame(width: 26, height: 26)
                        Text("🕌")
                            .font(.system(size: 12))
                    }

                    VStack(alignment: .leading, spacing: 0) {
                        Text("Hoxhë Abdulkadër Arnauti")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(brandGold)
                        Text(entry.cityName)
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(Color.white.opacity(0.4))
                    }

                    Spacer()
                }

                // ── Divider ──
                Rectangle()
                    .fill(brandGold.opacity(0.2))
                    .frame(height: 0.5)

                // ── Prayer Grid ──
                if family == .systemSmall {
                    // Small: vertical list
                    VStack(spacing: 3) {
                        ForEach(entry.prayers, id: \.name) { prayer in
                            HStack {
                                Text(prayer.name)
                                    .font(.system(size: 11, weight: .medium))
                                    .foregroundColor(Color.white.opacity(0.55))
                                Spacer()
                                Text(cleanTime(prayer.time))
                                    .font(.system(size: 12, weight: .bold, design: .rounded))
                                    .foregroundColor(.white)
                            }
                            .padding(.horizontal, 6)
                            .padding(.vertical, 3)
                            .background(
                                RoundedRectangle(cornerRadius: 6)
                                    .fill(cardColor)
                            )
                        }
                    }
                } else {
                    // Medium / Large: 3×2 grid
                    VStack(spacing: 4) {
                        HStack(spacing: 4) {
                            ForEach(entry.prayers.prefix(3), id: \.name) { prayer in
                                PrayerCell(name: prayer.name, time: prayer.time)
                            }
                        }
                        HStack(spacing: 4) {
                            ForEach(entry.prayers.suffix(3), id: \.name) { prayer in
                                PrayerCell(name: prayer.name, time: prayer.time)
                            }
                        }
                    }
                }
            }
            .padding(12)
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
