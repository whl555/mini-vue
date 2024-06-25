import { h } from "../../dist/mini-vue.esm-bundler.js";
import { Foo } from "./Foo.js";

export default {
  name: "App",
  setup() {},

  render() {
    const foo = h(Foo, {}, [h("p", {}, "123"), h("p", {}, "123")]);
    return h("div", {}, [h("div", {}, "App"), foo]);
  },
};
