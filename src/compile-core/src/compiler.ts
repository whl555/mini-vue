import { generate } from "./codegen";
import { baseParse } from "./parser";
import { transform } from "./transform";
import { transformElement } from "./transform/transformElement";
import { transformExpression } from "./transform/transformExpression";
import { transformText } from "./transform/transformText";

export function baseCompile(template, options) {
  // 1. 先把 template 也就是字符串 parse 成 ast
  const ast = baseParse(template);
  // 2. 给 ast 加点料（- -#）
  transform(
    ast,
    Object.assign(options, {
      nodeTransforms: [transformElement, transformText, transformExpression],
    })
  );

  // 3. 生成 render 函数代码
  return generate(ast);
}
