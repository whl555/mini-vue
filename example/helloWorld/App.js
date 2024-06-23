import { h } from "../../dist/mini-vue.esm-bundler.js";

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
      // "hi, wuhaolei"
      [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "wuhaolei")]
    );
  },
};
