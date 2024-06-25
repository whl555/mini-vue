import { h } from "../../dist/mini-vue.esm-bundler.js";

export const Foo = {
  // key1 在setup中接收emit
  setup(props, { emit }) {
    const emitAddFoo = () => {
      // key2 传入事件名字 & 参数
      emit("add-foo", 55, 66);
    };

    return { emitAddFoo };
  },
  render() {
    const btn = h(
      "button",
      {
        onClick: this.emitAddFoo,
      },
      "click button to add emit"
    );

    const foo = h("div", { class: "red" }, "hello");
    return h("div", {}, [btn, foo]);
  },
};
