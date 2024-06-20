import { extend } from "../../shared";

let globalEffect = void 0;
let shouldTrack = false; // 是否应该收集依赖, 处理variable++触发的bug情况
let targetMap = new WeakMap();

export class ReactiveEffect {
  private _func: any;
  active = true; // effect是否存在, 是否stop过
  deps = [];
  onStop?: () => void;
  constructor(func, public scheduler?) {
    this._func = func;
  }
  run() {
    // stop后, 手动触发
    if (!this.active) {
      return this._func();
    }
    shouldTrack = true;
    globalEffect = this as any;

    const res = this._func();

    shouldTrack = false;
    globalEffect = undefined;
    return res;
  }

  stop() {
    if (this.active) {
      // cleanDeps(this);
      cleanupEffect(this);
      this.active = false;

      if (this.onStop) {
        this.onStop();
      }
    }
  }
}

function cleanupEffect(effect) {
  // 找到所有依赖这个 effect 的响应式对象
  // 从这些响应式对象里面把 effect 给删除掉 ???
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });

  effect.deps.length = 0;
}

function trackEffects(dep) {
  if (!dep.has(globalEffect)) {
    dep.add(globalEffect);
    (globalEffect as any).deps.push(dep);
  }
}

export function isTracking() {
  return shouldTrack && globalEffect !== undefined;
}

// 收集依赖
export function track(target, key) {
  // 处理globalEffect为undefined的情况，例如只访问getter
  // if (!globalEffect || !shouldTrack) return;
  if (!isTracking()) return;

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

  trackEffects(deps);
}

// 触发依赖
export function trigger(target, key) {
  let depMap = targetMap.get(target);
  let deps = depMap.get(key);
  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
export function effect(func, options: any = {}) {
  // 调用effect时, 收集func
  const _effect = new ReactiveEffect(func, options.scheduler);
  extend(_effect, options);

  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect; // mount

  // 将run方法返回
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
