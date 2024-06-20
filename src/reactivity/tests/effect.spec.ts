import { effect } from "../src/effect";
import reactive from "../src/reactive";

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
    const res = runner();
    expect(foo).toBe(11);

    expect(res).toBe("foo");
  });
});
