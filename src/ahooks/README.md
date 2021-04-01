## ahooks + react-use 源码阅读

对源码的写法以及优化做一点了解，分析写在注释里，如何使用以及Demo直接在开源文档查看即可。

- ahooks：https://ahooks.js.org/zh-CN/hooks/async
- react-use：https://github.com/streamich/react-use

## Ref

凡是接收函数作为参数的 Hook，都需要使用 useref 存储赋值，需要一并处理下。

```TSX

// 持久化 function 的 Hook usePersistFn，可以保证persistFn函数地址永远不会变化
// 在某些场景中，你可能会需要用 useCallback 记住一个回调，
// 但由于内部函数必须经常重新创建，记忆效果不是很好，导致子组件重复 render。
// 对于超级复杂的子组件，重新渲染会对性能造成影响
function usePersistFn<T extends noop>(fn: T) {
  const ref = useRef<any>(() => {
    throw new Error('Cannot call function while rendering.');
  });
  //* 每次更新外部都会重复执行usePersistFn 也就是说会 usePersistFn1(f1) usePersistFn(f2) f1和f2是相同函数被缓存在不同的上下文
  //* ref.current每次都会被fn重新赋值 fn就是最新传入的函数 这样避免面了外部闭包访问以前的值
  ref.current = fn;
  // ref 每次渲染都不会改变-》那么useCallback就不会出现计算 -》persistFn地址也就不变
  // ref.current总是指向最新的fn2，而不是闭包保存的f1
  const persistFn = useCallback(((...args) => ref.current(...args)) as T, [ref]);

  return persistFn;
}

export default usePersistFn;
```

## useState 可以传入函数避免重复创建

```
function Table(props) {
  // ⚠️ createRows() 每次渲染都会被调用
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

为避免重新创建被忽略的初始 state，我们可以传一个 函数 给 useState：

```
function Table(props) {
  // ✅ createRows() 只会被调用一次
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

## useLayoutEffect


与 useEffect 使用方法一样，只是执行回调函数的时机有着略微区别，运行时机更像是 componentDidMount 和 componentDidUpdate。但是要注意的是，该方法是同步方法，在浏览器 paint 之前执行，会阻碍浏览器 paint，只有当我们需要进行DOM的操作时才使用该函数（比如设定 DOM 布局尺寸，这样可以防抖动）。

useLayoutEffect 与 useEffect
正常情况用默认的 useEffect 钩子就够了，这可以保证状态变更不阻塞渲染过程，但如果 effect 更新（清理）中涉及 DOM 更新操作，用 useEffect 就会有意想不到的效果，这时我们最好使用 useLayoutEffect 。

比如逐帧动画 requestAnimationFrame ，要做一个 useRaf hook 就得用上后者，需要保证同步变更。这也符合作者说到的 useEffect的时期是非常晚，可以保证页面是稳定下来再做事情。

钩子的执行顺序：`useLayoutEffect > requestAnimationFrame > useEffect`


```TSX
import React, { useEffect, useLayoutEffect, useState } from "react";
//import Button from "./components/Button";
import Menu from "./components/Menu";
import "./styles/index.scss";

function App() {
  const [elapsed, set] = useState<number>(0);

  useEffect(() => {
    console.log("useEffect 组件渲染完成");
    return () => {
      console.log("useEffect cleanup 组件卸载");
    };
  });

  window.requestAnimationFrame(() => console.log("requestAnimationFrame"));

  useEffect(() => {
    
    console.log("useLayoutEffect");
    window.requestAnimationFrame(() => console.log("requestAnimationFrame1"));
    window.requestAnimationFrame(() => console.log("requestAnimationFrame2"));
    const onFrame = () => {
      const time = performance.now();
      console.log(time+"帧渲染开始")
      console.log("在本帧setSate即在本帧开启组件重新渲染")
      set(time);
      console.log("帧渲染结束+开启下一帧")
      loop();
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const loop = () => {
      requestAnimationFrame(onFrame);
    };
    loop()
    return () => {
      console.log("useLayoutEffect cleanup");
    };
  },[]);
  return <div className="App">-------------{elapsed}</div>;
}

export default App;

// useLayoutEffect
// Hooks.tsx:16 requestAnimationFrame
// Hooks.tsx:21 requestAnimationFrame1
// Hooks.tsx:22 requestAnimationFrame2
// Hooks.tsx:10 useEffect

// loop 打开


// useLayoutEffect
// Hooks.tsx:16 requestAnimationFrame // useLayoutEffect 在useEffect之前
// Hooks.tsx:21 requestAnimationFrame1
// Hooks.tsx:22 requestAnimationFrame2
// Hooks.tsx:25 554.0649999966263帧渲染开始 // requestAnimationFrame的回调优先于useEffect 次于useLayoutEffect
// Hooks.tsx:26 在本帧setSate即在本帧开启组件重新渲染
// Hooks.tsx:10 useEffect 组件渲染完成 
// Hooks.tsx:28 帧渲染结束+开启下一帧 // 这里就告别了useLayoutEffect调度 完全进入requestAnimationFrame的回调 （注意 前面先开启了组件的渲染调度在进入的手动RAF调度，组件的Fiber渲染调度也是基于RAF实现，应该会有注册的先后顺序执行
// Hooks.tsx:12 useEffect cleanup 组件卸载  //  setState后开始清除上一帧的副作用

// Hooks.tsx:10 useEffect 组件渲染完成 // 这里发现useEffect在前面 表明setState发起的调度然后在requestAnimationFrame去调度帧的时候  setState触发组件渲染在前优先级更高
// Hooks.tsx:16 requestAnimationFrame
// Hooks.tsx:25 901.319999997213帧渲染开始
// Hooks.tsx:26 在本帧setSate即在本帧开启组件重新渲染
// Hooks.tsx:28 帧渲染结束+开启下一帧
// Hooks.tsx:12 useEffect cleanup 组件卸载

// Hooks.tsx:10 useEffect 组件渲染完成
// Hooks.tsx:16 requestAnimationFrame
// Hooks.tsx:25 915.6549999970593帧渲染开始
// Hooks.tsx:26 在本帧setSate即在本帧开启组件重新渲染
// Hooks.tsx:28 帧渲染结束+开启下一帧
// Hooks.tsx:12 useEffect cleanup 组件卸载

```