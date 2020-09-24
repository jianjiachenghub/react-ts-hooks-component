import { useState, useEffect } from "react";

function useDebounce(inputValue: any, delay: number = 300) {
  const [debouncedValue, setDebouncedValue] = useState<any>(inputValue);
  // 无论inputValue如何变化，下面的副作用在延迟后才去更新debouncedValue
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [inputValue, delay]);
  // 也就是说返回的debouncedValue在延时后才会更新
  return debouncedValue;
}

export default useDebounce;
