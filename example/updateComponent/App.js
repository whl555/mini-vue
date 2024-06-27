import { h, ref } from "../../dist/mini-vue.esm-bundler.js";

export const App = {
  name: "App",
  setup() {
    let count = ref(0);
    return { count };
  },
  render() {
    return h("div", {}, "count: " + this.count);
  },
};
