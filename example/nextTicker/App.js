import {
  h,
  ref,
  reactive,
  getCurrentInstance,
  nextTick,
} from "../../dist/mini-vue.esm-bundler.js";
import NextTicker from "./NextTicker.js";

export default {
  name: "App",
  setup() {
    let count = ref(55);
    const instance = getCurrentInstance();

    const changeCount = () => {
      for (let index = 0; index < 100; index++) {
        count.value++;
      }

      debugger;
      console.log(instance);
      nextTick(() => {
        console.log(instance);
      });
    };

    return { changeCount, count };
  },

  render() {
    return h("div", { tId: 1 }, [
      h("p", {}, "主页"),
      h(
        "button",
        {
          onClick: this.changeCount,
        },
        "change count"
      ),
      h("p", {}, "count: " + this.count),
      h(NextTicker),
    ]);
  },
};
