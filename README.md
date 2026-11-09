# T3 Code 简体中文补丁

给 [T3 Code](https://github.com/pingdotgg/t3code) 桌面版加简体中文界面。

不改源码、不重新分发二进制 —— 这是一套**补丁脚本 + 翻译表**，在你的机器上就地给官方安装包打上中文，
并且随时可以一键还原。

> 上游项目：`pingdotgg/t3code`（MIT）· 本补丁的适用版本：**0.1.7 (Beta)**
> 上游没有 i18n 框架，所以这不是"官方中文版"，是第三方文本替换层。

---

## 效果

界面主体、菜单、设置页、提示语、审批卡片基本都是中文。**代码、diff、终端输出、文件内容保持原样**
——这些翻了反而有害。

术语统一为：会话（thread）、项目（project）、供应商（provider）、代理（agent）、
工作树（worktree）、改动（diff）、收尾（settle）、置顶（pin）。

---

## 安装

需要：macOS、已安装 T3 Code 桌面版、Node.js（`node` 和 `npx` 可用）。

```sh
git clone https://github.com/<your-name>/t3code-zh.git
cd t3code-zh
sh install.sh
```

脚本会自动找到 `/Applications/T3 Code (Beta).app`，也可以手动指定：

```sh
sh install.sh "/Applications/T3 Code (Beta).app"
sh install.sh --no-launch          # 装完不自动启动
```

全过程大约 2-4 分钟（要解包并重新打包 137MB 的资源）。原应用会备份到
`~/.t3code-zh/backup/`。

**第一次打开会要求输入登录密码** —— 因为补丁后要重新签名（ad-hoc），macOS 认为
"这不是原来那个应用"，需要你授权它读钥匙串。点「始终允许」即可，之后不再询问。

---

## 卸载 / 还原官方版

```sh
sh uninstall.sh
```

优先用安装时保存的原始 `.app`（保留官方签名）还原。若备份不在，则需要从
[releases](https://github.com/pingdotgg/t3code/releases) 重装一次。

---

## 应用更新后

T3 Code 是日更节奏，更新会覆盖掉补丁。**重跑一次即可**：

```sh
sh install.sh
```

如果你的版本和翻译表对应的版本不同，可能会出现少量新增文案仍是英文 —— 这是正常的，
欢迎提 issue 或 PR 补词条。

---

## 原理

三层，各管一段，互不越界：

| 层 | 做法 | 覆盖 |
|---|---|---|
| **打包期：菜单标签** | 改写 `assets/*.js` 里 `label:` 后的字符串 | macOS 原生右键菜单、应用菜单栏 |
| **运行时：文本替换** | 在 `index.html` 注入脚本，改渲染后的文本节点 | 页面正文、按钮、提示、设置页 |
| **数据：翻译表** | `data/translations.json`，8175 条 | 上面两层共用 |

**为什么分两层**：macOS 的原生菜单由系统 API 绘制，不经过 DOM，运行时替换碰不到它；
反过来，把中文写进代码逻辑又可能破坏协议（比如被用作 HTTP 头的字符串，非 ISO-8859-1 会直接抛错）。
所以只对**确定用于显示**的 `label:` 做打包期改写，其余一律走运行时。

运行时层是幂等的、只改文本节点，不碰 `value`、不碰属性、不碰代码 —— 所以不会影响功能。

---

## 已知限制

- **只支持 macOS**（Windows / Linux 版路径结构不同）
- **ad-hoc 签名**：应用更新或重装后需要重新授权钥匙串；也无法通过 Gatekeeper 的公证检查
- **不是真正的国际化**：新增文案需要手工补词条，不会自动跟随上游
- **长尾覆盖**：日常界面基本干净；极深层的异常提示、部分第三方集成说明可能仍是英文
- **不分发二进制**：仓库里没有 `.app` 或 `.asar`，只有脚本和数据

---

## 参与

补词条最直接的方式：改 `data/translations.json`，键是英文原文，值是中文。

```json
{
  "New thread": "新建会话",
  "Settle thread": "收尾会话"
}
```

改完重跑 `sh install.sh` 生效。

提 PR 时请遵守既有术语表（见上「效果」一节），保持一致比"译得更好"更重要。

---

## 许可证

本补丁的脚本与翻译表以 **MIT** 发布，见 [LICENSE](LICENSE)。

T3 Code 本身版权归 T3 Tools, Inc.，以 MIT 授权，见
[上游仓库](https://github.com/pingdotgg/t3code)。本仓库**不包含**上游的任何二进制或源码，
仅提供修改脚本与翻译数据，详见 [NOTICE](NOTICE)。

---

## 免责声明

非官方项目，与 T3 Tools, Inc. 无关。修改应用包属于对软件的正常使用范畴，
但 ad-hoc 签名会降低该应用的代码完整性保护 —— 请自行评估。生产环境或涉密机器上建议不要使用。
