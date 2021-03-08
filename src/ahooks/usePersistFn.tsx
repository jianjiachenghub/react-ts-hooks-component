import { useCallback, useRef, useEffect } from 'react';

export type noop = (...args: any[]) => any;

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

// 下面是React官网的一种实现
function useEventCallback(fn: any, dependencies: any) {
    const ref = useRef(() => {
      throw new Error('Cannot call an event handler while rendering.');
    });
    
    // 这边只是通过依赖变化来更新fn，上面的实现默认每次更新都去更新fn
    useEffect(() => {
      ref.current = fn;
    }, [fn, ...dependencies]);
  
    return useCallback(() => {
      const fn = ref.current;
      return fn();
    }, [ref]);
  }

/*   function Form() {
    const [text, updateText] = useState('');
    // 即便 `text` 变了也会被记住:
    const handleSubmit = useEventCallback(() => {
      alert(text);
    }, [text]);
  
    return (
      <>
        <input value={text} onChange={e => updateText(e.target.value)} />
        <ExpensiveTree onSubmit={handleSubmit} />
      </>
    );
  } */