import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import useCreation from "./useCreation";

interface DebounceOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}

type Fn = (...args: any) => any;

function useDebounceFn<T extends Fn>(fn: T, options?: DebounceOptions) {
  // 外层组件重复更新状态 useDebounceFn是要被重复调用的 但又希望内部不执行过多重复的逻辑 所以会大量采用useRef
  // 要被防抖的fn函数引用一直在变 这里存储下  
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  // wait不存在通过非空运算符转化为1000
  const wait = options?.wait ?? 1000;

  // 如果直接将debounce放到外面，其他state每次更新都会重新执行debounce内部的逻辑，然后返回防抖的函数，浪费了大量资源
  // 所以需要把创建的逻辑放到一个不重复执行的地方 useCreate内部就是干这个的 不产生多余的副作用
  const debounced = useCreation(() => {
    return debounce<T>(
      ((...args: any[]) => {
        // debounce优化为只执行一次，那么保持统一，内部调用的方法也是第一次的
        return fnRef.current(...args);
      }) as T,
      wait,
      options
    );
  }, []);

  

  return {
    run: debounced,
    cancel: debounced.cancel,
    flush: debounced.flush,
  };
}

export default useDebounceFn;
