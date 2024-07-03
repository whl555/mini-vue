import { proxyRefs } from "../../reactivity";
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
    next: null, // 下一个更新的vnode
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    emit: (event) => {},
    subTree: {}, // render函数的返回值?
    isMounted: false, // 当前虚拟节点是否被挂载
    update: null, // setupRenderEffects函数effect收集为依赖，其返回值runner作为update
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
    const setupRes =
      setup(shallowReadonly(instance.props), {
        emit: instance.emit,
      }) || {};
    setCurrentInstance(null);
    handleSetupRes(instance, proxyRefs(setupRes));
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
  // 用户写的render函数优先级大于compiler模块生成的render函数
  if (compile && !component.render) {
    if (component.template) {
      // 这里就是 runtime 模块和 compile 模块结合点
      const template = component.template;
      component.render = compile(template);
    }
  }

  if (component.render) {
    instance.render = component.render;
  }
}

let compile;
export function registerRuntimeCompiler(_compile) {
  compile = _compile;
}
