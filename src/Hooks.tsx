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
