// /**
//  * useRaf useRequestAnimationFrame
//  * @param callback 回调函数
//  * @param startRun 立即执行
//  */
// const useRaf = (callback, startRun = true) => {
//     const requestRef = useRef(); // 储存RequestAnimationFrame返回的id
//     const previousTimeRef = useRef(null); // 每次耗时间隔
  
//     const animate = useCallback((time) => {
//       if (previousTimeRef.current !== undefined) {
//         const deltaTime = time - previousTimeRef.current; // 耗时间隔
//         callback(deltaTime);
//       }
//       previousTimeRef.current = time;
//       requestRef.current = requestAnimationFrame(animate);
//     }, [callback]);
  
//     useEffect(() => {
//       requestRef.current = requestAnimationFrame(animate);
//       return () => cancelAnimationFrame(requestRef.current);
//     }, []);
  
//     const stopRaf = useCallback(() => {
//       if(startRun) cancelAnimationFrame(requestRef.current);
//       requestRef.current = null;
//     }, [animate]);
  
//     const restartRaf = useCallback(() => {
//       if (requestRef.current === null) {
//         requestAnimationFrame(animate);
//       }
//     }, [animate]);
  
//     return [restartRaf, stopRaf];
//   };
  
//   // App.js
//   const App = () => {
//     const [count, setCounter] = useState(0);
//     const run = () => {
//       setCounter(pre => pre + 1);
//     };
//     const [start, stop] = useRaf(() => run());
//     return (
//       <div>
//         <button type="button" onClick={start}>开始</button>
//         <button type="button" onClick={stop}>暂停</button>
//         <h1>{count}</h1>
//       </div>
//     );
//   };
//   该hook接受一个函数作为帧变动的callback，callback接受一个参数，作为距离上次performance.now() 的间隔耗时，通常为16ms上下(意义不大，但可为低配置用户启用优化方案)。hook返回两个控制器，一个用来重启，当然不会将数据重置，另一个用来暂停。

// ps：不要用来操作DOM，如果非得操作，建议改成useLayoutEffect。

// 有了这个hook，相信你就能够轻轻松松做出秒表、倒计时、数字逐帧变动等酷炫组件了。

