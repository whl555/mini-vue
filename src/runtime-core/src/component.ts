export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
  };

  return component;
}

export function setupComponent(instance) {
  // TODO
  // initProps()
  // initSlots()

  setupStatefulComponent(instance);
}

// instance添加状态(setupRes、render)
function setupStatefulComponent(instance) {
  // instance: {vnode, xxx} vnode: {type(编写的组件), props?, children}
  const component = instance.type;
  const { setup } = component;

  if (setup) {
    const setupRes = setup();
    handleSetupRes(instance, setupRes);
  }
}

function handleSetupRes(instance, setupRes: any) {
  // 1. return 函数
  // 2. return 值

  if (typeof setupRes == "object") {
    instance.setupRes = setupRes;
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
  const component = instance.type;
  if (component.render) {
    instance.render = component.render;
  }
}
