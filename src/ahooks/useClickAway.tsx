import { useEffect, useRef } from 'react';
import { BasicTarget, getTargetElement } from './utils/dom';

// 鼠标点击事件，click 不会监听右键
const defaultEvent = 'click';

type EventType = MouseEvent | TouchEvent;

export default function useClickAway(
  onClickAway: (event: EventType) => void,
  target: BasicTarget | BasicTarget[], // 可能是一个节点或节点列表 也可能是一个获取他们的函数 所以需要使用工具函数来获取最终结果
  eventName: string = defaultEvent,
) {

  // ahooks规范 最好持久化且每次都赋值更新一下 防止闭包
  const onClickAwayRef = useRef(onClickAway);
  onClickAwayRef.current = onClickAway;

  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    const handler = (event: any) => {
      // 判断是否是多个节点
      const targets = Array.isArray(targetRef.current) ? targetRef.current : [targetRef.current];
      if (
        // 多个节点时 只要有一个（some）被点中就不会 触发回调 
        targets.some((targetItem) => {
          const targetElement = getTargetElement(targetItem) as HTMLElement;
           // 一个一个去取节点 然后只要有一个节点包含了我们的事件节点即表明点击在inside，而不是away 
          return !targetElement || targetElement?.contains(event.target);
        })
      ) {
        return;
      }
      // 触发回调
      onClickAwayRef.current(event);
    };
    // 事件处理
    document.addEventListener(eventName, handler);

    return () => {
      document.removeEventListener(eventName, handler);
    };
  }, [eventName]);
}
