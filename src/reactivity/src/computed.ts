import { ReactiveEffect } from "./effect";

class Computed {
  private _fn: any;
  private _dirty: boolean = true; // value是否第一次被调用
  private _value: any;
  private _effect: ReactiveEffect; //传入的fn是effect主体
  constructor(fn) {
    this._fn = fn;
    this._effect = new ReactiveEffect(fn, () => {
      if (!this._dirty) this._dirty = true;
    });
  }

  get value() {
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }
    return this._value;
  }
}

export function computed(fn) {
  return new Computed(fn);
}
