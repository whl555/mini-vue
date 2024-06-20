import { isProxy, isReactive, isReadonly, readonly } from "../src/reactive";

describe("readonly", () => {
  it("common", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    original.foo = 2;
    expect(original.foo).not.toBe(1);

    expect(isReactive(wrapped)).toBe(false);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReactive(original)).toBe(false);
    expect(isReadonly(original)).toBe(false);
    expect(isProxy(wrapped)).toBe(true);
  });
});
