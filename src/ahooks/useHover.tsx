import { useRef, useState, useEffect } from "react";
import { MutableRefObject } from "react";

interface Options {
  onEnter?: () => void;
  onLeave?: () => void;
}

type TargetElement = HTMLElement | Element | Document | Window;
export type BasicTarget<T = HTMLElement> =
  | (() => T | null)
  | T
  | null
  | MutableRefObject<T | null | undefined>;

// @utils 根据第一个参数获取DOM实例
export function getTargetElement(
  target?: BasicTarget<TargetElement>,
  defaultElement?: TargetElement
): TargetElement | undefined | null {
  if (!target) {
    return defaultElement;
  }

  let targetElement: TargetElement | undefined | null;

  if (typeof target === "function") {
    targetElement = target();
  } else if ("current" in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
}


export default function useHover<T>(target: BasicTarget, options: Options) {
  const { onEnter, onLeave } = options || {};

  const onEnterRef = useRef(onEnter);
  onEnterRef.current = onEnter;

  const onLeaveRef = useRef(onLeave);
  onLeaveRef.current = onLeave;

  let [isHovering, setIsHovering] = useState(false);
  useEffect(() => {
    const targetElement = getTargetElement(target);
    const onMouseEnter = () => {
      // 这里直接调用onEnter会导致闭包 然后无法拿到最新的函数 因为是去缓存的作用域链去取得 useEffect只执行一次 所以只有第一次useHover传入的onEnter
      // 通过一个ref返回的current对象去拿 是因为外面每次都  onEnterRef.current = onEnter;更新了函数
      if (onEnterRef.current) onEnterRef.current();
      setIsHovering(true);
    };
    const onMouseLeave = () => {
      if (onLeaveRef.current) onLeaveRef.current();
      setIsHovering(false);
    };
    if(targetElement){
        targetElement.addEventListener("mouseenter", onMouseEnter);
        targetElement.addEventListener("mouseleave", onMouseLeave);
        return () => {
          targetElement.removeEventListener("mouseenter", onMouseEnter);
          targetElement.removeEventListener("mouseleave", onMouseLeave);
        };
    }
    // 传入一个回调来获取节点时 需要监听回调是否改变来更新 
    // 因为传入的函数是一个黑盒 不清楚内部是否有state 比如根据状态来选择不同的节点
  }, [typeof target === 'function' ? undefined : target]);
  return isHovering;
}
