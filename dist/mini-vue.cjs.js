'use strict';

const isObject = (val) => {
    return val != null && typeof val == "object";
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
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
function handleSetupRes(instance, setupRes) {
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

function render(vnode, container) {
    // invoke patch
    patch(vnode, container);
}
/**
 * 递归处理虚拟节点树, 递归终点是Element
 * @param vnode 虚拟节点
 * @param container 根容器Element
 */
function patch(vnode, container) {
    debugger;
    // check node type, assert to be component
    if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
    else {
        processElement(vnode, container);
    }
}
// 处理component组件
function processComponent(vnode, container) {
    // init
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffects(instance, container);
}
function setupRenderEffects(instance, container) {
    const subTree = instance.render();
    // vnode -> element -> mount(element)
    // 进入递归
    patch(subTree, container);
}
// 处理element节点
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const { type, props, children } = vnode;
    // 1. el
    const el = document.createElement(type);
    // 2. add children
    if (typeof children == "string")
        el.textContent = children;
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    // 3. add props
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach((child) => {
        patch(child, container);
    });
}

function createVNode(type, props, children) {
    const vnode = { type, props, children };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 1. component -> vnode
            // 所有操作都是基于vnode
            // vnode有component和element两种类型
            const vnode = createVNode(rootComponent);
            // 2. invoke render
            render(vnode, rootContainer);
        },
    };
}

const h = (type, props = null, children = []) => {
    return createVNode(type, props, children);
};

exports.createApp = createApp;
exports.h = h;
//# sourceMappingURL=mini-vue.cjs.js.map
