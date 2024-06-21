import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  // invoke patch
  patch(vnode, container);
}

/**
 * 递归处理虚拟节点树, 递归终点是Element
 * @param vnode 虚拟节点
 * @param container 根容器Element
 */
function patch(vnode, container) {
  // check node type, assert to be component
  processComponent(vnode, container);
}

function processComponent(vnode, container) {
  // init
  mountComponent(vnode, container);

  // update
  updateComponent(vnode);
}
function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffects(instance, container);
}

function setupRenderEffects(instance, container) {
  const subTree = instance.render();

  // vnode -> element -> mount(element)
  // 进入递归
  patch(subTree, container);
}

function updateComponent(vnode: any) {}
