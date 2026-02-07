# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于纯前端技术（HTML/CSS/JavaScript）的个人成长管理网站，采用 LocalStorage 进行数据持久化，无需后端服务器。项目包含三个核心功能模块：目标管理、学习笔记和习惯追踪。

## 技术栈

- **前端框架**: 纯 HTML/CSS/JavaScript（无框架）
- **数据存储**: LocalStorage
- **样式**: 原生 CSS，使用 CSS 变量系统
- **可选后端**: Flask (位于 `src/app.py` 和 `templates/`，仅用于本地开发预览)
- **部署**: GitHub Pages

## 项目结构

```
personal-website/
├── index.html              # 主入口文件（纯前端版本）
├── .nojekyll               # GitHub Pages 部署配置（禁止 Jekyll 处理）
├── CLAUDE.md               # 项目文档（本文件）
├── css/                    # 样式文件
│   ├── variables.css       # CSS 变量定义（颜色、间距、字体等）
│   ├── reset.css           # 样式重置
│   ├── base.css            # 基础样式
│   ├── layout.css          # 布局样式
│   ├── components/         # 组件样式
│   │   ├── navbar.css
│   │   ├── cards.css
│   │   ├── buttons.css
│   │   ├── forms.css
│   │   └── modals.css      # 模态框样式（注意：只有 .modal.active 才显示）
│   └── pages/
│       └── home.css        # 首页样式
├── js/                     # JavaScript 模块
│   ├── main.js             # 主入口
│   ├── utils/
│   │   ├── constants.js    # 常量定义（STORAGE_KEYS、状态映射等）
│   │   └── helpers.js      # 工具函数（日期格式化、存储操作等）
│   ├── components/         # UI 组件
│   │   ├── Navbar.js       # 导航栏
│   │   ├── Modal.js        # 模态框管理
│   │   └── Toast.js        # 消息提示
│   └── modules/            # 业务模块
│       ├── Goals.js        # 目标管理
│       ├── Notes.js        # 笔记管理
│       ├── Habits.js       # 习惯追踪
│       ├── Home.js         # 首页概览
│       └── DataManager.js  # 数据导入/导出
├── assets/                 # 资源文件
│   └── images/
│       └── avatar.svg      # 默认头像
├── src/                    # Flask 后端（可选）
│   └── app.py              # Flask 应用入口
├── templates/              # Flask 模板
│   └── index.html          # 使用 Flask 模板语法的版本
├── static/                 # Flask 静态文件目录
│   └── css/
│       └── style.css       # 基础样式（未完整实现）
└── .venv/                  # Python 虚拟环境
```

## 本地运行

### 纯前端版本（推荐）
直接在浏览器中打开 `index.html` 文件即可使用。

### Flask 版本（开发用）
```bash
# 激活虚拟环境
.venv\Scripts\activate  # Windows

# 运行 Flask
python src/app.py
```
访问 http://localhost:5000

## 已实现功能

### 1. 目标管理 (Goals.js)
- CRUD 操作（创建、读取、更新、删除）
- 目标状态管理（待开始、进行中、已完成）
- 优先级设置（低、中、高）
- 分类管理（学习、工作、健康、生活、其他）
- 目标筛选和过滤
- 目标完成进度统计
- 首页目标概览更新

### 2. 笔记管理 (Notes.js)
- CRUD 操作
- 标签系统（支持多标签）
- 搜索功能（标题和内容搜索）
- 标签筛选
- 笔记内容展开/收起
- 首页笔记概览更新
- 相对时间显示

### 3. 习惯追踪 (Habits.js)
- CRUD 操作
- 每日打卡功能
- 连续天数计算
- 习惯热力图（月度统计）
- 自定义习惯图标和颜色
- 首页习惯概览更新

### 4. 首页概览 (Home.js)
- 统一管理各模块的概览更新
- 头像上传和管理
- 快速操作按钮（直接跳转到对应模块的添加功能）
- "查看全部"链接处理
- 统计数据汇总

### 5. 数据管理 (DataManager.js)
- 导出所有数据为 JSON 文件
- 导入数据（覆盖现有数据）
- 数据格式验证
- 清除所有数据

### 6. 用户体验
- 响应式设计（移动端适配）
- 平滑动画过渡
- Toast 消息提示（成功、错误、警告、信息）
- 模态框系统
- 单页应用体验

## 代码架构要点

