import { h, createTextNode } from "../../dist/mini-vue.esm-bundler.js";
import { Foo } from "./Foo.js";

export default {
  name: "App",
  setup() {},

  render() {
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => {
          console.log("age: ", age);
          return h("p", {}, "header, " + age);
        },
        footer: () => h("p", {}, "footer"),
      }
    );
    return h("div", {}, [h("div", {}, "App"), foo, createTextNode("你好世界")]);
  },
};
