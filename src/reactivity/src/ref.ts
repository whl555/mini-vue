import { isObject, isSame } from "../../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { shallowUnwrapHandlers } from "./handlers";
import { reactive } from "./reactive";

class RefImpl {
  private _raw: any;
  private _value: any;
  public dep: Set<any>;
  public __v_isRef = true;
  constructor(value) {
    this._raw = value;
    this._value = isObject(value) ? reactive(value) : value;
    this.dep = new Set();
  }

  get value() {
    if (isTracking()) trackEffects(this.dep);
    return this._value;
  }

  set value(newVal) {
    if (isSame(this._raw, newVal)) return;
    this._raw = newVal;
    this._value = isObject(newVal) ? reactive(newVal) : newVal;

    triggerEffects(this.dep);
  }
}
export function ref(target) {
  return new RefImpl(target);
}

// 把 ref 里面的值拿到
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

// 访问对象的一个属性, 存在就是true, 否则就是undefined不存在
export function isRef(value) {
  return !!value.__v_isRef;
}

export function proxyRefs(target) {
  return new Proxy(target, shallowUnwrapHandlers);
}
