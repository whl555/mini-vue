import typescript from "@rollup/plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

export default {
  input: "./src/index.ts",
  output: [
    {
      format: "cjs",
      file: "./dist/mini-vue.cjs.js",
      sourcemap: true,
    },
    {
      name: "vue",
      format: "es",
      file: "./dist/mini-vue.esm-bundler.js",
      sourcemap: true,
    },
  ],
  plugins: [
    // replace({
    //   "process.env.NODE_ENV": JSON.stringify("development"),
    //   "process.env.VUE_ENV": JSON.stringify("browser"),
    //   "process.env.LANGUAGE": JSON.stringify(process.env.LANGUAGE),
    // }),
    resolve(),
    commonjs(),
    typescript(),
    sourceMaps(),
  ],

  onwarn: (msg, warn) => {
    // 忽略 Circular 的错误
    if (!/Circular/.test(msg)) {
      warn(msg);
    }
  },
};
