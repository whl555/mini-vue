const isObject = (val) => {
    return val != null && typeof val == "object";
};

const map = {
    $el: (i) => i.vnode.el,
};
const publicInstanceHandlers = {
    get({ _: instance }, key) {
        console.log("@", instance);
        // setup
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        // type
        // if (key == "$el") {
        //   return instance.vnode.el;
        // }
        const getter = map[key];
        if (getter)
            return getter(instance);
    },
    set(target, key, val) {
        return true;
    },
};

function createComponentInstance(vnode) {
    // proxy--组件代理对象
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
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
    // handle setup
    if (setup) {
        const setupRes = setup();
        handleSetupRes(instance, setupRes);
    }
    // handle proxy
    instance.proxy = new Proxy({ _: instance }, publicInstanceHandlers);
}
function handleSetupRes(instance, setupRes) {
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
    // debugger;
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
    setupRenderEffects(instance, vnode, container);
}
function setupRenderEffects(instance, vnode, container) {
    const { proxy } = instance;
    // call 是 JavaScript 中的一个方法，用于调用函数并指定函数内部的 this 上下文, 这里调用render同时指定上下文this为proxy, 而不是instance
    const subTree = instance.render.call(proxy);
    // vnode -> element -> mount(element)
    // 进入递归
    patch(subTree, container);
    // 递归完毕
    vnode.el = subTree.el;
}
// 处理element节点
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const { type, props, children } = vnode;
    // 1. el & add 虚拟节点的el属性
    const element = (vnode.el = document.createElement(type));
    // 2. add children
    if (typeof children == "string")
        element.textContent = children;
    else if (Array.isArray(children)) {
        mountChildren(vnode, element);
    }
    // 3. add props
    for (const key in props) {
        const val = props[key];
        element.setAttribute(key, val);
    }
    container.append(element);
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

export { createApp, h };
//# sourceMappingURL=mini-vue.esm-bundler.js.map
