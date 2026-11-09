// 改写打包产物中的原生菜单标签。
//
// 为什么需要这一步：macOS 的原生右键菜单由主进程用系统 API 绘制，
// 不经过 DOM，运行时的文本替换碰不到它。只能在打包时改字符串。
//
// 只改 `label:` 后面的反引号字面量——这类字符串只用于显示，不参与协议，
// 所以不会出现"中文写进 HTTP 头导致请求失败"这类问题。
//
// 用法：node scripts/patch-labels.mjs <assets 目录>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const dir = process.argv[2];
if (!dir || !fs.existsSync(dir)) {
  console.error("patch-labels: 需要传入 assets 目录，例如 .../apps/server/dist/client/assets");
  process.exit(1);
}

const dict = JSON.parse(fs.readFileSync(path.join(root, "data", "translations.json"), "utf8"));

// 只接受"看起来像界面标签"的原文：字母开头、不含插值、长度合理
const OK = /^[A-Za-z][A-Za-z0-9 ,'’\-:!?()/&%+.…]*$/;
const MIN_LEN = 2;

let changed = 0;
let files = 0;
const misses = new Set();

for (const name of fs.readdirSync(dir)) {
  if (!name.endsWith(".js")) continue;
  const full = path.join(dir, name);
  const before = fs.readFileSync(full, "utf8");
  let count = 0;

  // 覆盖两种情况：label:`Xxx`  和  label: cond ? `Aaa` : `Bbb`
  const after = before.replace(/(label:\s*(?:[^`]{0,120}?\?\s*)?)`([^`$]{2,90})`/g, (whole, prefix, label) => {
    if (label.length < MIN_LEN) return whole;
    if (!OK.test(label)) return whole;
    const zh = dict[label];
    if (!zh || zh === label) {
      if (label.length > 2) misses.add(label);
      return whole;
    }
    count++;
    return prefix + "`" + zh + "`";
  });

  if (count > 0) {
    fs.writeFileSync(full, after, "utf8");
    changed += count;
    files++;
  }
}

console.log("patch-labels: " + changed + " labels in " + files + " files");
if (misses.size) {
  const list = [...misses].slice(0, 12);
  console.log("patch-labels: " + misses.size + " untranslated labels (first few): " + list.join(" | "));
}
