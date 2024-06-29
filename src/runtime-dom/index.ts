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

function insertElement(el, parent, anchor) {
  // parent.append(el);
  parent.insertBefore(el, anchor || null);
}

function removeElement(child) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

function createText(text) {
  return document.createTextNode(text);
}

function setText(node, text) {
  node.nodeValue = text;
}

function setElementText(el, text) {
  el.textContent = text;
}

const render: any = createRenderer({
  createElement,
  patchProp,
  insertElement,
  removeElement,
  createText,
  setElementText,
  setText,
});

export function createApp(...args) {
  return render.createApp(...args);
}

export * from "../runtime-core";
