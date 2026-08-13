import { useState, useEffect } from 'react';

/**
 * Custom Hook quản lý đếm ngược thời gian giữ phòng (15 phút = 900 giây)
 */
export function useHoldTimer(initialSeconds: number = 900) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return {
    timeLeft,
    formattedTime,
    isExpired,
    isWarning: timeLeft < 180, // Dưới 3 phút đổi sang màu đỏ cảnh báo
  };
}
