import { createRenderer } from "../runtime-core/src/render";

function createElement(type) {
  const element = document.createElement(type);
  return element;
}

function patchProp(element, key, val) {
  const isEvent = (key: string) => /^on[A-Z]/.test(key);
  if (isEvent(key)) {
    element.addEventListener(key.slice(2).toLocaleLowerCase(), val);
  } else {
    element.setAttribute(key, val);
  }
}

function insertElement(el, parent) {
  parent.append(el);
}

const render: any = createRenderer({ createElement, patchProp, insertElement });

export function createApp(...args) {
  return render.createApp(...args);
}

export * from "../runtime-core";
