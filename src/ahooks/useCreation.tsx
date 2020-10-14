import { useRef } from "react";

// 传入一个工厂函数用于执行后返回对象 避免在外层重复new对象
export default function useCreation<T>(factory: () => T, deps: any[]) {
  const { current } = useRef({
    deps: deps,
    obj: undefined as undefined | T,
    initialized: false,
  });
  // 初次创建 || 依赖更新后 执行fn创建对象
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps;
    current.obj = factory();
    current.initialized = true;
  }
  return current.obj as T;
}

// 判断依赖是否改变 （浅比较
function depsAreSame(oldDeps: any[], deps: any[]): boolean {
  if (oldDeps === deps) return true;
  for (const i in oldDeps) {
    if (oldDeps[i] !== deps[i]) return false;
  }
  return true;
}

// @也可以用这种方法
// 第一个常见的使用场景是当创建初始 state 很昂贵时：
// 为避免重新创建被忽略的初始 state，我们可以传一个 函数 给 useState：
/*
function Table(props:any) {
  // ✅ createRows() 只会被调用一次
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}*/