# 수익 구조 개편 완료 보고서

## ✅ 완료된 작업

### 1. FeatureGate 레이어 구축
- **JS**: `/shared/feature/featureGate.ts` 생성
- **Swift**: `/ios/idolcountdown/FeatureGate.swift` 생성
- 빌드 타임 모드(FREE/PRO/NORMAL)와 런타임 결제 상태를 통합 관리
- API:
  - `isProEffective(purchaseState)`: Pro 기능 활성화 여부
  - `canAddWidget(counts, type, purchaseState)`: 위젯 추가 가능 여부
  - `canShowSeconds(purchaseState)`: 초 단위 표시 가능 여부

### 2. 수익 정책 변경
#### ✅ Custom 아티스트/이벤트 생성: Free에서도 가능
- `constants/types.ts`: ARTIST_PRESETS, EVENT_TYPE_PRESETS에서 `isPro: true` 플래그 제거
- `components/AddEventModal.tsx`:
  - Custom 선택 시 Pro 업그레이드 강제 로직 제거
  - Lock 아이콘 표시 제거
  - Custom 입력 필드 조건을 `isPro &&` 제거하여 항상 표시

#### ✅ 위젯 제한 정책 (코드 준비 완료, UI 연결 필요)
- Free: 홈 1개 + 잠금화면 1개
- Pro: 무제한
- FeatureGate에 `canAddWidget()` API 구현 완료

#### ✅ 초 단위 카운트다운 정책 (코드 준비 완료, UI 연결 필요)
- Free: 분 단위까지만
- Pro: 초 단위 가능
- FeatureGate에 `canShowSeconds()` API 구현 완료

### 3. Pro 업그레이드 모달 문구 개편
- **신규 파일**: `constants/proCopy.ts` - 모든 문구 상수화 (A/B 테스트 대비)
- **업데이트**: `components/ProModal.tsx`
  - 새 문구 적용:
    - Title: "PRO로 업그레이드"
    - Subtitle: "덕질의 디테일을 완성해보세요"
    - Benefits:
      1. "홈 & 잠금화면 위젯 무제한"
      2. "컴백 순간까지 초 단위 카운트"
      3. "아티스트별 컬러 커스터마이징"
    - Price: "단 한 번 결제로 평생 사용 / ₩4,900"
  - "구매 복원" 버튼 추가
  - `limitReason` prop 추가 (제한 사유별 맞춤 안내)

### 4. 빌드 타임 모드 제어
#### ✅ yarn 명령어 추가 (`package.json`)
```json
"ios:free": "FEATURE_MODE=FREE expo run:ios"
"ios:pro": "FEATURE_MODE=PRO expo run:ios"
```

#### ✅ 환경 변수 주입 (`app.config.js` 신규 생성)
- `process.env.FEATURE_MODE`를 Expo Config의 `extra.featureMode`로 주입
- JS: `Constants.expoConfig.extra.featureMode`로 읽기
- iOS: Info.plist의 `FEATURE_MODE`로 주입 (Swift에서 읽기)

### 5. app/index.tsx 리팩토링
- FeatureGate import 및 적용
- `effectiveIsPro = isProEffective(userSettings.isPro)` 계산
- PRO 배지 표시를 `effectiveIsPro` 기반으로 변경
- ProModal에 `limitReason` prop 전달 구조 변경

---

## 🚧 추가 작업 필요 항목

### 1. 위젯 추가 버튼에 제한 로직 연결
**위치**: `app/index.tsx` - "위젯 미리보기" 버튼 클릭 시

```tsx
const handleShowWidgetPreview = () => {
  // TODO: 현재 위젯 개수 체크
  const homeWidgetCount = 0; // UserDefaults에서 읽기
  const lockWidgetCount = 0; // UserDefaults에서 읽기
  
  // 홈 위젯 한도 체크 (예시)
  if (!canAddWidget(homeWidgetCount, lockWidgetCount, 'home', userSettings.isPro)) {
    handleShowProModal('widget');
    return;
  }
  
  setWidgetPreviewOpen(true);
};
```

### 2. CountdownCard/WidgetPreview에서 초 단위 표시 제어
**위치**: `components/CountdownCard.tsx`, `components/WidgetPreview.tsx`

```tsx
import { canShowSeconds } from '../shared/feature/featureGate';

// 렌더링 시:
const showSeconds = canShowSeconds(isPro);
const timeDisplay = showSeconds 
  ? `${days}D ${hours}:${minutes}:${seconds}` 
  : `${days}D ${hours}:${minutes}`;
```

### 3. Widget Extension (Swift)에서 FeatureGate 사용
**위치**: `ios/HomeSmallWidget/HomeSmallWidget.swift`

```swift
import SwiftUI

struct HomeSmallWidget: Widget {
    var body: some WidgetConfiguration {
        // UserDefaults에서 purchaseState 읽기
        let isPro = UserDefaults.standard.bool(forKey: "isPro")
        let canShowSec = FeatureGate.canShowSeconds(purchaseState: isPro)
        
        // Timeline에서 초 단위 업데이트 여부 결정
    }
}
```

### 4. iOS Info.plist에 FEATURE_MODE 주입
**파일**: `ios/idolcountdown/Info.plist`

Expo EAS Build 또는 Xcode Build Settings에서 환경 변수를 Info.plist로 주입해야 합니다.

**방법 1 - Xcode Build Settings (권장)**:
1. Xcode에서 프로젝트 열기
2. Target > Build Settings > User-Defined 섹션
3. `+` 클릭 → `FEATURE_MODE` 추가
4. Debug/Release에 따라 값 설정 (FREE/PRO/NORMAL)
5. Info.plist에 `<key>FEATURE_MODE</key><string>$(FEATURE_MODE)</string>` 추가

