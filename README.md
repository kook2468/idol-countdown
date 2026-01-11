# 🎤 아이돌 카운트다운

> 좋아하는 아이돌의 컴백, 생일, 공연까지 남은 시간을 실시간으로 확인하세요!

iOS 홈 화면 위젯과 초 단위 카운트다운을 지원하는 React Native + Expo 앱입니다.

## ✨ 주요 기능

### � 핵심 기능
- **실시간 카운트다운**: D-Day와 시:분:초 단위로 남은 시간 표시
- **iOS 홈 위젯**: Small/Medium/Large 크기의 네이티브 위젯 지원
- **커스텀 이벤트**: 아티스트, 이벤트 타입, 색상, 이모지 자유롭게 설정
- **이벤트 관리**: 추가, 수정, 삭제 및 날짜순 자동 정렬

### 💎 Pro 기능
- **초 단위 카운트다운**: Free는 일 단위만, Pro는 시:분:초까지
- **무제한 위젯**: Free는 위젯 사용 불가, Pro는 모든 크기 위젯 사용 가능
- **프리미엄 테마**: 다양한 색상 및 디자인 옵션

## 🎨 디자인 특징

- **iOS 네이티브 스타일**: iOS Human Interface Guidelines 준수
- **시스템 통합 디자인**: 카드형 리스트, iOS 세그먼트 컨트롤 등
- **실시간 업데이트**: moti 라이브러리를 활용한 부드러운 애니메이션
- **다크 모드 지원**: 위젯 미리보기는 실제 홈/잠금화면 느낌

## 🛠️ 기술 스택

### Frontend
- **React Native**: 크로스 플랫폼 모바일 앱 프레임워크
- **Expo SDK 54**: 빌드 및 배포 도구
- **TypeScript**: 타입 안전성
- **Moti**: React Native 애니메이션 라이브러리

### iOS Native
- **Swift + SwiftUI**: 네이티브 홈 위젯 구현
- **WidgetKit**: iOS 위젯 프레임워크
- **TimelineProvider**: 1분마다 자동 업데이트

### 상태 관리
- **React Hooks**: useState, useEffect, custom hooks
- **AsyncStorage**: 로컬 데이터 저장
- **Context API**: Pro 모달 전역 상태 관리

## 📦 프로젝트 구조

```
idol-countdown/
├── app/                          # 앱 화면
│   ├── index.tsx                 # 메인 화면 (이벤트 목록)
│   ├── _layout.tsx               # 루트 레이아웃
│   └── (tabs)/                   # 탭 네비게이션 (향후 확장)
├── components/                   # 재사용 컴포넌트
│   ├── CountdownCard.tsx         # 이벤트 카드
│   ├── AddEventModal.tsx         # 이벤트 추가/수정 모달
│   ├── ProModal.tsx              # Pro 업그레이드 모달
│   ├── WidgetPreview.tsx         # 위젯 미리보기 (Small/Medium/Large)
│   ├── WidgetPreviewModal.tsx    # 위젯 상세 미리보기
│   └── ArtistPresetSelector.tsx  # 아티스트 프리셋 선택
├── constants/                    # 상수 및 타입
│   ├── types.ts                  # TypeScript 타입 정의
│   ├── proCopy.ts                # Pro 기능 카피라이팅
│   └── theme.ts                  # 디자인 시스템
├── contexts/                     # Context API
│   └── ProModalContext.tsx       # Pro 모달 전역 상태
├── hooks/                        # Custom Hooks
│   ├── use-countdown.ts          # 카운트다운 계산 로직
│   └── use-color-scheme.ts       # 다크모드 감지
├── shared/                       # 공유 로직
│   └── feature/
│       └── featureGate.ts        # Free/Pro 기능 분기
├── ios/                          # iOS 네이티브 코드
│   ├── HomeSmallWidget/          # 홈 위젯 Extension
│   │   └── HomeSmallWidget.swift # 위젯 구현 (Small/Medium/Large)
│   └── idolcountdown/            # 메인 앱
│       └── FeatureGate.swift     # 네이티브 기능 게이트
└── docs/                         # 문서
    ├── REFACTOR_SUMMARY.md       # 리팩토링 히스토리
    └── XCODE_SETUP.md            # Xcode 설정 가이드
```

