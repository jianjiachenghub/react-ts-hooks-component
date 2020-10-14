import { useState, useEffect } from "react";
import useDebounceFn from "./useDebounceFn";

interface DebounceOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}

function useDebounce<T>(value: T, options?: DebounceOptions) {
  const [debounced, setDebounced] = useState(value);

  // 调用防抖函数取包裹set函数 到达不马上更新指定state的目的
  const { run } = useDebounceFn<()=>void>(() => {
    setDebounced(value);
  }, options);

  // value 短时间更新 就去重复执行run 
  // run是防抖函数不会立即setDebounced debounced就不会马上更新 而是在等一段时间后直接更新为最新值
  useEffect(() => {
    run();
  }, [value]);
  return debounced;
}

export default useDebounce;

