import { useState, useEffect } from 'react';

const easing = {
  linear: (n: number) => n,
  elastic: (n: number) =>
    n * (33 * n * n * n * n - 106 * n * n * n + 126 * n * n - 67 * n + 15),
  inExpo: (n: number) => Math.pow(2, 10 * (n - 1)),
};

type TEasingName = keyof typeof easing;

// 只能在初始化渲染的时候使用 进入时渲染动画
export default function useAnimation(
  duration: number = 500,
  delay: number = 0,
  easingName: TEasingName = 'linear',
) {
  const elapsed = useAnimationTimer(duration, delay);
  const n: number = Math.min(1, elapsed / duration);
  return easing[easingName](n);
}

export function useAnimationTimer(duration = 1000, delay = 0) {
  const [elapsed, setTime] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    let timerStop: NodeJS.Timeout;
    let start: number;
    function onFrame() {
      setTime(Date.now() - start);
      loop();
    }
    function loop() {
      animationFrame = requestAnimationFrame(onFrame);
    }

    function onStart() {
      timerStop = setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        setTime(Date.now() - start);
      }, duration);
      start = Date.now();
      loop();
    }
    const timerDelay = setTimeout(onStart, delay);
    return () => {
      clearTimeout(timerStop);
      clearTimeout(timerDelay);
      cancelAnimationFrame(animationFrame);
    };
  }, [duration, delay]);

  return elapsed;
}
