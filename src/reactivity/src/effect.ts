let globalEffect = void 0;
let targetMap = new Map();

export class ReactiveEffect {
  private _func: any;
  constructor(func) {
    this._func = func;
  }
  run() {
    globalEffect = this as any;
    return this._func();
    // globalEffect = undefined;
  }
}

// 收集依赖
export function track(target, key) {
  let depMap: Map<any, any> = targetMap.get(target);
  if (!depMap) {
    depMap = new Map();
    targetMap.set(target, depMap);
  }
  let deps: Set<any> = depMap.get(key);
  if (!deps) {
    deps = new Set();
    depMap.set(key, deps);
  }
  deps.add(globalEffect);
}

// 触发依赖
export function trigger(target, key) {
  let depMap = targetMap.get(target);
  let deps = depMap.get(key);
  for (const effect of deps) {
    (effect as ReactiveEffect).run();
  }
}
export function effect(func) {
  // 调用effect时, 收集func
  const _effect = new ReactiveEffect(func);

  // 将run方法返回
  return _effect.run.bind(_effect);
}
