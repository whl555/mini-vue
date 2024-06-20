import { effect, stop } from "../src/effect";
import { reactive } from "../src/reactive";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 22,
    });
    let nextAge;
    const runner = effect(() => {
      nextAge = user.age + 1;
    });
    runner();
    // init
    expect(nextAge).toBe(23);

    // // update
    user.age++;
    expect(nextAge).toBe(24);
  });

  it("runner", () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    });
    expect(foo).toBe(11);

    const res = runner();

    expect(res).toBe("foo");
  });

  it("scheduler", () => {
    // 1. effect接受一个可选参数
    // 2. 希望初始时刻scheduler不调用, 仍然是fn调用一次
    // 3. 希望更新时调用scheduler, 而不是fn, fn可以手动调用
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(2);
    // // should not run yet
    expect(dummy).toBe(1);
    // // manually run
    run();
    // // should have run
    expect(dummy).toBe(3);
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    // obj.prop = 3;
    obj.prop++;
    expect(dummy).toBe(2);

    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });

  it("events: onStop", () => {
    const onStop = jest.fn();
    const runner = effect(() => {}, {
      onStop,
    });

    stop(runner);
    expect(onStop).toHaveBeenCalled();
  });
});