### 模块化设计
- 每个功能模块（Goals、Notes、Habits）都是独立的 Class
- 模块通过全局变量导出（如 `goals`、`notes`、`habits`），便于跨模块调用
- 组件之间通过自定义事件通信（如 `sectionChange` 事件）

### 数据流
- 所有数据存储在 LocalStorage 中，键名定义在 `CONSTANTS.STORAGE_KEYS`
- 数据操作通过 `Helpers.getFromStorage()` 和 `Helpers.saveToStorage()` 进行
- 每个模块负责自己的数据加载、保存和渲染

### 状态管理
- 目标状态: `pending`（待开始）、`in-progress`（进行中）、`completed`（已完成）
- 优先级: `low`（低）、`medium`（中）、`high`（高）
- 状态显示文本映射在 `CONSTANTS.STATUS_LABELS` 和 `CONSTANTS.PRIORITY_LABELS`

### 样式系统
- 使用 CSS 变量定义所有设计 token（颜色、间距、字体）
- 暖色调设计主题：主色为橙色 `#FF8C42`
- 响应式设计，使用 Flexbox 和 Grid 布局

## 开发规范和最佳实践

### 模块初始化规范

**所有模块必须添加 `isInited` 标志防止重复初始化：**

```javascript
class ModuleName {
    constructor() {
        this.isInited = false;
        // ...
        this.init();
    }

    init() {
        // 防止重复初始化
        if (this.isInited) {
            console.log('ModuleName.init(): 已初始化，跳过');
            return;
        }
        this.isInited = true;

        console.log('ModuleName.init() 开始');
        // 初始化逻辑...
    }
}
```

### 事件处理规范

**1. 使用命名函数便于调试：**
```javascript
// 推荐
const handleButtonClick = () => {
    console.log('按钮被点击');
    // ...
};
btn.addEventListener('click', handleButtonClick);

// 避免
btn.addEventListener('click', () => { /* ... */ });
```

**2. 使用事件委托减少监听器数量：**
```javascript
// 推荐（用于动态内容）
document.addEventListener('click', (e) => {
    const item = e.target.closest('.dynamic-item');
    if (item) {
        // 处理点击
    }
});
```

**3. 彻底阻止事件传播：**
```javascript
handler = (e) => {
    e.preventDefault();              // 阻止默认行为
    e.stopPropagation();              // 阻止冒泡
    e.stopImmediatePropagation();     // 阻止其他监听器
};
```

### 模态框操作规范

**快速操作按钮应直接调用模块方法，不使用 `click()` 触发：**

```javascript
// 推荐
btn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 切换到对应模块
    navbar?.showSection('notes');

    // 直接调用模块方法
    setTimeout(() => {
        modal?.closeAll();            // 先关闭所有模态框
        notes?.openAddModal();        // 再打开新模态框
    }, 150);
};

// 避免
addNoteBtn.click();  // 可能触发多个事件监听器
```

**模态框 CSS 样式注意事项：**
- 只有添加 `.active` 类的模态框才会显示
- 修改 `css/components/modals.css` 时需确保不影响其他模态框

### LocalStorage 数据结构

```javascript
// 目标
{
    id: string,           // 唯一标识
    title: string,        // 标题
    category: string,     // 分类：学习/工作/健康/生活/其他
    priority: string,     // 优先级：low/medium/high
    status: string,       // 状态：pending/in-progress/completed
    description: string,  // 描述
    createdAt: string,    // 创建时间（ISO）
    updatedAt: string     // 更新时间（ISO）
}

// 笔记
{
    id: string,
    title: string,
    content: string,
    tags: string[],       // 标签数组
    createdAt: string,
    updatedAt: string
}

// 习惯
{
    id: string,
    title: string,
    icon: string,         // emoji 图标
    color: string,        // 十六进制颜色
    checkDates: string[]  // 打卡日期数组（ISO 格式）
    createdAt: string,
    updatedAt: string
}
```

### 模块初始化顺序

在 `index.html` 中，脚本按以下顺序加载：
1. `constants.js` - 常量定义
2. `helpers.js` - 工具函数
3. `components/` - UI 组件（Navbar、Modal、Toast）
4. `modules/` - 业务模块（Goals、Notes、Habits、Home、DataManager）
5. `main.js` - 全局初始化

### 添加新功能模块

1. 在 `js/modules/` 创建新的模块文件
2. 在 `index.html` 中引入脚本（在 main.js 之前）
3. 在模块末尾导出全局变量
4. 在 `css/components/` 或 `css/pages/` 添加对应样式
5. 在 `js/main.js` 的 `window.App` 中导出（可选）

