import { useEffect, useRef } from "react";

// 排除初始化渲染 只有deps更新的时候才执行副作用
const useUpdateEffect: typeof useEffect = (effect, deps) => {

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};

export default useUpdateEffect


