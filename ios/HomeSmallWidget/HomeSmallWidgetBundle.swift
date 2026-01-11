//
//  HomeSmallWidgetBundle.swift
//  HomeSmallWidget
//
//  Created by dgchoi on 1/8/26.
//

import WidgetKit
import SwiftUI

@main
struct HomeSmallWidgetBundle: WidgetBundle {
    var body: some Widget {
        HomeSmallWidget()
        HomeSmallWidgetControl()
        HomeSmallWidgetLiveActivity()
    }
}
