import { effect } from "../../reactivity";
import { EMPTY_OBJ } from "../../shared";
import { getSequence } from "../../shared/LIS";
import { ShapeFlags } from "../../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

// closure
export function createRenderer(options) {
  const {
    createElement,
    patchProp,
    insertElement,
    removeElement,
    createText,
    setElementText,
    setText,
  } = options;

  function render(vnode, container) {
    // invoke patch
    patch(null, vnode, container);
  }

  /**
   * 递归处理虚拟节点树, 递归终点是Element
   */
  function patch(prev, cur, container, anchor = null) {
    // debugger;
    // check node type, assert to be component
    const { type, shapeFlag } = cur || {};

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
          processElement(prev, cur, container, anchor);
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
  function processElement(prev, cur: any, container: any, anchor = null) {
    if (!prev) {
      mountElement(cur, container, anchor);
    } else {
      updateElement(prev, cur, container);
    }
  }
  function mountElement(vnode: any, container: any, anchor = null) {
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
    insertElement(element, container, anchor);
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

    // update children
    // fix insertBefore调用失误的bug
    updateChildren(prev, cur, el);
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

  function updateChildren(prev: any, cur: any, container: any) {
    const { shapeFlag: prevShapeFlag, children: c1 } = prev;
    const { shapeFlag, children: c2 } = cur;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // clear old array children
        unmountChildren(c1);
      }
      if (c1 != c2) {
        // set text
        setElementText(container, c2);
      }
    } else {
      // cur is array
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        setElementText(container, "");
        mountChildren(cur, container);
      } else {
        // array to array
        // unmountChildren(c1);
        // mountChildren(cur, container);
        patchKeyedChildren(prev.children, cur.children, container);
      }
    }
  }

  function patchKeyedChildren(c1: any[], c2: any[], container) {
    let i = 0;
    const l2 = c2.length;
    const l1 = c1.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;

    const isSameVNodeType = (n1, n2) => {
      return n1.type === n2.type && n1.key === n2.key;
    };

    // scan from left
    while (i <= e1 && i <= e2) {
      const prevChild = c1[i];
      const nextChild = c2[i];

      if (!isSameVNodeType(prevChild, nextChild)) {
        break;
      }

      patch(prevChild, nextChild, container);
      i++;
    }

    // scan from right
    while (i <= e1 && i <= e2) {
      const prevChild = c1[e1];
      const nextChild = c2[e2];
      if (!isSameVNodeType(prevChild, nextChild)) {
        break;
      }

      patch(prevChild, nextChild, container);
      e1--;
      e2--;
    }

    // new length > old length insert
    if (i > e1) {
      if (e1 > 0) {
        // insert right
        let count = i;
        while (count <= e2) {
          patch(null, c2[count], container);
          count++;
        }
      } else {
        // e1 < 0: insert left
        let count = e2;
        while (count >= 0) {
          const anchor = c2[count + 1].el;
          patch(null, c2[count], container, anchor);
          count--;
        }
      }
    }

    // new length < old length delete
    if (i > e2) {
      if (e2 > 0) {
        // old: abc; new: ab delete from right
        let count = i;
        while (count <= e1) {
          // patch(c1[count], null, container);
          removeElement(c1[count].el);
          count++;
        }
      } else {
        // old: abc; new: bc delete from left
        let count = e1;
        while (count >= 0) {
          // patch(c1[count], null, container);
          removeElement(c1[count].el);
          count--;
        }
      }
    }

    // element exists in old, and not exists in new
    const keyToNewIndexMap = new Map();
    const toBePatched = e2 - i + 1;
    const newIndexToOldIndexMap = new Array(toBePatched); // used to LIS

    let patched = 0;
    let moved = false; // 是否应该调用移动算法
    let largestSoFar = -1; // 遍历新children时，记录遍历到的当前最大索引

    // 初始化newIndexToOldIndexMap
    for (let index = 0; index < newIndexToOldIndexMap.length; index++) {
      newIndexToOldIndexMap[index] = -1;
    }

    // 初始化keyToNewIndexMap
    for (let s2 = i; s2 <= e2; s2++) {
      const key = c2[s2].key;
      keyToNewIndexMap.set(key, s2);
    }

    for (let s1 = i; s1 <= e1; s1++) {
      const preChild = c1[s1];

      if (patched > toBePatched) {
        removeElement(preChild.el);
        continue;
      }

      let newIndex;
      if (preChild.key != null) {
        newIndex = keyToNewIndexMap.get(preChild.key);
      } else {
        // 没有设置key, 遍历查询是否有相同类型
        for (let j = i; j <= e2; j++) {
          const element = c2[j];
          if (isSameVNodeType(preChild, element)) {
            newIndex = j;
            break;
          }
        }
      }

      if (newIndex == undefined) {
        removeElement(preChild.el);
      } else {
        patch(preChild, c2[newIndex], container);

        newIndexToOldIndexMap[newIndex - i] = s1;
        if (newIndex >= largestSoFar) {
          largestSoFar = newIndex;
        } else {
          moved = true;
        }

        patched++;
      }
    }

    // lis: 新序列中稳定的序列的元素的下标
    const lis = moved ? getSequence(newIndexToOldIndexMap) : [];
    let lisCount = lis.length - 1; // 记录lis中稳定元素匹配的数量
    for (let index = toBePatched - 1; index >= 0; index--) {
      const curIndex = index + i;
      const anchor = curIndex + 1 < l2 ? c2[curIndex + 1].el : null;

      // 新节点在老children中不存在，新建节点
      if (newIndexToOldIndexMap[index] == -1) {
        patch(null, c2[curIndex], container, anchor);
      }

      if (moved) {
        // 移动逻辑
        if (lisCount < 0 || index != lis[lisCount]) {
          console.log("该元素应该移动", c2[curIndex]);
          insertElement(c2[curIndex].el, container, anchor);
        } else {
          // 不需要移动的元素跳过
          lisCount--;
        }
      }
    }

    console.log(i, e1, e2, lis);
  }

  function unmountChildren(children) {
    for (let index = 0; index < children.length; index++) {
      const element = children[index];
      removeElement(element);
    }
  }

  return { createApp: createAppAPI(render) };
}
