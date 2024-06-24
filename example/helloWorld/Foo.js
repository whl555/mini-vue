import { h } from "../../dist/mini-vue.esm-bundler.js";

export const Foo = {
  setup(props) {
    console.log(props.count);
    props.count++;
    // readonly
    console.log(props.count);
  },
  render() {
    return h("div", {}, "foo: " + this.count);
  },
};
