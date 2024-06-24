import { h } from "../../dist/mini-vue.esm-bundler.js";
import { Foo } from "./Foo.js";

// const count = ref(0);

window.self = null;
export default {
  name: "App",
  setup() {
    return {
      msg: "wuhaolei--hha",
    };
  },

  render() {
    window.self = this;
    return h(
      "div",
      {
        id: "root",
        class: "hard",
        onClick: () => {
          console.log("haha");
        },
        onMouseDown: () => {
          console.log("onMouseDown");
        },
      },
      // "hi, wuhaolei"
      [h("p", { class: "red" }, "hi"), h(Foo, { count: 1 })]
      // [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "wuhaolei")]
    );
  },
};
