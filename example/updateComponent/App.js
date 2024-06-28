import { h, ref } from "../../dist/mini-vue.esm-bundler.js";

export const App = {
  name: "App",
  setup() {
    let count = ref(0);

    const onClick = () => {
      count.value++;
    };
    return { count, onClick };
  },
  render() {
    return h("div", {}, [
      h("p", {}, "count: " + this.count),
      h(
        "button",
        {
          onClick: this.onClick,
        },
        "click to add"
      ),
    ]);
  },
};
