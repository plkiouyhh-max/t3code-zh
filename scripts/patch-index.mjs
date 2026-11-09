// 把运行时翻译层注入 index.html。
//
// 只插入一个 <script>，不修改任何逻辑代码。若已注入过，会先移除旧的那段再写入新的，
// 所以重复运行是安全的（幂等）。
//
// 用法：node scripts/patch-index.mjs <注入的js> <index.html>
import fs from "node:fs";

const jsPath = process.argv[2];
const idxPath = process.argv[3];

if (!jsPath || !idxPath) {
  console.error("patch-index: 用法 node scripts/patch-index.mjs <zh-full.js> <index.html>");
  process.exit(1);
}
if (!fs.existsSync(jsPath)) {
  console.error("patch-index: 找不到注入脚本 " + jsPath);
  process.exit(1);
}
if (!fs.existsSync(idxPath)) {
  console.error("patch-index: 找不到 index.html " + idxPath);
  process.exit(1);
}

let html = fs.readFileSync(idxPath, "utf8");
const js = fs.readFileSync(jsPath, "utf8");

// 移除上一次注入的内容（若存在），保证幂等
const MARK_START = "<!-- t3zh:start -->";
const MARK_END = "<!-- t3zh:end -->";
const old = new RegExp(MARK_START + "[\\s\\S]*?" + MARK_END, "g");
const hadOld = old.test(html);
html = html.replace(old, "");

const block = MARK_START + "\n<script>\n" + js + "\n</script>\n" + MARK_END;

if (!html.includes("</body>")) {
  console.error("patch-index: index.html 里没有 </body>，无法注入");
  process.exit(1);
}
html = html.replace("</body>", block + "\n</body>");

// 语言标记（顺带让浏览器和字体回退走中文）
html = html.replace(/<html\s+lang="[^"]*"/i, '<html lang="zh-CN"');
if (!/<html\s+lang=/i.test(html)) {
  html = html.replace(/<html/i, '<html lang="zh-CN"');
}

fs.writeFileSync(idxPath, html, "utf8");

console.log("patch-index: " + (hadOld ? "replaced" : "injected") + ", html " + html.length + " bytes");
