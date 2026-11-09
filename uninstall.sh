#!/bin/sh
# T3 Code 简体中文补丁 — 还原官方版
#
# 优先用安装时保存的原始 .app（保留官方签名）；
# 若找不到，则用备份的 app.asar 还原并重新签名。
#
# 用法：
#   sh uninstall.sh                    # 自动查找 T3 Code
#   sh uninstall.sh "/path/to/App.app"
set -e

HERE=$(cd "$(dirname "$0")" && pwd)
BACKUP="${T3ZH_BACKUP:-$HOME/.t3code-zh/backup}"

ARG_APP=""
for a in "$@"; do
  case "$a" in
    -*) echo "未知参数: $a"; exit 1 ;;
    *) ARG_APP="$a" ;;
  esac
done

if [ -n "$ARG_APP" ]; then
  APP="$ARG_APP"
else
  for c in "/Applications/T3 Code (Beta).app" "/Applications/T3 Code.app"; do
    [ -d "$c" ] && APP="$c" && break
  done
fi
if [ -z "$APP" ] || [ ! -d "$APP" ]; then
  echo "✗ 找不到 T3 Code 应用"
  exit 1
fi
APP=$(cd "$(dirname "$APP")" && pwd)/$(basename "$APP")
RES="$APP/Contents/Resources"

VER=$(defaults read "$APP/Contents/Info.plist" CFBundleShortVersionString 2>/dev/null || echo "unknown")
echo "==> 目标应用: $APP (版本 $VER)"

echo "==> 退出 T3 Code"
pkill -f "T3 Code" 2>/dev/null || true
sleep 2
pkill -9 -f "T3 Code" 2>/dev/null || true
sleep 1

# 方案一：用安装时保存的完整原始 app（签名完好）
ORIG=$(ls -dt "$BACKUP"/replaced-*.app 2>/dev/null | head -1 || true)
if [ -n "$ORIG" ] && [ -d "$ORIG" ]; then
  echo "==> 从 $ORIG 还原（保留官方签名）"
  TMP="$APP.t3zh-restore"
  rm -rf "$TMP"
  ditto "$ORIG" "$TMP"
  rm -rf "$APP"
  mv "$TMP" "$APP"
  echo "==> 已还原"
  env -u ELECTRON_RUN_AS_NODE open -a "$APP" 2>/dev/null || true
  exit 0
fi

# 方案二：用备份的 asar 还原，再重签名
BK="$BACKUP/app-$VER.asar"
if [ ! -f "$BK" ]; then
  echo "✗ 找不到备份（$BACKUP）。"
  echo "  最省事的办法：从 https://github.com/pingdotgg/t3code/releases 重新安装官方版。"
  exit 1
fi

echo "==> 用备份 $BK 还原 app.asar"
ditto "$BK" "$RES/app.asar"
codesign --force --deep --sign - "$APP" 2>&1 | tail -1
echo "==> 已还原（已重新签名）"
env -u ELECTRON_RUN_AS_NODE open -a "$APP" 2>/dev/null || true
