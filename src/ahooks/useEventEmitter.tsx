import { useRef, useEffect } from 'react';
type Subscription<T> = (val: T) => void;

export class EventEmitter<T> {

  // 收集依赖的集合 里面全部存的是订阅的回调函数
  private subscriptions = new Set<Subscription<T>>();
  emit = (val: T) => {
    for (const subscription of this.subscriptions) {
      subscription(val);
    }
  };
  // 添加订阅函数
  useSubscription = (callback: Subscription<T>) => {
    const callbackRef = useRef<Subscription<T>>();
    callbackRef.current = callback;
    // useSubscription 会在组件创建时自动注册订阅，并在组件销毁时自动取消订阅。
    useEffect(() => {
      // 订阅是一个副作用的过程 需要放到effect里 就好比ajax请求那些 内部函数是一个黑盒 不知道会干什么
      function subscription(val: T) {
        if (callbackRef.current) {
          callbackRef.current(val);
        }
      }
      this.subscriptions.add(subscription);
      return () => {
        this.subscriptions.delete(subscription);
      };
    }, []);
  }
}

// 适合的是在距离较远的组件之间进行事件通知，或是在多个组件之间共享事件通知。
export default function useEventEmitter<T = void>() {
  const ref = useRef<EventEmitter<T>>();
  if (!ref.current) {
    // 每次渲染调用 useEventEmitter 得到的返回值会保持不变，不会重复创建 EventEmitter 的实例。
    ref.current = new EventEmitter();
  }
  return ref.current;
}
