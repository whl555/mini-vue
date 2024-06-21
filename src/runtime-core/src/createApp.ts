import { render } from "./render";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 1. component -> vnode
      // 所有操作都是基于vnode
      // vnode有component和element两种类型
      const vnode = createVNode(rootComponent);

      // 2. invoke render
      render(vnode, rootContainer);
    },
  };
}
