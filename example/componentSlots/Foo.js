import { h, renderSlots } from "../../dist/mini-vue.esm-bundler.js";

export const Foo = {
  setup() {
    return {};
  },
  render() {
    const age = 22;
    const foo = h("p", {}, "haha, foo");
    console.log("hah", this.$slots);
    return h("div", {}, [
      renderSlots(this.$slots, "header", { age }),
      foo,
      renderSlots(this.$slots, "footer"),
    ]);
  },
};
