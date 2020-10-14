import { useEffect, useState } from "react";
import { BasicTarget, getTargetElement } from "./utils/dom";

interface Position {
  left: number;
  top: number;
}
export type Target = BasicTarget<HTMLElement | Document>;
function useScroll(target?: Target): Position {
  const [position, setPosition] = useState<Position>({
    left: NaN,
    top: NaN,
  });

  useEffect(() => {
    const el = getTargetElement(target, document);
    if (!el) return;
    function updatePosition(currentTarget: EventTarget) {
      let newPosition;
      // 如果当前滑动的对象是整个文档对象就用scrollingElement
      if (currentTarget === document) {
        if (!document.scrollingElement) return;
        newPosition = {
          left: document.scrollingElement.scrollLeft,
          top: document.scrollingElement.scrollTop,
        };
      } else {
        // 只是在某个div内的滑动可以直接用事件对象的scrollLeft
        newPosition = {
          left: (currentTarget as HTMLElement).scrollLeft,
          top: (currentTarget as HTMLElement).scrollTop,
        };
      }
      setPosition(newPosition);
    }
    updatePosition(el as EventTarget); //? 这里是用来初始化的？

    function listener(event: Event) {
      if (!event.target) return; //? 这边判断的必要性
      updatePosition(event.target);
    }
    el.addEventListener("scroll", listener);

    return () => {
      el.removeEventListener("scroll", listener);
    };
  }, [target]);
  return position;
}

export default useScroll;
