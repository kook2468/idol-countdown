module.exports = ({ config }) => {
  // 빌드 타임 Feature Mode 주입
  const featureMode = process.env.FEATURE_MODE || 'NORMAL';
  
  return {
    ...config,
    extra: {
      ...config.extra,
      featureMode: featureMode,
      eas: {
        projectId: config.extra?.eas?.projectId,
      },
    },
  };
};
