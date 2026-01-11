import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function useCountdown(targetDate: string, realtime: boolean = false) {
  const calculateTimeLeft = (target: string): TimeLeft => {
    const now = new Date();
    const targetDateTime = new Date(target);
    
    // 전체 시간 차이 (밀리초)
    const diffTime = targetDateTime.getTime() - now.getTime();
    const isPast = diffTime < 0;
    
    // 날짜만 비교 (D-Day 계산용)
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDateOnly = new Date(targetDateTime.getFullYear(), targetDateTime.getMonth(), targetDateTime.getDate());
    const dateDiff = targetDateOnly.getTime() - nowDate.getTime();
    const daysDiff = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
    
    let days: number;
    if (isPast) {
      // 과거: 오늘이면 0, 어제면 -1, 그제면 -2... (음수로 반환)
      days = daysDiff === 0 ? 0 : daysDiff;
    } else {
      // 미래: D-0, D-1, D-2...
      days = daysDiff;
    }
    
    // 시/분/초는 미래일 때만 계산
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    
    if (!isPast) {
      hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
    }
    
    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    // targetDate가 변경되면 즉시 재계산
    setTimeLeft(calculateTimeLeft(targetDate));

    if (!realtime) return;

    // realtime 모드일 때만 1초마다 업데이트
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, realtime]);

  return timeLeft;
}
