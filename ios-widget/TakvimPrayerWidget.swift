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
                PrayerTime(name: "Sunrise", time: "06:05"),
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
        // Refresh every 30 minutes
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

struct PrayerWidgetEntryView: View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.0, green: 0.102, blue: 0.173),
                    Color(red: 0.039, green: 0.161, blue: 0.251)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(spacing: 6) {
                // Header
                HStack {
                    Text("🕌")
                        .font(.system(size: 14))
                    Text("Takvim")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(Color(red: 0.831, green: 0.686, blue: 0.216))
                    Spacer()
                    Text(entry.cityName)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(Color.white.opacity(0.5))
                }
                .padding(.bottom, 2)

                // Divider
                Rectangle()
                    .fill(Color(red: 0.831, green: 0.686, blue: 0.216).opacity(0.3))
                    .frame(height: 0.5)

                // Prayer times grid
                if family == .systemSmall {
                    // Compact layout for small widget
                    VStack(spacing: 4) {
                        ForEach(entry.prayers, id: \.name) { prayer in
                            HStack {
                                Text(prayer.name)
                                    .font(.system(size: 11, weight: .medium))
                                    .foregroundColor(Color.white.opacity(0.6))
                                Spacer()
                                Text(prayer.time)
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(.white)
                            }
                        }
                    }
                } else {
                    // 2-column grid for medium/large
                    LazyVGrid(columns: [
                        GridItem(.flexible()),
                        GridItem(.flexible()),
                        GridItem(.flexible())
                    ], spacing: 6) {
                        ForEach(entry.prayers, id: \.name) { prayer in
                            VStack(spacing: 2) {
                                Text(prayer.name)
                                    .font(.system(size: 10, weight: .medium))
                                    .foregroundColor(Color.white.opacity(0.5))
                                Text(prayer.time)
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.white)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 4)
                            .background(
                                RoundedRectangle(cornerRadius: 8)
                                    .fill(Color.white.opacity(0.06))
                            )
                        }
                    }
                }
            }
            .padding(12)
        }
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
                PrayerTime(name: "Sunrise", time: "06:05"),
                PrayerTime(name: "Dhuhr", time: "12:45"),
                PrayerTime(name: "Asr", time: "16:15"),
                PrayerTime(name: "Maghrib", time: "19:30"),
                PrayerTime(name: "Isha", time: "21:00"),
            ]
        ))
        .previewContext(WidgetPreviewContext(family: .systemMedium))
    }
}
