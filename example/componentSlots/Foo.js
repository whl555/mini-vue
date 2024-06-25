import { h, renderSlots } from "../../dist/mini-vue.esm-bundler.js";

export const Foo = {
  setup() {
    return {};
  },
  render() {
    const foo = h("p", {}, "haha, foo");
    console.log("hah", this.$slots);
    return h("div", {}, [
      renderSlots(this.$slots, "header"),
      foo,
      renderSlots(this.$slots, "footer"),
    ]);
  },
};
