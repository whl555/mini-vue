import { generate } from "../src/codegen";
import { baseParse } from "../src/parser";
import { transform } from "../src/transform";
import { transformElement } from "../src/transform/transformElement";
import { transformExpression } from "../src/transform/transformExpression";
import { transformText } from "../src/transform/transformText";

test("interpolation module", () => {
  const ast = baseParse("{{hello}}");
  console.log("initial ast", ast);
  transform(ast, {
    nodeTransforms: [transformExpression],
  });
  console.log("transformed ast", ast);

  const { code } = generate(ast);
  console.log(code);
  expect(code).toMatchSnapshot();
});

test("element and interpolation", () => {
  const ast = baseParse("<div>hi,{{msg}}</div>");
  console.log("initial ast", ast);
  transform(ast, {
    nodeTransforms: [transformElement, transformText, transformExpression],
  });
  console.log("transformed ast", ast);
  const { code } = generate(ast);
  console.log(code);
  expect(code).toMatchSnapshot();
});
