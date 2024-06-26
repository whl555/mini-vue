import { getCurrentInstance, h } from "../../dist/mini-vue.esm-bundler.js";

export default {
  name: "App",
  setup() {
    const currentInstance = getCurrentInstance();

    console.log("@", currentInstance);

    return {};
  },

  render() {
    const currentInstance = getCurrentInstance();

    console.log("@", currentInstance);
    return h("div", {}, [h("p", {}, "getCurrentInstance")]);
  },
};
