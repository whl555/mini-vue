import { ShapeFlags } from "../../shared/shapeFlags";

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

  return flag;
}
