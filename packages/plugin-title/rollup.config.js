import { terser } from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import { version, name, description, author, license } from "./package.json";

export default {
  input: "src/index.js",
  output: {
    sourcemap: true
  },
  plugins: [
    resolve({
      browser: true
    }),
    json(),
    babel({
      exclude: "node_modules/**",
      plugins: ["@babel/plugin-proposal-object-rest-spread"]
    }),
    terser({
      output: {
        preamble: `/**\n * ${name} | v${version}\n * ${description}\n * (c) ${new Date().getFullYear()} ${author}\n * @license ${license}\n */`
      }
    })
  ]
};