import { useEffect, EffectCallback, DependencyList, useState } from "react";
import useDebounceFn from "./useDebounceFn";
import useUpdateEffect from "./useUpdateEffect";

interface DebounceOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}

export default function useDebounceEffect(
  effect: EffectCallback,
  deps?: DependencyList,
  options?: DebounceOptions
) {
  const [flag, setFlag] = useState({});
  const { run } = useDebounceFn(() => {
    setFlag({});
  }, options);
  useEffect(() => {
    return run();
  }, deps);

  useUpdateEffect(effect, [flag]);
}
