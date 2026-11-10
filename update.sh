#!/bin/sh
# T3 Code 简体中文补丁 — 一键更新
#
# 背景：打完补丁后应用是 ad-hoc 签名，Electron 自带的 Squirrel 更新器会因为
# 签名主体不一致（官方 Team ID vs 无 Team ID）而拒绝安装新版本。表现为
# "下载完成但装不上"或反复提示有新版。
#
# 所以更新改走这条路：自己去 GitHub 下官方包 → 替换 → 重新打补丁。
#
# 用法：
#   sh update.sh              # 更新到最新版
#   sh update.sh 0.1.8        # 装指定版本
#   sh update.sh --check      # 只检查有没有新版，不安装
set -e

HERE=$(cd "$(dirname "$0")" && pwd)
REPO="pingdotgg/t3code"
BACKUP="${T3ZH_BACKUP:-$HOME/.t3code-zh/backup}"

ARG_VER=""
CHECK_ONLY=0
for a in "$@"; do
  case "$a" in
    --check) CHECK_ONLY=1 ;;
    -*) echo "未知参数: $a"; exit 1 ;;
    *) ARG_VER="$a" ;;
  esac
done

# ---------- 定位应用 ----------
APP=""
for c in "/Applications/T3 Code (Beta).app" "/Applications/T3 Code.app"; do
  [ -d "$c" ] && APP="$c" && break
done
if [ -z "$APP" ]; then
  echo "✗ 找不到 T3 Code 应用"
  exit 1
fi

CUR=$(defaults read "$APP/Contents/Info.plist" CFBundleShortVersionString 2>/dev/null || echo "0")
echo "==> 当前版本: $CUR"

# ---------- 确定目标版本 ----------
if [ -n "$ARG_VER" ]; then
  TARGET="${ARG_VER#v}"
  echo "==> 目标版本: $TARGET（手动指定）"
  NEED_VER_CHECK=0
else
  echo "==> 查询最新版本"
  TARGET=$(curl -fsSL --max-time 20 "https://api.github.com/repos/$REPO/releases/latest" 2>/dev/null \
    | sed -n 's/.*"tag_name"[[:space:]]*:[[:space:]]*"v\{0,1\}\([^"]*\)".*/\1/p' | head -1)
  if [ -z "$TARGET" ]; then
    echo "✗ 查询失败（网络或 API 限制）。可直接指定版本：sh update.sh 0.1.8"
    exit 1
  fi
  echo "==> 最新版本: $TARGET"
  NEED_VER_CHECK=1
fi

# ---------- 判断是否需要更新 ----------
if [ "$NEED_VER_CHECK" = "1" ] && [ "$CUR" = "$TARGET" ]; then
  echo "==> 已是最新版，无需更新"
  exit 0
fi
if [ "$CHECK_ONLY" = "1" ]; then
  if [ "$CUR" = "$TARGET" ]; then
    echo "==> 已是最新版"
  else
    echo "==> 有新版本：$CUR -> $TARGET（运行 sh update.sh 安装）"
  fi
  exit 0
fi

# ---------- 架构 ----------
case "$(uname -m)" in
  arm64)  ARCH="arm64" ;;
  x86_64) ARCH="x64" ;;
  *) echo "✗ 不支持的架构: $(uname -m)"; exit 1 ;;
esac

ZIP_NAME="T3-Code-$TARGET-$ARCH.zip"
ZIP_URL="https://github.com/$REPO/releases/download/v$TARGET/$ZIP_NAME"
WORK=$(mktemp -d /tmp/t3upd.XXXXXX)
trap 'rm -rf "$WORK"' EXIT

# ---------- 下载 ----------
echo "==> 下载 $ZIP_NAME"
if ! curl -fL --retry 2 --progress-bar -o "$WORK/t3.zip" "$ZIP_URL"; then
  echo "✗ 下载失败：$ZIP_URL"
  exit 1
fi
SIZE=$(wc -c < "$WORK/t3.zip" | tr -d ' ')
echo "==> 已下载 $((SIZE / 1024 / 1024)) MB"

# ---------- 校验（用 GitHub API 提供的 sha256） ----------
EXPECT=$(curl -fsSL --max-time 20 "https://api.github.com/repos/$REPO/releases/tags/v$TARGET" 2>/dev/null \
  | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    for a in d.get('assets', []):
        if a.get('name') == '$ZIP_NAME':
            print((a.get('digest') or '').replace('sha256:', ''))
            break
except Exception:
    pass
" 2>/dev/null)

if [ -n "$EXPECT" ]; then
  ACTUAL=$(shasum -a 256 "$WORK/t3.zip" | awk '{print $1}')
  if [ "$ACTUAL" != "$EXPECT" ]; then
    echo "✗ 校验失败，已中止"
    echo "  期望: $EXPECT"
    echo "  实际: $ACTUAL"
    exit 1
  fi
  echo "==> 校验通过"
else
  echo "==> 无校验值，跳过（HTTPS 传输）"
fi

# ---------- 解压 ----------
echo "==> 解压"
ditto -x -k "$WORK/t3.zip" "$WORK/x" 2>/dev/null || unzip -q "$WORK/t3.zip" -d "$WORK/x"
NEW=$(find "$WORK/x" -maxdepth 2 -name "*.app" -print -quit)
if [ -z "$NEW" ] || [ ! -d "$NEW" ]; then
  echo "✗ 解压后找不到 .app"
  exit 1
fi
NEWVER=$(defaults read "$NEW/Contents/Info.plist" CFBundleShortVersionString 2>/dev/null || echo "?")
echo "==> 包内版本: $NEWVER"
if [ "$NEWVER" != "$TARGET" ]; then
  echo "✗ 版本不符（期望 $TARGET，实际 $NEWVER）"
  exit 1
fi

# ---------- 关闭应用 ----------
echo "==> 关闭 T3 Code"
pkill -f "T3 Code" 2>/dev/null || true
sleep 3
pkill -9 -f "T3 Code" 2>/dev/null || true
sleep 1

# ---------- 替换（先移走，失败可回滚） ----------
echo "==> 替换应用"
mkdir -p "$BACKUP"
OLD="$WORK/old.app"
mv "$APP" "$OLD"
if ! ditto "$NEW" "$APP"; then
  echo "✗ 复制失败，正在回滚"
  rm -rf "$APP"
  mv "$OLD" "$APP"
  exit 1
fi
xattr -dr com.apple.quarantine "$APP" 2>/dev/null || true
echo "==> 官方 $NEWVER 已就位（签名: $(codesign -dv "$APP" 2>&1 | sed -n 's/.*TeamIdentifier=//p' | head -1)）"

# ---------- 打补丁 ----------
echo "==> 重新应用汉化补丁"
sh "$HERE/install.sh"

echo
echo "==> 更新完成：$CUR -> $NEWVER（已汉化）"
echo "    若要回退到未汉化的官方版：sh uninstall.sh"
