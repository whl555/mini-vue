import { isObject } from "../../shared";
import { ShapeFlags } from "../../shared/shapeFlags";

export const Fragment = Symbol("Fragment");
export const Text = Symbol("text");

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlag(type, children),
  };

  return vnode;
}

function getShapeFlag(type, children?) {
  let flag =
    typeof type == "string"
      ? ShapeFlags.ELEMENT
      : ShapeFlags.STATEFUL_COMPONENT;

  if (typeof children == "string") {
    flag |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    flag |= ShapeFlags.ARRAY_CHILDREN;
  }

  // 为每个vnode判断slots
  if (flag & ShapeFlags.STATEFUL_COMPONENT && isObject(children))
    flag |= ShapeFlags.SLOTS_CHILDREN;

  return flag;
}

export function createTextNode(text: string) {
  return createVNode(Text, {}, text);
}
