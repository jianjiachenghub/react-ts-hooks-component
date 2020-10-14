// import { useState, useLayoutEffect } from 'react';
// 反应动画钩子，强制组件重新呈现在每个requestAnimationFrame上，返回经过的时间的百分比。
// const useRaf = (ms: number = 1e12, delay: number = 0): number => {
//   const [elapsed, set] = useState<number>(0);

//   useLayoutEffect(() => {
//     let raf;
//     let timerStop;
//     let start;

//     const onFrame = () => {
//       const time = Math.min(1, (Date.now() - start) / ms);
//       set(time);
//       loop();
//     };
//     const loop = () => {
//       raf = requestAnimationFrame(onFrame);
//     };
//     const onStart = () => {
//       timerStop = setTimeout(() => {
//         cancelAnimationFrame(raf);
//         set(1);
//       }, ms);
//       start = Date.now();
//       loop();
//     };
//     const timerDelay = setTimeout(onStart, delay);

//     return () => {
//       clearTimeout(timerStop);
//       clearTimeout(timerDelay);
//       cancelAnimationFrame(raf);
//     };
//   }, [ms, delay]);

//   return elapsed;
// };

// export default useRaf;

import { useEffect } from 'react';
import usePersistFn from './usePersistFn';

const useMount = (fn: any) => {
  //? 为什么需要持久化函数 react-use库里都没有使用
  const fnPersist = usePersistFn(fn);

  useEffect(() => {
    if (fnPersist && typeof fnPersist === 'function') {
      fnPersist();
    }
  }, []);
};

export default useMount;