**방법 2 - EAS Build**:
`eas.json`에 환경 변수 추가

### 5. Widget 개수 추적 로직 구현
**필요한 작업**:
- UserDefaults에 현재 위젯 개수 저장 (`homeWidgetCount`, `lockscreenWidgetCount`)
- 위젯 추가/삭제 시 카운트 업데이트
- JS ↔ Swift 간 UserDefaults 공유 (App Group 사용)

**파일**: 
- `ios/idolcountdown/AppDelegate.swift`: App Group 설정
- `shared/storage/widgetStorage.ts`: JS에서 위젯 개수 읽기/쓰기

### 6. 데이터 마이그레이션 (기존 유저 대응)
Free 유저가 이미 2개 이상의 위젯을 만들어둔 경우:

```tsx
useEffect(() => {
  const migrateWidgets = async () => {
    const homeCount = await getHomeWidgetCount();
    const lockCount = await getLockscreenWidgetCount();
    const limits = getWidgetLimits(userSettings.isPro);
    
    // Free 한도 초과 시 경고 또는 비활성화
    if (homeCount > limits.home) {
      // Option 1: 경고만 표시
      Alert.alert('알림', 'Free 버전은 홈 위젯 1개까지만 지원됩니다.');
      
      // Option 2: 초과분 비활성화 (UX 고려 필요)
      // disableExcessWidgets();
    }
  };
  
  migrateWidgets();
}, []);
```

### 7. 분석 이벤트 추가 (추후 작업)
```tsx
// constants/analytics.ts
export const trackProModalShown = (reason: LimitReason) => {
  // Firebase Analytics, Amplitude 등
  logEvent('pro_modal_shown', { reason });
};

export const trackUpgradeClicked = () => {
  logEvent('upgrade_button_clicked');
};

export const trackModalDismissed = (reason: LimitReason) => {
  logEvent('pro_modal_dismissed', { reason });
};
```

---

## 📋 테스트 체크리스트

### Free 모드 테스트 (`yarn ios:free`)
- [ ] Custom 아티스트 선택 가능 (Lock 아이콘 없음)
- [ ] Custom 이벤트 선택 가능
- [ ] PRO 배지에 "Free" 표시
- [ ] 위젯 추가 시 1개 초과 시 업그레이드 모달
- [ ] 초 단위 카운트 미표시 (분 단위까지만)
- [ ] 업그레이드 모달 문구 확인

### Pro 모드 테스트 (`yarn ios:pro`)
- [ ] PRO 배지에 "PRO" 표시 (황금색 그라데이션)
- [ ] 위젯 무제한 추가 가능
- [ ] 초 단위 카운트 표시
- [ ] PRO 배지 클릭 시 토글 가능 (개발 모드)

### Normal 모드 테스트 (`yarn ios`)
- [ ] 결제 상태 없으면 Free와 동일
- [ ] 결제 상태 true면 Pro와 동일

---

## 🔧 다음 단계 권장 사항

1. **즉시**: 위젯 개수 추적 로직 구현 (가장 중요)
2. **즉시**: CountdownCard에서 초 단위 표시 제어
3. **빌드 전**: iOS Info.plist FEATURE_MODE 주입 설정
4. **빌드 후**: 실제 기기에서 Free/Pro 모드 테스트
5. **릴리즈 전**: 데이터 마이그레이션 로직 구현
6. **릴리즈 후**: 분석 이벤트 추가 및 전환율 모니터링

---

## 📌 중요 파일 목록

### 신규 생성
- `shared/feature/featureGate.ts` - JS FeatureGate
- `ios/idolcountdown/FeatureGate.swift` - Swift FeatureGate
- `constants/proCopy.ts` - Pro 업그레이드 문구
- `app.config.js` - 환경 변수 주입

### 주요 수정
- `package.json` - yarn scripts 추가
- `constants/types.ts` - isPro 플래그 제거
- `components/AddEventModal.tsx` - Custom 제한 제거
- `components/ProModal.tsx` - 문구 및 UI 개편
- `app/index.tsx` - FeatureGate 적용

### 작업 필요
- `components/CountdownCard.tsx` - 초 단위 제어 추가
- `components/WidgetPreview.tsx` - 초 단위 제어 추가
- `ios/HomeSmallWidget/HomeSmallWidget.swift` - FeatureGate 사용
- `ios/idolcountdown/Info.plist` - FEATURE_MODE 추가

---

## 💡 Tips

### A/B 테스트 준비
`constants/proCopy.ts`를 실험 플래그로 교체:
```tsx
export const PRO_UPGRADE_COPY = useExperimentFlag('pro_copy_v2', DEFAULT_COPY);
```

### 결제 모듈 연동 시
```tsx
// components/ProModal.tsx
const handleUpgrade = async () => {
  try {
    const result = await InAppPurchase.purchasePro();
    if (result.success) {
      setUserSettings(prev => ({ ...prev, isPro: true }));
      await AsyncStorage.setItem('purchaseState', 'true');
      onClose();
    }
  } catch (error) {
    Alert.alert('오류', '구매에 실패했습니다.');
  }
};
```

### 위젯 개수 동기화 (App Group)
```swift
// AppDelegate.swift
let sharedDefaults = UserDefaults(suiteName: "group.com.yourapp.idol-countdown")
sharedDefaults?.set(homeWidgetCount, forKey: "homeWidgetCount")
```

```tsx
// JS (react-native-shared-group-preferences 사용)
import SharedGroupPreferences from 'react-native-shared-group-preferences';

const getWidgetCount = async () => {
  const count = await SharedGroupPreferences.getItem(
    'homeWidgetCount',
    'group.com.yourapp.idol-countdown'
  );
  return parseInt(count || '0');
};
```
