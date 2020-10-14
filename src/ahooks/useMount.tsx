import { useEffect } from 'react';
import usePersistFn from './usePersistFn';

const useMount = (fn: any) => {
  //? 为什么需要持久化函数 react-use库里都没有使用
  const fnPersist = usePersistFn(fn);

  useEffect(() => {
    if (fnPersist && typeof fnPersist === 'function') {
      fnPersist();
    }
  }, []);
};

export default useMount;
