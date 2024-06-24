import { shallowReadonly } from "../../reactivity/src/reactive";
import { initProps } from "./componentProps";
import { publicInstanceHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode) {
  // proxy--组件代理对象
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
  };

  return component;
}

export function setupComponent(instance) {
  // TODO
  initProps(instance, instance.vnode.props);
  // initSlots()

  setupStatefulComponent(instance);
}

// instance添加状态(setupRes、render)
function setupStatefulComponent(instance) {
  // instance: {vnode, xxx} vnode: {type(编写的组件), props?, children}
  const component = instance.type;
  const { setup } = component;

  // handle setup
  if (setup) {
    const setupRes = setup(shallowReadonly(instance.props));
    handleSetupRes(instance, setupRes);
  }

  // handle proxy
  instance.proxy = new Proxy({ _: instance }, publicInstanceHandlers);
}

function handleSetupRes(instance, setupRes: any) {
  // 1. return 函数
  // 2. return 值

  if (typeof setupRes == "object") {
    instance.setupState = setupRes;
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
  const component = instance.type;
  if (component.render) {
    instance.render = component.render;
  }
}