## 常见问题解决方案

### 问题：多个模态框同时显示

**现象：** 点击"添加笔记"按钮时，同时弹出目标、笔记、习惯三个模态框。

**原因：** CSS 选择器 `.modal-overlay.active .modal` 会导致所有模态框同时显示。

**解决方案：**
修改 `css/components/modals.css`，确保只有添加了 `.active` 类的模态框才显示：

```css
.modal {
    opacity: 0;
    visibility: hidden;
    position: absolute;
}

.modal.active {
    opacity: 1;
    visibility: visible;
}
```

**相关文件：** `css/components/modals.css`

### 问题：GitHub Pages 部署后样式或功能异常

**现象：** 本地正常，但部署到 GitHub Pages 后样式丢失或功能异常。

**原因：** GitHub Pages 默认使用 Jekyll 处理，可能忽略以 `_` 开头的文件或目录。

**解决方案：**
在仓库根目录添加 `.nojekyll` 文件（内容为空），禁止 Jekyll 处理。

```bash
# 创建 .nojekyll 文件
touch .nojekyll  # Linux/Mac
echo. > .nojekyll  # Windows

# 提交并推送
git add .nojekyll
git commit -m "Add .nojekyll for GitHub Pages"
git push origin main
```

### 问题：浏览器缓存导致更新未生效

**现象：** 代码已更新，但浏览器显示旧版本。

**解决方案：**
1. 使用无痕模式测试
2. 清除浏览器缓存后重试
3. 使用硬刷新：Ctrl+Shift+R（Windows）/ Cmd+Shift+R（Mac）

### 问题：快速操作按钮点击无响应

**现象：** 点击首页快速操作按钮没有反应。

**调试步骤：**
1. 检查浏览器控制台是否有错误
2. 确认对应模块是否已初始化：`console.log(typeof notes?.openAddModal)`
3. 检查事件监听器是否正确绑定

## 部署指南

### GitHub Pages 部署

**步骤：**

1. **确保仓库中有 `.nojekyll` 文件**
   ```bash
   ls .nojekyll  # 检查文件是否存在
   ```

2. **提交所有更改**
   ```bash
   git add .
   git commit -m "描述你的更改"
   git push origin main
   ```

3. **在 GitHub 仓库设置中启用 GitHub Pages**
   - 进入仓库 Settings
   - 左侧菜单选择 Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "main"
   - 点击 Save

4. **等待部署完成**
   - 通常需要 1-5 分钟
   - 部署成功后会显示访问链接

5. **验证部署**
   - 访问 `https://username.github.io/repository-name/`
   - 测试所有功能是否正常

**项目部署地址：** https://zayne630.github.io/personal-website/

## 调试指南

### 启用详细日志

所有模块的 `init` 方法中已有 `console.log`，可在浏览器控制台查看。

**检查模块初始化：**
```javascript
// 应该看到以下日志
Home init 开始
initQuickActions 开始
找到快速操作按钮数量: 3
...
```

### 检查模态框元素

```javascript
// 在浏览器控制台运行
document.querySelectorAll('.modal').length           // 应该返回 3
document.querySelectorAll('#noteModal').length       // 应该返回 1
document.querySelectorAll('#goalModal').length       // 应该返回 1
document.querySelectorAll('#habitModal').length      // 应该返回 1
```

### 检查数据存储

```javascript
// 查看所有 LocalStorage 数据
Object.keys(localStorage).filter(k => k.startsWith('personal_website_'))

// 查看特定模块数据
JSON.parse(localStorage.getItem('personal_website_goals'))
JSON.parse(localStorage.getItem('personal_website_notes'))
JSON.parse(localStorage.getItem('personal_website_habits'))
```

### 检查事件监听器

```javascript
// 检查按钮是否有事件监听器
const btn = document.getElementById('addNoteBtn');
console.log(getEventListeners(btn));  // Chrome DevTools
```

## 关键文件路径

- **入口文件**: `index.html`
- **常量定义**: `js/utils/constants.js`
- **工具函数**: `js/utils/helpers.js`
- **模态框样式**: `css/components/modals.css`
- **导航栏**: `js/components/Navbar.js`
- **文档**: `CLAUDE.md`

## 贡献指南

1. 遵循现有的代码风格和命名约定
2. 添加新功能时更新 CLAUDE.md
3. 修复 bug 时添加注释说明原因
4. 提交前本地测试所有功能
5. 使用清晰的 commit message

## License

MIT
