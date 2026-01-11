//
//  HomeSmallWidgetLiveActivity.swift
//  HomeSmallWidget
//
//  Created by dgchoi on 1/8/26.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct HomeSmallWidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct HomeSmallWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: HomeSmallWidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension HomeSmallWidgetAttributes {
    fileprivate static var preview: HomeSmallWidgetAttributes {
        HomeSmallWidgetAttributes(name: "World")
    }
}

extension HomeSmallWidgetAttributes.ContentState {
    fileprivate static var smiley: HomeSmallWidgetAttributes.ContentState {
        HomeSmallWidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: HomeSmallWidgetAttributes.ContentState {
         HomeSmallWidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: HomeSmallWidgetAttributes.preview) {
   HomeSmallWidgetLiveActivity()
} contentStates: {
    HomeSmallWidgetAttributes.ContentState.smiley
    HomeSmallWidgetAttributes.ContentState.starEyes
}
