//
//  FeatureGate.swift
//  idolcountdown
//
//  Feature Gate for Free/Pro policies
//  Shared between App and Widget Extension
//

import Foundation

enum FeatureMode: String {
    case free = "FREE"
    case pro = "PRO"
    case normal = "NORMAL"
}

struct FeatureGate {
    // MARK: - Build Time Configuration
    
    /// 빌드 타임 모드 가져오기 (Info.plist의 FEATURE_MODE)
    static func getBuildTimeMode() -> FeatureMode {
        if let modeString = Bundle.main.object(forInfoDictionaryKey: "FEATURE_MODE") as? String {
            return FeatureMode(rawValue: modeString) ?? .normal
        }
        return .normal
    }
    
    // MARK: - Pro Feature Check
    
    /// Pro 기능이 유효한지 판단
    /// - Parameter purchaseState: 런타임 결제 상태
    /// - Returns: Pro 기능 사용 가능 여부
    static func isProEffective(purchaseState: Bool = false) -> Bool {
        let buildMode = getBuildTimeMode()
        
        // 빌드 타임 override가 있으면 우선 적용
        switch buildMode {
        case .pro:
            return true
        case .free:
            return false
        case .normal:
            // NORMAL 모드: 런타임 결제 상태를 따름
            return purchaseState
        }
    }
    
    // MARK: - Widget Limits
    
    static let freeLimits = (home: 1, lockscreen: 1)
    static let proLimits = (home: Int.max, lockscreen: Int.max)
    
    /// 위젯 추가 가능 여부 판단
    /// - Parameters:
    ///   - currentHomeCount: 현재 홈 위젯 개수
    ///   - currentLockCount: 현재 잠금화면 위젯 개수
    ///   - widgetType: 추가하려는 위젯 타입
    ///   - purchaseState: 런타임 결제 상태
    /// - Returns: 추가 가능 여부
    static func canAddWidget(
        currentHomeCount: Int,
        currentLockCount: Int,
        widgetType: WidgetType,
        purchaseState: Bool = false
    ) -> Bool {
        let isPro = isProEffective(purchaseState: purchaseState)
        let limits = isPro ? proLimits : freeLimits
        
        switch widgetType {
        case .home:
            return currentHomeCount < limits.home
        case .lockscreen:
            return currentLockCount < limits.lockscreen
        }
    }
    
    // MARK: - Seconds Display
    
    /// 초 단위 카운트다운 표시 가능 여부
    /// - Parameter purchaseState: 런타임 결제 상태
    /// - Returns: 초 단위 표시 가능 여부
    static func canShowSeconds(purchaseState: Bool = false) -> Bool {
        return isProEffective(purchaseState: purchaseState)
    }
    
    // MARK: - Helper Types
    
    enum WidgetType {
        case home
        case lockscreen
    }
}
