//
//  HomeSmallWidget.swift
//  HomeSmallWidget
//
//  Created by dgchoi on 1/8/26.
//

import WidgetKit
import SwiftUI
import AppIntents

// MARK: - Models
struct CountdownEvent {
    let id: String
    let title: String
    let targetDate: Date
    let emoji: String
    let color: String
    
    var artistName: String {
        if let match = title.range(of: #"\[(.*?)\]"#, options: .regularExpression) {
            return String(title[match].dropFirst().dropLast())
        }
        return ""
    }
    
    var eventTitle: String {
        return title.replacingOccurrences(of: #"\[.*?\]\s*"#, with: "", options: .regularExpression)
    }
}

struct TimeLeft {
    let days: Int
    let hours: Int
    let minutes: Int
    let seconds: Int
    
    var isNegative: Bool {
        days < 0 || hours < 0 || minutes < 0 || seconds < 0
    }
}

// MARK: - Provider
struct Provider: TimelineProvider {
    typealias Entry = SimpleEntry
    
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(
            date: Date(),
            event: CountdownEvent(
                id: "sample",
                title: "[MyArtist] 컴백",
                targetDate: Date().addingTimeInterval(7 * 24 * 60 * 60),
                emoji: "sparkles",
                color: "#C084FC"
            )
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> Void) {
        let entry = SimpleEntry(
            date: Date(),
            event: CountdownEvent(
                id: "sample",
                title: "[MyArtist] 컴백",
                targetDate: Date().addingTimeInterval(7 * 24 * 60 * 60),
                emoji: "sparkles",
                color: "#C084FC"
            )
        )
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> Void) {
        var entries: [SimpleEntry] = []
        
        // 샘플 이벤트 데이터 (나중에 App Group으로 실제 데이터 연동)
        let sampleEvent = CountdownEvent(
            id: "sample",
            title: "[MyArtist] 컴백",
            targetDate: Date().addingTimeInterval(7 * 24 * 60 * 60),
            emoji: "sparkles",
            color: "#C084FC"
        )
        
        let currentDate = Date()
        // 1분마다 업데이트 (초 단위 카운트다운을 위해)
        for minuteOffset in 0 ..< 60 {
            let entryDate = Calendar.current.date(byAdding: .minute, value: minuteOffset, to: currentDate)!
            let entry = SimpleEntry(date: entryDate, event: sampleEvent)
            entries.append(entry)
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let event: CountdownEvent
    
    func calculateTimeLeft() -> TimeLeft {
        let calendar = Calendar.current
        let now = date
        let target = event.targetDate
        
        let components = calendar.dateComponents([.day, .hour, .minute, .second], from: now, to: target)
        
        return TimeLeft(
            days: components.day ?? 0,
            hours: components.hour ?? 0,
            minutes: components.minute ?? 0,
            seconds: components.second ?? 0
        )
    }
}

// MARK: - Widget Views
struct HomeSmallWidgetEntryView : View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family
    
    var body: some View {
        let timeLeft = entry.calculateTimeLeft()
        let accentColor = Color(hex: entry.event.color) ?? Color.pink
        
        ZStack {
            // iOS systemBackground 느낌의 배경
            LinearGradient(
                colors: [Color(hex: "#FAFAFA") ?? .white, Color(hex: "#F5F5F5") ?? .white],
                startPoint: .top,
                endPoint: .bottom
            )
            
            switch family {
            case .systemSmall:
                SmallWidgetView(event: entry.event, timeLeft: timeLeft, accentColor: accentColor)
            case .systemMedium:
                MediumWidgetView(event: entry.event, timeLeft: timeLeft, accentColor: accentColor)
            case .systemLarge:
                LargeWidgetView(event: entry.event, timeLeft: timeLeft, accentColor: accentColor)
            default:
                SmallWidgetView(event: entry.event, timeLeft: timeLeft, accentColor: accentColor)
            }
        }
    }
}

// MARK: - Small Widget
struct SmallWidgetView: View {
    let event: CountdownEvent
    let timeLeft: TimeLeft
    let accentColor: Color
    
    var body: some View {
        VStack(spacing: 0) {
            // 상단: 아티스트명
            if !event.artistName.isEmpty {
                Text(event.artistName)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(accentColor)
                    .lineLimit(1)
            }
            
            Spacer()
            
            // 중앙: D-Day 숫자 크게
            HStack(spacing: 0) {
                Text("D")
                    .font(.system(size: 52, weight: .bold))
                    .foregroundColor(Color(hex: "#1F2937"))
                Text(timeLeft.days >= 0 ? "-" : "+")
                    .font(.system(size: 36, weight: .bold))
                    .foregroundColor(Color(hex: "#1F2937"))
                Text("\(abs(timeLeft.days))")
                    .font(.system(size: 52, weight: .bold))
                    .foregroundColor(Color(hex: "#1F2937"))
            }
            .kerning(-2)
            
            Spacer()
            
            // 하단: 아이콘 + 이벤트명
            HStack(spacing: 4) {
                Image(systemName: mapEmojiToSFSymbol(event.emoji))
                    .font(.system(size: 14))
                    .foregroundColor(accentColor)
                Text(event.eventTitle)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(accentColor)
                    .lineLimit(1)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 14)
    }
}

// MARK: - Medium Widget
struct MediumWidgetView: View {
    let event: CountdownEvent
    let timeLeft: TimeLeft
    let accentColor: Color
    
