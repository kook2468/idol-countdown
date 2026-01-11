/**
 * Pro 업그레이드 관련 문구 상수
 * A/B 테스트를 위해 쉽게 교체 가능하도록 분리
 */

export const PRO_UPGRADE_COPY = {
  title: 'PRO로 업그레이드',
  subtitle: '덕질의 디테일을 완성해보세요',
  
  benefits: [
    {
      icon: 'apps' as const,
      title: '홈 & 잠금화면 위젯 무제한',
      description: '원하는 만큼 위젯을 추가하고 관리하세요',
    },
    {
      icon: 'time' as const,
      title: '컴백 순간까지 초 단위 카운트',
      description: '더욱 정밀한 카운트다운으로 특별한 순간을 놓치지 마세요',
    },
    {
      icon: 'color-palette' as const,
      title: '아티스트별 컬러 커스터마이징',
      description: '최애의 색으로 나만의 위젯을 꾸며보세요',
    },
  ],
  
  priceLabel: '단 한 번 결제로 평생 사용',
  priceAmount: '₩4,900',
  
  buttons: {
    upgrade: 'PRO로 업그레이드',
    later: '나중에',
    restore: '구매 복원',
  },
  
  alerts: {
    purchaseDemo: {
      title: '알림',
      message: 'PRO 버전 구매 기능은 곧 추가됩니다.',
    },
    restoreSuccess: {
      title: '복원 완료',
      message: 'PRO 버전이 복원되었습니다.',
    },
    restoreFailed: {
      title: '복원 실패',
      message: '복원할 구매 내역이 없습니다.',
    },
  },
};

/**
 * Feature별 설명 (특정 기능 제한에 걸렸을 때)
 */
export const FEATURE_LIMIT_INFO = {
  widget: {
    title: '위젯 제한',
    description: 'Free 버전은 홈/잠금화면 기본 위젯만 사용 가능합니다.',
    icon: 'apps' as const,
  },
  seconds: {
    title: '초 단위 카운트',
    description: 'Free 버전은 분 단위까지만 표시됩니다. 초 단위 카운트는 PRO 전용 기능입니다.',
    icon: 'time' as const,
  },
};

/**
 * Empty State 문구 (Free/Pro 모드별)
 */
export const EMPTY_STATE_COPY = {
  free: {
    title: '등록된 이벤트가 없습니다',
    subtitle: '초 단위 카운트다운으로 특별한 순간을 기록하세요',
    proPreview: {
      title: 'PRO 기능',
      subtitle: '컴백 순간까지 초 단위로 함께하세요',
      features: [
        '초 단위 카운트다운',
        '홈 & 잠금화면 위젯 무제한',
        '아티스트별 컬러 커스터마이징',
      ],
    },
    cta: {
      primary: '이벤트 추가',
      secondary: 'PRO 자세히 보기',
    },
    freePlanLabel: '기본 기능 사용 중',
  },
  pro: {
    title: '새로운 이벤트를 추가하세요',
    subtitle: '컴백 순간까지, 초 단위로 함께하세요',
    features: [
      { icon: 'time-outline', label: '초 단위' },
      { icon: 'apps-outline', label: '위젯 무제한' },
      { icon: 'color-palette-outline', label: '컬러 커스텀' },
    ],
  },
};
