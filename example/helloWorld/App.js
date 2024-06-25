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
      },
      [
        h("p", { class: "red" }, "hi"),
        h(Foo, {
          onAddFoo: (a, b) => {
            console.log("onAddFoo", a + b);
          },
        }),
      ]
    );
  },
};
