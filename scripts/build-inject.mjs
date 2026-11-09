// 生成运行时翻译层：把 data/translations.json 合并进 runtime/zh-runtime.js
// 输出一个完整的、可直接注入 index.html 的 JS。
//
// 用法：node scripts/build-inject.mjs <输出路径>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const mapPath = path.join(root, "data", "translations.json");
const runtimePath = path.join(root, "runtime", "zh-runtime.js");
const outPath = process.argv[2] || path.join(root, "build", "zh-full.js");

const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
let src = fs.readFileSync(runtimePath, "utf8");

// 把完整译文表插到内置词典之前，让 FULL 成为第一优先级
const anchor1 = "  var P = {";
if (!src.includes(anchor1)) {
  console.error("build-inject: 找不到锚点 var P = {");
  process.exit(1);
}
src = src.replace(anchor1, "  var FULL = " + JSON.stringify(map) + ";\n" + anchor1);

// 查表时先查 FULL
const anchor2 = "if (P.hasOwnProperty(core)) return lead + P[core] + trail;";
if (!src.includes(anchor2)) {
  console.error("build-inject: 找不到查表锚点");
  process.exit(1);
}
src = src.replace(
  anchor2,
  "if (FULL.hasOwnProperty(core)) return lead + FULL[core] + trail;\n    " + anchor2
);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, src, "utf8");

console.log("build-inject: " + Object.keys(map).length + " entries, " + src.length + " bytes -> " + outPath);
