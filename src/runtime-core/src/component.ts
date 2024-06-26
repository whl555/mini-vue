import { shallowReadonly } from "../../reactivity/src/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { publicInstanceHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";
import { setCurrentInstance } from "./getCurrentInstance";

export function createComponentInstance(vnode) {
  // proxy--组件代理对象
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    emit: (event) => {},
  };

  component.emit = emit.bind(null, component); //绑定第一个参数为component, 用户只需要传入第二个参数event

  return component;
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);

  setupStatefulComponent(instance);
}

// instance添加状态(setupRes、render)
function setupStatefulComponent(instance) {
  // instance: {vnode, xxx} vnode: {type(编写的组件), props?, children}
  const component = instance.type;
  const { setup } = component;

  // handle setup
  if (setup) {
    setCurrentInstance(instance);
    const setupRes = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentInstance(null);
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
