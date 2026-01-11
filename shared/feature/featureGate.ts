/**
 * Feature Gate Layer
 * 
 * Free/Pro 정책을 중앙에서 관리하는 레이어
 * 빌드 타임 override (FEATURE_MODE) 또는 런타임 결제 상태에 따라 기능 제한 판단
 */

import Constants from 'expo-constants';

// 빌드 타임 환경 변수로 주입되는 모드
export type FeatureMode = 'FREE' | 'PRO' | 'NORMAL';

// 위젯 타입
export type WidgetType = 'home' | 'lockscreen';

// 위젯 크기
export type WidgetSize = 'small' | 'medium' | 'large';

// Feature Gate 설정
const FREE_LIMITS = {
  homeWidgets: 1,
  lockscreenWidgets: 1,
  canShowSeconds: false,
  // 위젯 크기별 정책
  allowedWidgetSizes: ['small'] as WidgetSize[],
  previewableWidgetSizes: ['small', 'medium', 'large'] as WidgetSize[],
};

const PRO_LIMITS = {
  homeWidgets: Infinity,
  lockscreenWidgets: Infinity,
  canShowSeconds: true,
  // Pro는 모든 크기 사용 가능
  allowedWidgetSizes: ['small', 'medium', 'large'] as WidgetSize[],
  previewableWidgetSizes: ['small', 'medium', 'large'] as WidgetSize[],
};

/**
 * 빌드 타임 모드 가져오기
 * FEATURE_MODE 환경 변수: FREE | PRO | NORMAL (기본값)
 */
function getBuildTimeMode(): FeatureMode {
  const mode = Constants.expoConfig?.extra?.featureMode as FeatureMode | undefined;
  return mode || 'NORMAL';
}

/**
 * Pro 기능이 유효한지 판단
 * 
 * @param purchaseState - 런타임 결제 상태 (true = Pro 구매함)
 * @returns Pro 기능 사용 가능 여부
 */
export function isProEffective(purchaseState: boolean = false): boolean {
  const buildMode = getBuildTimeMode();
  
  // 빌드 타임 override가 있으면 우선 적용
  if (buildMode === 'PRO') return true;
  if (buildMode === 'FREE') return false;
  
  // NORMAL 모드: 런타임 결제 상태를 따름
  return purchaseState;
}

/**
 * 위젯 추가 가능 여부 판단
 * 
 * @param currentHomeCount - 현재 홈 위젯 개수
 * @param currentLockCount - 현재 잠금화면 위젯 개수
 * @param widgetType - 추가하려는 위젯 타입
 * @param purchaseState - 런타임 결제 상태
 * @returns 추가 가능 여부
 */
export function canAddWidget(
  currentHomeCount: number,
  currentLockCount: number,
  widgetType: WidgetType,
  purchaseState: boolean = false
): boolean {
  const isPro = isProEffective(purchaseState);
  const limits = isPro ? PRO_LIMITS : FREE_LIMITS;
  
  if (widgetType === 'home') {
    return currentHomeCount < limits.homeWidgets;
  } else {
    return currentLockCount < limits.lockscreenWidgets;
  }
}

/**
 * 초 단위 카운트다운 표시 가능 여부
 * 
 * @param purchaseState - 런타임 결제 상태
 * @returns 초 단위 표시 가능 여부
 */
export function canShowSeconds(purchaseState: boolean = false): boolean {
  const isPro = isProEffective(purchaseState);
  const limits = isPro ? PRO_LIMITS : FREE_LIMITS;
  return limits.canShowSeconds;
}

/**
 * 위젯 한도 정보 가져오기
 * 
 * @param purchaseState - 런타임 결제 상태
 * @returns 홈/잠금화면 위젯 한도
 */
export function getWidgetLimits(purchaseState: boolean = false): {
  home: number;
  lockscreen: number;
} {
  const isPro = isProEffective(purchaseState);
  const limits = isPro ? PRO_LIMITS : FREE_LIMITS;
  
  return {
    home: limits.homeWidgets,
    lockscreen: limits.lockscreenWidgets,
  };
}

/**
 * Free 제한 사유 가져오기 (업그레이드 모달용)
 */
export type LimitReason = 'widget' | 'seconds' | null;

export function getLimitReason(
  currentHomeCount: number,
  currentLockCount: number,
  attemptType: 'widget' | 'seconds',
  widgetType?: WidgetType,
  purchaseState: boolean = false
): LimitReason {
  const isPro = isProEffective(purchaseState);
  
  // Pro면 제한 없음
  if (isPro) return null;
  
  // 위젯 추가 시도
  if (attemptType === 'widget' && widgetType) {
    const canAdd = canAddWidget(currentHomeCount, currentLockCount, widgetType, purchaseState);
    return canAdd ? null : 'widget';
  }
  
  // 초 단위 표시 시도
  if (attemptType === 'seconds') {
    return canShowSeconds(purchaseState) ? null : 'seconds';
  }
  
  return null;
}

/**
 * 현재 적용 중인 모드 가져오기 (디버깅/로깅용)
 */
export function getCurrentMode(purchaseState: boolean = false): {
  buildMode: FeatureMode;
  effectiveMode: 'FREE' | 'PRO';
} {
  const buildMode = getBuildTimeMode();
  const effectiveMode = isProEffective(purchaseState) ? 'PRO' : 'FREE';
  
  return {
    buildMode,
    effectiveMode,
  };
}

/**
 * 위젯 크기가 미리보기 가능한지 확인
 * Free/Pro 모두 모든 크기 미리보기 가능
 * 
 * @param size - 위젯 크기
 * @param purchaseState - 런타임 결제 상태
 * @returns 미리보기 가능 여부
 */
export function isWidgetSizePreviewable(
  size: WidgetSize,
  purchaseState: boolean = false
): boolean {
  const isPro = isProEffective(purchaseState);
  const limits = isPro ? PRO_LIMITS : FREE_LIMITS;
  return limits.previewableWidgetSizes.includes(size);
}

/**
 * 위젯 크기가 실제 사용 가능한지 확인
 * Free: Small만, Pro: 모두
 * 
 * @param size - 위젯 크기
 * @param purchaseState - 런타임 결제 상태
 * @returns 실제 사용 가능 여부
 */
export function isWidgetSizeUsable(
  size: WidgetSize,
  purchaseState: boolean = false
): boolean {
  const isPro = isProEffective(purchaseState);
  const limits = isPro ? PRO_LIMITS : FREE_LIMITS;
  return limits.allowedWidgetSizes.includes(size);
}

/**
 * 사용 가능한 위젯 크기 목록 가져오기
 * 
 * @param purchaseState - 런타임 결제 상태
 * @returns 사용 가능한 위젯 크기 배열
 */
export function getUsableWidgetSizes(purchaseState: boolean = false): WidgetSize[] {
  const isPro = isProEffective(purchaseState);
  const limits = isPro ? PRO_LIMITS : FREE_LIMITS;
  return limits.allowedWidgetSizes;
}
