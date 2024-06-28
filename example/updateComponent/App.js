import { h, ref } from "../../dist/mini-vue.esm-bundler.js";

export const App = {
  name: "App",
  setup() {
    let props = ref({
      foo: "foo",
    });

    const onClick = () => {
      props.value.foo = "new-foo"; // case1-change
      // props.value.foo = undefined; // case2-undefined
      // props.value = {}; // case3-remove
    };
    return { props, onClick };
  },
  render() {
    return h("div", { id: "root", ...this.props }, [
      h("p", {}, "foo"),
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
