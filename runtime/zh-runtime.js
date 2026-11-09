(function () {
  if (window.__t3zhLoaded) return;
  window.__t3zhLoaded = true;

  var P = {
    "New thread": "新建会话", "New Thread": "新建会话", "New chat": "新建对话",
    "New project": "新建项目", "New worktree": "新建工作树", "New terminal": "新建终端",
    "Open thread": "打开会话", "Open chat": "打开对话", "Open file": "打开文件",
    "Open diff": "打开改动", "Open in editor": "在编辑器中打开", "Open in Finder": "在 Finder 中打开",
    "Open sign-in page": "打开登录页", "Open pull request": "打开合并请求",
    "Copy path": "复制路径", "Copy link": "复制链接", "Copy code": "复制代码",
    "Copy command": "复制命令", "Copy thread": "复制会话", "Copy trace ID": "复制跟踪 ID",
    "Copy prompt link": "复制提示链接", "Branch name copied": "已复制分支名", "Branch copied": "已复制分支",
    "Sign in": "登录", "Sign out": "退出登录", "Use a different account": "使用其他账号",
    "Change account": "切换账号", "Finishing sign-in...": "正在完成登录…",
    "Settings": "设置", "Appearance": "外观", "General": "常规", "Advanced": "高级",
    "Keybindings": "快捷键", "Notifications": "通知", "Providers": "供应商",
    "Environment": "环境", "Environments": "环境", "Sharing & access": "共享与访问",
    "Secrets": "密钥", "Chat": "对话", "Behavior": "行为", "Usage": "用量", "Limits": "额度",
    "Usage limits": "额度限制", "Usage limit reached": "额度已用尽",
    "Text generation": "文本生成", "Custom models": "自定义模型",
    "Environment overrides": "环境变量覆盖", "Project settings": "项目设置",
    "Project actions": "项目操作", "Project scripts": "项目脚本",
    "Add project": "添加项目", "Add provider": "添加供应商", "Add environment": "添加环境",
    "Add action": "添加操作", "Add theme": "添加主题", "Add to favorites": "加入收藏",
    "Add to chat": "添加到对话", "Add to agent": "添加给代理", "Add hub": "添加中继",
    "Remove": "移除", "Remove project": "移除项目", "Remove from favorites": "取消收藏",
    "Save": "保存", "Save changes": "保存更改", "Setting not saved": "设置未保存",
    "Cancel": "取消", "Apply": "应用", "Back": "返回", "Next": "下一步",
    "Close": "关闭", "Confirm close?": "确认关闭？", "Done": "完成",
    "Retry": "重试", "Retry update": "重试更新", "Refresh": "刷新",
    "Refresh provider status": "刷新供应商状态", "Edit": "编辑", "Edit comment": "编辑评论",
    "Edit theme": "编辑主题", "Delete": "删除", "Rename": "重命名", "Duplicate": "创建副本",
    "Pin": "置顶", "Unpin": "取消置顶", "Pin project": "置顶项目",
    "Pin thread": "置顶会话", "Unpin thread": "取消置顶", "Failed to pin thread": "置顶会话失败",
    "Failed to unpin thread": "取消置顶失败",
    "Settle": "收尾", "Un-settle": "取消收尾", "Settle thread": "收尾会话",
    "Failed to settle thread": "收尾失败", "Failed to un-settle thread": "取消收尾失败",
    "Snooze": "稍后提醒", "Could not snooze thread": "无法延后该会话",
    "Archive": "归档", "Archive thread": "归档会话", "Failed to unarchive project": "取消归档项目失败",
    "Mark unread": "标记未读", "Mark read": "标记已读",
    "Regenerate title": "重新生成标题", "Untitled thread": "未命名会话",
    "Auto-settle behavior": "自动收尾行为",
    "Auto-settle inactive threads": "自动收尾闲置会话",
    "Auto-settle merged threads": "自动收尾已合并会话",
    "Automatic worktree cleanup": "自动清理工作树",
    "Filter by Agent": "按代理筛选", "Parent thread": "父会话",
    "Find in thread": "在会话中查找", "Search project contents": "搜索项目内容",
    "Search labels": "搜索标签", "Search settings": "搜索设置", "Search registry": "搜索注册表",
    "Show file tree": "显示文件树", "Hide file tree": "隐藏文件树",
    "Running": "运行中", "Working": "进行中", "Waiting": "等待中", "Queued": "排队中",
    "Thinking": "思考中", "Loading": "加载中", "Failed": "失败", "Done": "完成",
    "Failed to send message.": "发送消息失败。", "Failed to wake thread": "唤醒会话失败",
    "Failed to add project": "添加项目失败", "Failed to open project": "打开项目失败",
    "Failed to copy path": "复制路径失败", "Failed to save action.": "保存操作失败。",
    "Failed to add backend.": "添加后端失败。", "Could not add backend": "无法添加后端",
    "Could not open the link": "无法打开链接", "Could not read this file.": "无法读取该文件。",
    "Unable to open file": "无法打开文件", "Unable to open file in browser": "无法在浏览器中打开文件",
    "Unable to reveal file": "无法定位文件", "Unable to add to chat": "无法添加到对话",
    "The file is unavailable.": "文件不可用。", "The file could not be loaded. Close it and try again.": "无法加载文件，请关闭后重试。",
    "The environment is not connected.": "环境未连接。",
    "Environment disconnected": "环境已断开", "Environment unavailable": "环境不可用",
    "Reconnect to the environment and try again.": "重新连接环境后再试。",
    "This is not a readable ZIP archive.": "这不是可读的 ZIP 压缩包。",
    "An archive path is too long to preview.": "压缩包内路径过长，无法预览。",
    "An archive entry is too large or damaged.": "压缩包内条目过大或已损坏。",
    "This archive contains more than 2,048 entries.": "压缩包条目超过 2,048 个。",
    "Branch is up to date. No action needed.": "分支已是最新，无需操作。",
    "Branch deleted": "分支已删除", "Branch prefix": "分支前缀",
    "Relative paths require an active project.": "相对路径需要先有活跃项目。",
    "Try again from the project, or open a thread first.": "请从项目中重试，或先打开一个会话。",
    "Project icon is too large to decode.": "项目图标过大，无法解析。",
    "Choose project icon": "选择项目图标", "Choose icon": "选择图标",
    "Choose model": "选择模型", "Choose project": "选择项目",
    "Change theme": "切换主题", "Change appearance": "切换外观",
    "Change shortcut": "修改快捷键", "Create theme": "创建主题", "Create link": "创建链接",
    "Diff layout": "改动布局", "Git Commit Message": "Git 提交信息",
    "Git Rebase Message": "Git 变基信息", "File picker": "文件选择器",
    "Reveal in File Explorer": "在文件管理器中显示",
    "Agent access": "代理访问", "Agent browser access": "代理浏览器访问",
    "Publish agent activity": "公开代理活动", "Ask agent": "询问代理",
    "Asked in a thread": "已在会话中询问",
    "Supervised": "监督模式", "Auto-accept edits": "自动接受编辑",
    "Auto": "自动", "Full access": "完全放行", "Permission mode": "权限模式",
    "Approve": "同意", "Decline": "拒绝", "Allow": "允许", "Deny": "拒绝",
    "Always allow": "总是允许", "Approve once": "仅此次同意",
    "Approve workflows to run": "批准要运行的工作流",
    "Worktree": "工作树", "Current checkout": "当前检出", "Branch": "分支",
    "Commit": "提交", "Push": "推送", "Pull request": "合并请求",
    "Pull requests": "合并请求", "Diff": "改动", "Changes": "变更",
    "Files": "文件", "Terminal": "终端", "Browser": "浏览器", "Editor": "编辑器",
    "Preview": "预览", "Review": "审阅", "Revert": "回退", "Restore": "恢复",
    "Model": "模型", "Models": "模型", "Reasoning": "推理强度",
    "Default": "默认", "Custom": "自定义", "Low": "低", "Medium": "中", "High": "高",
    "Plan": "计划", "Build": "执行", "Send": "发送", "Stop": "停止", "Attach": "附件",
    "Subagent": "子代理", "Subagents": "子代理", "Skills": "技能", "Commands": "命令",
    "Automations": "自动化", "Scheduled": "定时任务", "Layout": "布局",
    "Theme": "主题", "Light": "浅色", "Dark": "深色", "System": "跟随系统",
    "Font size": "字号", "About": "关于", "Version": "版本", "Update": "更新",
    "Checking for updates…": "正在检查更新…", "You're up to date": "已是最新版本",
    "Workspace": "工作区", "Session": "会话窗口", "Weekly": "每周",
    "Reset": "重置", "Resets": "重置", "Cost": "成本", "Tokens": "Token",
    "Context": "上下文", "Context window": "上下文窗口", "Compaction": "上下文压缩",
    "Local ACP command": "本地 ACP 命令", "ACP Registry": "ACP 注册表",
    "Show more": "显示更多", "Executable": "可执行文件", "Arguments": "参数",
    "Variables": "变量", "Label": "名称", "Instance ID": "实例 ID",
    "Accent color": "强调色", "Add instance": "添加实例",
    "Add project script": "添加项目脚本", "Add project base directory": "添加项目根目录",
    "Add route": "添加路由", "Add to another machine": "添加到其他机器",
    "No project": "无项目", "This workspace has no project.": "此工作区没有项目。"
  };

  Object.assign(P, {
    "Jump to latest": "跳到最新", "Scroll to bottom": "滚动到底部",
    "Expand": "展开", "Collapse": "折叠", "More": "更多", "Less": "收起",
    "Actions": "操作", "Details": "详情", "More actions": "更多操作",
    "Files changed": "变更文件", "Unstaged changes": "未暂存的改动",
    "Staged changes": "已暂存的改动", "All changes": "全部改动",
    "Amend": "修补提交", "Create branch": "创建分支", "Switch branch": "切换分支",
    "Pull": "拉取", "Fetch": "获取", "Sync": "同步", "Merge": "合并", "Rebase": "变基",
    "Discard": "丢弃", "Stage": "暂存", "Unstage": "取消暂存",
    "Approve and run": "批准并运行", "Run command": "运行命令",
    "Waiting for approval": "等待批准", "Needs your input": "需要你确认",
    "New message": "新消息", "Unread": "未读",
    "Read only": "只读", "Read and write": "读写",
    "Connected": "已连接", "Disconnected": "已断开",
    "Retry connection": "重试连接", "Copy error": "复制错误",
    "Show details": "显示详情", "Hide details": "隐藏详情"
  });

  var W = {
    "threads": "会话", "thread": "会话", "projects": "项目", "project": "项目",
    "worktrees": "工作树", "worktree": "工作树", "providers": "供应商", "provider": "供应商",
    "permissions": "权限", "permission": "权限", "sessions": "会话", "session": "会话",
    "agents": "代理", "agent": "代理", "messages": "消息", "message": "消息",
    "models": "模型", "model": "模型", "usage": "用量", "limits": "额度", "limit": "额度",
    "branches": "分支", "branch": "分支", "commits": "提交", "commit": "提交",
    "diffs": "改动", "diff": "改动", "files": "文件", "file": "文件",
    "folders": "文件夹", "folder": "文件夹", "workspace": "工作区",
    "environments": "环境", "environment": "环境", "tokens": "Token", "token": "Token",
    "accounts": "账号", "account": "账号", "notifications": "通知", "notification": "通知",
    "themes": "主题", "theme": "主题", "settings": "设置", "setting": "设置",
    "search": "搜索", "archives": "归档", "archive": "归档", "snooze": "稍后提醒",
    "delete": "删除", "remove": "移除", "save": "保存", "cancel": "取消",
    "apply": "应用", "rename": "重命名", "retry": "重试", "loading": "加载中",
    "waiting": "等待中", "working": "进行中", "open": "打开", "close": "关闭",
    "select": "选择", "copy": "复制", "edit": "编辑", "run": "运行",
    "start": "开始", "stop": "停止", "create": "创建", "add": "添加",
    "failed": "失败", "failure": "失败", "error": "错误", "warning": "警告",
    "enabled": "已启用", "disabled": "已禁用", "default": "默认",
    "terminal": "终端", "browser": "浏览器", "editor": "编辑器",
    "preview": "预览", "review": "审阅", "revert": "回退", "restore": "恢复",
    "skills": "技能", "commands": "命令", "shortcuts": "快捷键", "shortcut": "快捷键",
    "appearance": "外观", "advanced": "高级", "general": "常规",
    "sign in": "登录", "sign out": "退出登录"
  };

  var RULES = [
    [/^Ask anything[:：]?\s*.*$/i, "想问什么…"],
    [/^Worked for (.+)$/i, "用时 $1"],
    [/^Working for (.+)$/i, "已运行 $1"],
    [/^Thinking for (.+)$/i, "思考中 $1"],
    [/^Run on (.+)$/i, "运行于 $1"],
    [/^(\d+) threads?$/i, "$1 个会话"],
    [/^(\d+) projects?$/i, "$1 个项目"],
    [/^(\d+) files?$/i, "$1 个文件"],
    [/^(\d+) (files? )?changed$/i, "$1 个文件已变更"]
  ];

  var keys = Object.keys(W).sort(function (a, b) { return b.length - a.length; });
  var WORD_RE = new RegExp("\\b(" + keys.join("|") + ")\\b", "gi");

  var SKIP_TAGS = {
    PRE: 1, CODE: 1, SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1,
    KBD: 1, SAMP: 1, SVG: 1, CANVAS: 1
  };

  function inCode(el) {
    var n = el;
    while (n && n.nodeType === 1) {
      if (SKIP_TAGS[n.tagName]) return true;
      var cls = n.className;
      if (typeof cls === "string" && /(^|\s)(monaco|cm-editor|diff|code)/.test(cls)) return true;
      n = n.parentElement;
    }
    return false;
  }

  function translate(raw) {
    var lead = raw.match(/^\s*/)[0];
    var trail = raw.match(/\s*$/)[0];
    var core = raw.slice(lead.length, raw.length - trail.length);
    if (!core) return null;

    if (P.hasOwnProperty(core)) return lead + P[core] + trail;

    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][0].test(core)) {
        return lead + core.replace(RULES[i][0], RULES[i][1]) + trail;
      }
    }

    // No word-by-word fallback: partial substitution produced mixed output
    // such as "通知 only", which reads worse than leaving the line in English.
    // Anything not covered by the table stays as-is until it is added.

    if (/^[A-Za-z]{3,}$/.test(core)) {
      var single = W[core.toLowerCase()];
      if (single) return lead + single + trail;
    }

    return null;
  }

  var ATTRS = ["placeholder", "title", "aria-label"];

  function walk(node) {
    if (node.nodeType === 3) {
      var p = node.parentElement;
      if (!p || inCode(p)) return;
      var r = translate(node.nodeValue);
      if (r !== null) node.nodeValue = r;
      return;
    }
    if (node.nodeType !== 1) return;
    if (inCode(node)) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var v = node.getAttribute(ATTRS[i]);
      if (v) {
        var nv = translate(v);
        if (nv !== null) node.setAttribute(ATTRS[i], nv);
      }
    }
    for (var c = node.firstChild; c; c = c.nextSibling) walk(c);
  }

  function scan() {
    if (!document.body) return;
    walk(document.body);
  }

  scan();
  document.addEventListener("DOMContentLoaded", scan);

  var pending = null;
  function schedule() {
    if (pending) return;
    pending = requestAnimationFrame(function () {
      pending = null;
      scan();
    });
  }

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true, subtree: true, characterData: true
  });

  // Menus, popovers and portals sometimes mount outside the observed path or
  // arrive in bursts that the frame callback coalesces away. A cheap periodic
  // sweep plus pointer/key triggers keeps them covered.
  document.addEventListener("pointerdown", function () { setTimeout(scan, 0); setTimeout(scan, 120); }, true);
  document.addEventListener("contextmenu", function () { setTimeout(scan, 0); setTimeout(scan, 120); }, true);
  document.addEventListener("click", function () { setTimeout(scan, 120); }, true);
  setInterval(scan, 1200);
})();
