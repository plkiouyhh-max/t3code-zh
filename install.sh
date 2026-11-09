#!/bin/sh
# T3 Code 简体中文补丁 — 安装 / 重新应用
#
# 应用更新后重跑本脚本即可恢复中文。
#
# 用法：
#   sh install.sh                      # 自动查找 T3 Code
#   sh install.sh "/path/to/App.app"   # 指定应用路径
#   sh install.sh --no-launch          # 装完不自动启动
set -e

HERE=$(cd "$(dirname "$0")" && pwd)
BACKUP="${T3ZH_BACKUP:-$HOME/.t3code-zh/backup}"

ARG_APP=""
LAUNCH=1
for a in "$@"; do
  case "$a" in
    --no-launch) LAUNCH=0 ;;
    -*) echo "未知参数: $a"; exit 1 ;;
    *) ARG_APP="$a" ;;
  esac
done

# ---------- 定位应用 ----------
if [ -n "$ARG_APP" ]; then
  APP="$ARG_APP"
else
  for c in "/Applications/T3 Code (Beta).app" "/Applications/T3 Code.app"; do
    [ -d "$c" ] && APP="$c" && break
  done
fi
if [ -z "$APP" ] || [ ! -d "$APP" ]; then
  echo "✗ 找不到 T3 Code 应用。请先安装，或用参数指定路径："
  echo "    sh install.sh \"/Applications/T3 Code (Beta).app\""
  exit 1
fi
APP=$(cd "$(dirname "$APP")" && pwd)/$(basename "$APP")
RES="$APP/Contents/Resources"
SRC="$RES/app.asar"
UNP="$RES/app.asar.unpacked"

echo "==> 目标应用: $APP"
[ -f "$SRC" ] || { echo "✗ 缺少 $SRC"; exit 1; }

# ---------- 依赖检查 ----------
for c in node npx codesign ditto; do
  command -v "$c" >/dev/null 2>&1 || { echo "✗ 缺少命令: $c"; exit 1; }
done

VER=$(defaults read "$APP/Contents/Info.plist" CFBundleShortVersionString 2>/dev/null || echo "unknown")
echo "==> 应用版本: $VER"

WORK=$(mktemp -d /tmp/t3zh.XXXXXX)
STAGE="$WORK/staged.app"
cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT

# ---------- 备份原始 asar（首次安装或版本变化时） ----------
# 判定一个 asar 是否"已经是打过补丁的"：新版本用 <!-- t3zh:start --> 注释标记，
# 早期版本用 __t3zhLoaded 全局变量。两个都要查，否则会把汉化版误当成官方版。
is_patched() {
  grep -a -q -e "t3zh:start" -e "__t3zhLoaded" "$1" 2>/dev/null
}

mkdir -p "$BACKUP"
BK="$BACKUP/app-$VER.asar"
if [ ! -f "$BK" ]; then
  if is_patched "$SRC"; then
    echo "✗ 当前安装已经是打过补丁的版本，没有可用的干净备份。"
    echo "  请先从 https://github.com/pingdotgg/t3code/releases 重装官方版 $VER，再运行本脚本。"
    exit 1
  fi
  echo "==> 备份原始资源到 $BK"
  ditto "$SRC" "$BK"
else
  echo "==> 已存在同版本干净备份，跳过备份"
fi
echo "$VER" > "$BACKUP/last-version.txt"

# ---------- 退出应用 ----------
echo "==> 退出 T3 Code"
pkill -f "T3 Code" 2>/dev/null || true
sleep 2
pkill -9 -f "T3 Code" 2>/dev/null || true
sleep 1

# ---------- 解包 ----------
# 关键：始终从干净备份解包。若从已打过补丁的包解包，补丁里的中文会被当成
# "原文"一层层叠加，越打越脏。
#
# 另一个坑：asar 里若含 unpack 过的文件（node-pty 等原生模块），解包时必须能在
# "$BK.unpacked" 找到它们，否则会报一堆 ENOENT。这些模块我们不修改，直接软链
# 到当前安装的 unpacked 目录即可，不额外占空间。
echo "==> 解包 app.asar"
if [ ! -d "$BK.unpacked" ]; then
  [ -d "$UNP" ] && ln -sfn "$UNP" "$BK.unpacked"
