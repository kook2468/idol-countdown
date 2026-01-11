# Xcode Build Settings 설정 가이드

## FEATURE_MODE 환경 변수 설정

Info.plist에 `$(FEATURE_MODE)` 변수를 추가했으므로, Xcode Build Settings에서 이 값을 정의해야 합니다.

### 1. Xcode에서 프로젝트 열기

```bash
cd ios
open idolcountdown.xcworkspace
```

### 2. Build Settings에 User-Defined Variable 추가

1. **프로젝트 네비게이터**에서 `idolcountdown` (프로젝트 루트) 클릭
2. **TARGETS** 섹션에서 `idolcountdown` 선택
3. **Build Settings** 탭 클릭
4. 검색창 옆 **"+ Add User-Defined Setting"** 버튼 클릭
5. 변수 이름: `FEATURE_MODE` 입력

### 3. Configuration별 값 설정

`FEATURE_MODE` 행에서:

- **Debug**: `NORMAL` (기본값 - 런타임 결제 상태를 따름)
- **Release**: `NORMAL` (앱스토어 릴리즈는 런타임 결제 기반)

특정 빌드에서 강제로 Free/Pro 모드를 적용하려면:
- 테스트용 Debug: `FREE` 또는 `PRO`
- 스크린샷/마케팅용: `PRO`

### 4. 다른 방법: Scheme 기반 설정

더 세밀한 제어가 필요하다면:

1. **Product > Scheme > Edit Scheme...** 메뉴
2. **Run** 선택
3. **Arguments** 탭
4. **Environment Variables** 섹션에서 `+` 클릭
5. Name: `FEATURE_MODE`, Value: `FREE` 또는 `PRO` 또는 `NORMAL`

이 방법은 Xcode에서 직접 실행할 때만 적용됩니다.

### 5. 확인 방법

빌드 후 앱 실행:
- PRO 배지가 "Free" 또는 "PRO"로 표시되는지 확인
- Swift 코드에서 디버깅:

```swift
// AppDelegate.swift
func application(_ application: UIApplication, ...) {
    let mode = Bundle.main.object(forInfoDictionaryKey: "FEATURE_MODE") as? String
    print("🎯 FEATURE_MODE:", mode ?? "nil")
    print("🎯 Is Pro Effective:", FeatureGate.isProEffective(purchaseState: false))
}
```

---

## Widget Extension에도 동일 설정 필요

Widget Extension도 동일한 Info.plist 설정과 Build Settings가 필요합니다:

1. **TARGETS** 섹션에서 `HomeSmallWidgetExtension` 선택
2. 위와 동일한 방법으로 `FEATURE_MODE` User-Defined Setting 추가
3. Debug/Release 값 동일하게 설정

---

## 자동화 스크립트 (선택)

매번 Xcode에서 변경하기 번거롭다면 빌드 스크립트 자동화:

### scripts/set-feature-mode.sh

```bash
#!/bin/bash

MODE=${1:-NORMAL}
PLIST_PATH="ios/idolcountdown/Info.plist"

/usr/libexec/PlistBuddy -c "Set :FEATURE_MODE $MODE" "$PLIST_PATH"

echo "✅ FEATURE_MODE set to: $MODE"
```

### package.json에 추가

```json
"scripts": {
  "set-mode:free": "bash scripts/set-feature-mode.sh FREE",
  "set-mode:pro": "bash scripts/set-feature-mode.sh PRO",
  "set-mode:normal": "bash scripts/set-feature-mode.sh NORMAL"
}
```

### 사용 예시

```bash
yarn set-mode:free
yarn ios
```

---

## Troubleshooting

### "FEATURE_MODE 변수가 nil"
- Xcode Build Settings에 변수 추가 확인
- Clean Build Folder (Cmd+Shift+K) 후 재빌드
- Info.plist에 `$(FEATURE_MODE)` 문법 확인

### "PRO 배지가 항상 Free"
- `app.config.js`가 제대로 로드되는지 확인
- `expo prebuild` 실행 후 재시도
- JS 코드에서 디버깅:
  ```tsx
  console.log('Feature Mode:', Constants.expoConfig?.extra?.featureMode);
  console.log('Effective Pro:', isProEffective(userSettings.isPro));
  ```

### Widget에서 모드가 적용 안됨
- Widget Extension의 Build Settings에도 `FEATURE_MODE` 추가 필요
- Widget과 App이 같은 App Group을 공유하는지 확인