    var body: some View {
        HStack(spacing: 20) {
            // 좌측: 이벤트 정보
            VStack(alignment: .leading, spacing: 6) {
                if !event.artistName.isEmpty {
                    Text(event.artistName)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(accentColor)
                        .lineLimit(1)
                }
                
                HStack(spacing: 5) {
                    Image(systemName: mapEmojiToSFSymbol(event.emoji))
                        .font(.system(size: 16))
                        .foregroundColor(accentColor)
                    Text(event.eventTitle)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(accentColor)
                        .lineLimit(1)
                }
            }
            
            Spacer()
            
            // 우측: D-Day + 시:분:초
            VStack(spacing: 4) {
                HStack(spacing: 0) {
                    Text("D")
                        .font(.system(size: 52, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))
                    Text(timeLeft.days >= 0 ? "-" : "+")
                        .font(.system(size: 36, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))
                    Text("\(abs(timeLeft.days))")
                        .font(.system(size: 52, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))
                }
                .kerning(-2)
                
                // 초 단위 카운트다운
                Text(String(format: "%02d:%02d:%02d", 
                           abs(timeLeft.hours), 
                           abs(timeLeft.minutes), 
                           abs(timeLeft.seconds)))
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(Color(hex: "#1F2937"))
                    .monospacedDigit()
            }
        }
        .padding(16)
    }
}

// MARK: - Large Widget
struct LargeWidgetView: View {
    let event: CountdownEvent
    let timeLeft: TimeLeft
    let accentColor: Color
    
    var body: some View {
        VStack(spacing: 0) {
            // 상단: 아티스트명
            if !event.artistName.isEmpty {
                Text(event.artistName)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(accentColor)
                    .lineLimit(1)
                    .padding(.top, 4)
            }
            
            // 중단: 아이콘 + 이벤트명
            HStack(spacing: 6) {
                Image(systemName: mapEmojiToSFSymbol(event.emoji))
                    .font(.system(size: 20))
                    .foregroundColor(accentColor)
                Text(event.eventTitle)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(accentColor)
                    .lineLimit(1)
            }
            .padding(.top, event.artistName.isEmpty ? 0 : 8)
            
            Spacer()
            
            // 하단: D-Day + 시:분:초 (중앙 정렬)
            VStack(spacing: 8) {
                HStack(spacing: 0) {
                    Text("D")
                        .font(.system(size: 72, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))
                    Text(timeLeft.days >= 0 ? "-" : "+")
                        .font(.system(size: 48, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))
                    Text("\(abs(timeLeft.days))")
                        .font(.system(size: 72, weight: .bold))
                        .foregroundColor(Color(hex: "#1F2937"))
                }
                .kerning(-3)
                
                // 초 단위 카운트다운
                Text(String(format: "%02d:%02d:%02d", 
                           abs(timeLeft.hours), 
                           abs(timeLeft.minutes), 
                           abs(timeLeft.seconds)))
                    .font(.system(size: 28, weight: .semibold))
                    .foregroundColor(Color(hex: "#1F2937"))
                    .kerning(-1)
                    .monospacedDigit()
            }
            
            Spacer()
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 18)
    }
}

// MARK: - Helper Functions
func mapEmojiToSFSymbol(_ emoji: String) -> String {
    let mapping: [String: String] = [
        "musical-notes": "music.note",
        "mic": "mic.fill",
        "gift": "gift.fill",
        "cake": "birthday.cake.fill",
        "happy": "party.popper.fill",
        "trophy": "trophy.fill",
        "heart": "heart.fill",
        "star": "star.fill",
        "sparkles": "sparkles",
        "headset": "headphones",
        "calendar": "calendar",
        "diamond": "diamond.fill"
    ]
    
    return mapping[emoji] ?? "star.fill"
}

// MARK: - Color Extension
extension Color {
    init?(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            return nil
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Widget Configuration
struct HomeSmallWidget: Widget {
    let kind: String = "HomeSmallWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            HomeSmallWidgetEntryView(entry: entry)
                .containerBackground(Color(hex: "#FAFAFA") ?? .white, for: .widget)
        }
        .configurationDisplayName("아이돌 카운트다운")
        .description("아이돌 이벤트까지 남은 시간을 확인하세요")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

// MARK: - Preview
#Preview(as: .systemSmall) {
    HomeSmallWidget()
} timeline: {
    SimpleEntry(
        date: Date(),
        event: CountdownEvent(
            id: "sample1",
            title: "[MyArtist] 컴백",
            targetDate: Date().addingTimeInterval(7 * 24 * 60 * 60),
            emoji: "sparkles",
            color: "#C084FC"
        )
    )
    SimpleEntry(
        date: Date(),
        event: CountdownEvent(
            id: "sample2",
            title: "[NewJeans] 신곡 발매",
            targetDate: Date().addingTimeInterval(3 * 24 * 60 * 60),
            emoji: "musical-notes",
            color: "#FF6B9D"
        )
    )
}

#Preview(as: .systemMedium) {
    HomeSmallWidget()
} timeline: {
    SimpleEntry(
        date: Date(),
        event: CountdownEvent(
            id: "sample1",
            title: "[MyArtist] 컴백",
            targetDate: Date().addingTimeInterval(7 * 24 * 60 * 60),
            emoji: "sparkles",
            color: "#C084FC"
        )
    )
}

#Preview(as: .systemLarge) {
    HomeSmallWidget()
} timeline: {
    SimpleEntry(
        date: Date(),
        event: CountdownEvent(
            id: "sample1",
            title: "[MyArtist] 컴백",
            targetDate: Date().addingTimeInterval(7 * 24 * 60 * 60),
            emoji: "sparkles",
            color: "#C084FC"
        )
    )
}
