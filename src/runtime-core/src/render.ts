import { effect } from "../../reactivity";
import { EMPTY_OBJ } from "../../shared";
import { ShapeFlags } from "../../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

// closure
export function createRenderer(options) {
  const { createElement, patchProp, insertElement } = options;

  function render(vnode, container) {
    // invoke patch
    patch(null, vnode, container);
  }

  /**
   * 递归处理虚拟节点树, 递归终点是Element
   */
  function patch(prev, cur, container) {
    // debugger;
    // check node type, assert to be component
    const { type, shapeFlag } = cur;

    switch (type) {
      case Fragment:
        processFragment(cur, container);
        break;
      case Text:
        processTextNode(cur, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(prev, cur, container);
        } else if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(prev, cur, container);
        }
        break;
    }
  }

  // 处理component组件
  function processComponent(prev, cur: any, container) {
    if (!prev) {
      // init
      mountComponent(cur, container);
    } else {
      // update
      updateComponent(prev, cur, container);
    }
  }
  function mountComponent(initialVNode: any, container) {
    const instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffects(instance, initialVNode, container);
  }

  function setupRenderEffects(instance, initialVNode, container) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance;
        // call 是 JavaScript 中的一个方法，用于调用函数并指定函数内部的 this 上下文, 这里调用render同时指定上下文this为proxy, 而不是instance
        const subTree = instance.render.call(proxy);
        instance.subTree = subTree;

        // vnode -> element -> mount(element)
        // 进入递归
        patch(null, subTree, container);

        // 递归完毕
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);

        const pre = instance.subTree;
        instance.subTree = subTree;

        patch(pre, subTree, container);
        initialVNode.el = subTree.el;

        console.log("update");
      }
    });
  }

  // 处理element节点
  function processElement(prev, cur: any, container: any) {
    if (!prev) {
      mountElement(cur, container);
    } else {
      updateElement(prev, cur, container);
    }
  }
  function mountElement(vnode: any, container: any) {
    const { type, props, children, shapeFlag } = vnode;
    // 1. el & add 虚拟节点的el属性
    const element = (vnode.el = createElement(type));

    // 2. add children
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) element.textContent = children;
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, element);
    }

    // 3. add props
    for (const key in props) {
      const val = props[key];
      patchProp(element, key, null, val);
    }
    insertElement(element, container);
  }

  /**
   * 递归处理所有children
   * @param vnode
   * @param container
   */
  function mountChildren(vnode: any, container: any) {
    vnode.children.forEach((child) => {
      patch(null, child, container);
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

  function updateComponent(rev, cur: any, container: any) {
    // TODO
  }

  function updateElement(prev, cur: any, container: any) {
    // TODO
    console.log(prev, cur);
    const el = (cur.el = prev.el);
    // update props
    const oldProps = prev.props || EMPTY_OBJ;
    const newProps = cur.props || EMPTY_OBJ;
    updateProps(el, oldProps, newProps);
  }

  function updateProps(el, oldProps: any, newProps: any) {
    console.log(oldProps, newProps);
    if (oldProps != newProps) {
      for (const key in newProps) {
        const oldVal = oldProps[key];
        const newVal = newProps[key];
        if (oldVal != newVal) {
          patchProp(el, key, oldVal, newVal);
        }
      }

      if (oldProps != EMPTY_OBJ) {
        // remove if property is deleted
        for (const key in oldProps) {
          if (!(key in newProps)) {
            patchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  }

  return { createApp: createAppAPI(render) };
}