## 🚀 시작하기

### 요구사항
- Node.js 18+ 
- Yarn 또는 npm
- Xcode 15+ (iOS 개발)
- macOS (iOS 빌드용)

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd idol-countdown

# 의존성 설치
yarn install

# iOS Pods 설치
cd ios && pod install && cd ..
```

### 개발 모드 실행

```bash
# Metro bundler 시작
yarn start

# iOS 시뮬레이터 (Free 모드)
yarn ios:free

# iOS 시뮬레이터 (Pro 모드)
yarn ios:pro
```

### 빌드 스크립트

- `yarn start`: Metro bundler 시작
- `yarn ios:free`: Free 모드로 iOS 앱 실행
- `yarn ios:pro`: Pro 모드로 iOS 앱 실행
- `yarn reset-project`: 프로젝트 초기화

## 📱 iOS 위젯 설정

### 위젯 사용법
1. iOS 시뮬레이터/기기에서 앱 실행
2. 홈 화면 길게 누르기 → 편집 모드 진입
3. 왼쪽 상단 `+` 버튼 → "아이돌 카운트다운" 검색
4. Small/Medium/Large 크기 선택 후 추가

### 위젯 크기별 특징
- **Small (150x150)**: D-Day 중심, 간결한 정보
- **Medium (300x150)**: 이벤트 정보 + 시:분:초 카운트다운
- **Large (300x300)**: 대형 D-Day + 상세 카운트다운

## 🎯 Free vs Pro

| 기능 | Free | Pro |
|------|------|-----|
| 이벤트 추가 | ✅ | ✅ |
| D-Day 계산 (일 단위) | ✅ | ✅ |
| 초 단위 카운트다운 | ❌ | ✅ |
| 홈 위젯 | ❌ | ✅ |
| 잠금화면 위젯 | ❌ | ✅ |
| 커스텀 아티스트/이벤트 | ✅ | ✅ |
| 프리미엄 테마 | ❌ | ✅ |

## 🔧 개발 환경 설정

### FeatureGate 시스템
Pro 기능을 테스트하려면 `shared/feature/featureGate.ts`를 수정:

```typescript
export function isProEffective(isPro: boolean): boolean {
  // 개발 중 Pro 모드 강제 활성화
  return true; // 또는 isPro
}
```

### Xcode Scheme 설정
- `idolcountdown-free`: Free 모드 빌드
- `idolcountdown-pro`: Pro 모드 빌드

자세한 내용은 [XCODE_SETUP.md](./docs/XCODE_SETUP.md) 참고

## 📖 문서

- [리팩토링 요약](./docs/REFACTOR_SUMMARY.md): 주요 코드 변경 이력
- [Xcode 설정 가이드](./docs/XCODE_SETUP.md): iOS 네이티브 개발 설정
- [수익 구조 리팩토링](./REVENUE_STRUCTURE_REFACTOR.md): Free/Pro 정책 설계

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: `#F472B6` (핑크) → `#C084FC` (퍼플) 그라데이션
- **Accent**: 이벤트별 커스텀 색상
- **Text**: `#1F2937` (다크 그레이)
- **Secondary**: `#6B7280` (미디엄 그레이)
- **Background**: `#FFFFFF` (화이트), `#F9FAFB` (라이트 그레이)

### 타이포그래피
- iOS San Francisco 폰트 기반
- 다양한 font-weight (400~700)
- letter-spacing 미세 조정으로 가독성 향상

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 📮 문의

프로젝트 관련 문의사항이 있으시면 Issue를 생성해주세요.

---

**Made with ❤️ for K-pop fans**