fi
if ! npx --yes @electron/asar extract "$BK" "$WORK/app" >"$WORK/extract.log" 2>&1; then
  echo "✗ 解包失败。前几行错误："
  head -6 "$WORK/extract.log"
  exit 1
fi

ASSETS="$WORK/app/apps/server/dist/client/assets"
INDEX="$WORK/app/apps/server/dist/client/index.html"
[ -d "$ASSETS" ] || { echo "✗ 解包后找不到 assets 目录（版本结构可能已变）"; exit 1; }
[ -f "$INDEX" ] || { echo "✗ 解包后找不到 index.html"; exit 1; }

# 原生模块（node-pty 等）不在 asar 里，要合并进来才能重新打包
if [ -d "$UNP" ]; then
  echo "==> 合并原生模块"
  ditto "$UNP/" "$WORK/app/"
fi

# ---------- 打补丁 ----------
echo "==> 改写原生菜单标签"
node "$HERE/scripts/patch-labels.mjs" "$ASSETS"

echo "==> 生成运行时翻译层"
node "$HERE/scripts/build-inject.mjs" "$WORK/zh-full.js"

echo "==> 注入运行时翻译"
node "$HERE/scripts/patch-index.mjs" "$WORK/zh-full.js" "$INDEX"

# ---------- 重新打包 ----------
echo "==> 重新打包"
PACK="$WORK/app.bin"
npx --yes @electron/asar pack "$WORK/app" "$PACK" --unpack-dir node_modules >/dev/null

# ---------- 暂存 + 签名 ----------
echo "==> 暂存并签名（ad-hoc）"
ditto "$APP" "$STAGE"
ditto "$PACK" "$STAGE/Contents/Resources/app.asar"
rm -rf "$STAGE/Contents/Resources/app.asar.unpacked"
ditto "$PACK.unpacked" "$STAGE/Contents/Resources/app.asar.unpacked"

if [ -f "$HERE/scripts/entitlements.plist" ]; then
  codesign --force --deep --sign - --entitlements "$HERE/scripts/entitlements.plist" "$STAGE" 2>&1 | tail -1
else
  codesign --force --deep --sign - "$STAGE" 2>&1 | tail -1
fi
codesign --verify --deep --strict "$STAGE" 2>/dev/null || { echo "✗ 签名校验失败，已中止（原应用未改动）"; exit 1; }

# ---------- 替换 ----------
echo "==> 替换应用"
OLD="$BACKUP/replaced-$(date +%Y%m%d-%H%M%S).app"
# 只有当被替换的是"官方原版"时才值得留一份完整副本（可保留官方签名）。
# 若它本身已是汉化版，留着没用，还会白占 460MB。
KEEP_OLD=1
is_patched "$SRC" && KEEP_OLD=0

mv "$APP" "$OLD"
if ! ditto "$STAGE" "$APP"; then
  echo "✗ 复制失败，正在回滚"
  rm -rf "$APP"
  mv "$OLD" "$APP"
  exit 1
fi

if [ "$KEEP_OLD" = "1" ]; then
  echo "==> 完成（原官方版已保存到 $OLD）"
else
  rm -rf "$OLD"
  echo "==> 完成（原安装已是汉化版，未保留副本）"
fi

if [ "$LAUNCH" = "1" ]; then
  echo "==> 启动"
  # 某些终端环境会带 ELECTRON_RUN_AS_NODE，会让 Electron 以 Node 模式秒退
  env -u ELECTRON_RUN_AS_NODE open -a "$APP" 2>/dev/null || open -a "$APP" || true
fi

cat <<'EOF'

提示：
  · 首次打开可能要求输入登录密码（钥匙串授权，因为签名变了）。点「始终允许」。
  · 应用更新后中文会失效，重跑本脚本即可。
  · 想还原官方版：sh uninstall.sh
EOF
