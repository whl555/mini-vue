import { isObject } from "../../shared";
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
  debugger;
  // check node type, assert to be component
  if (isObject(vnode.type)) {
    processComponent(vnode, container);
  } else {
    processElement(vnode, container);
  }
}

// 处理component组件
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

// 处理element节点
function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}
function mountElement(vnode: any, container: any) {
  const { type, props, children } = vnode;
  // 1. el
  const el = document.createElement(type);

  // 2. add children
  if (typeof children == "string") el.textContent = children;
  else if (Array.isArray(children)) {
    mountChildren(vnode, el);
  }

  // 3. add props
  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }
  container.append(el);
}

function mountChildren(vnode: any, container: any) {
  vnode.children.forEach((child) => {
    patch(child, container);
  });
}
