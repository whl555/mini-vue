import { createRenderer } from "../runtime-core/src/render";

function createElement(type) {
  const element = document.createElement(type);
  return element;
}

function patchProp(element, key, oldVal, newVal) {
  const isEvent = (key: string) => /^on[A-Z]/.test(key);
  if (isEvent(key)) {
    element.addEventListener(key.slice(2).toLocaleLowerCase(), newVal);
  } else {
    // handle props
    if (newVal == undefined || newVal == null) {
      element.removeAttribute(key);
    } else {
      element.setAttribute(key, newVal);
    }
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
