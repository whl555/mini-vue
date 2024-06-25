import { h } from "../../dist/mini-vue.esm-bundler.js";
import { Foo } from "./Foo.js";

export default {
  name: "App",
  setup() {},

  render() {
    const foo = h(
      Foo,
      {},
      {
        header: h("p", {}, "header"),
        footer: h("p", {}, "footer"),
      }
    );
    return h("div", {}, [h("div", {}, "App"), foo]);
  },
};
