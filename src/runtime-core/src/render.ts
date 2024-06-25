import { ShapeFlags } from "../../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

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
  // debugger;
  // check node type, assert to be component
  const { type, shapeFlag } = vnode;

  switch (type) {
    case Fragment:
      processFragment(vnode, container);
      break;
    case Text:
      processTextNode(vnode, container);
      break;
    default:
      if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
      } else if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
      }
      break;
  }
}

// 处理component组件
function processComponent(vnode, container) {
  // init
  mountComponent(vnode, container);

  // update
  updateComponent(vnode);
}
function mountComponent(initialVNode: any, container) {
  const instance = createComponentInstance(initialVNode);
  setupComponent(instance);
  setupRenderEffects(instance, initialVNode, container);
}

function setupRenderEffects(instance, initialVNode, container) {
  const { proxy } = instance;
  // call 是 JavaScript 中的一个方法，用于调用函数并指定函数内部的 this 上下文, 这里调用render同时指定上下文this为proxy, 而不是instance
  const subTree = instance.render.call(proxy);

  // vnode -> element -> mount(element)
  // 进入递归
  patch(subTree, container);

  // 递归完毕
  initialVNode.el = subTree.el;
}

function updateComponent(vnode: any) {}

// 处理element节点
function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}
function mountElement(vnode: any, container: any) {
  const { type, props, children, shapeFlag } = vnode;
  // 1. el & add 虚拟节点的el属性
  const element = (vnode.el = document.createElement(type));

  // 2. add children
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) element.textContent = children;
  else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, element);
  }

  // 3. add props
  for (const key in props) {
    const val = props[key];
    console.log(key);
    const isEvent = (key: string) => /^on[A-Z]/.test(key);
    if (isEvent(key)) {
      element.addEventListener(key.slice(2).toLocaleLowerCase(), val);
    } else {
      element.setAttribute(key, val);
    }
  }
  container.append(element);
}

/**
 * 递归处理所有children
 * @param vnode
 * @param container
 */
function mountChildren(vnode: any, container: any) {
  vnode.children.forEach((child) => {
    patch(child, container);
  });
}
/**
 * 单独处理Fragment
 * @param vnode
 * @param container
 */
function processFragment(vnode: any, container: any) {
  mountChildren(vnode, container);
}
function processTextNode(vnode: any, container: any) {
  const { children } = vnode;
  // 1. el & add 虚拟节点的el属性
  const element = (vnode.el = document.createTextNode(children));

  // 2. add textNode
  container.append(element);
}
