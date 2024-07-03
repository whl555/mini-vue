import { baseCompile } from "./compile-core";
import { registerRuntimeCompiler } from "./runtime-core/src/component";
import * as runtimeDom from "./runtime-dom";

export { baseCompile } from "./compile-core";
export * from "./reactivity";
export * from "./runtime-dom";

function compileToFunction(template, options = {}) {
  const { code } = baseCompile(template, options);

  // 调用 compile 得到的代码在给封装到函数内，
  // 这里会依赖 runtimeDom 的一些函数，所以在这里通过参数的形式注入进去
  const render = new Function("Vue", code)(runtimeDom);

  return render;
}

registerRuntimeCompiler(compileToFunction);
