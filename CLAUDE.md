# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于纯前端技术（HTML/CSS/JavaScript）的个人成长管理网站，采用 LocalStorage 进行数据持久化，无需后端服务器。项目包含三个核心功能模块：目标管理、学习笔记和习惯追踪。

## 技术栈

- **前端框架**: 纯 HTML/CSS/JavaScript（无框架）
- **数据存储**: LocalStorage
- **样式**: 原生 CSS，使用 CSS 变量系统
- **可选后端**: Flask (位于 `src/app.py` 和 `templates/`，仅用于本地开发预览)

## 项目结构

```
personal-website/
├── index.html              # 主入口文件（纯前端版本）
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
│   │   └── modals.css
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

## 代码架构要点

### 模块化设计
- 每个功能模块（Goals、Notes、Habits）都是独立的 Class
- 模块通过 `window.App` 全局导出，便于跨模块调用
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

## 关键约定

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
    checkIns: string[]    // 打卡日期数组（ISO 格式）
}
```

### 模块初始化顺序
1. `constants.js` - 常量定义
2. `helpers.js` - 工具函数
3. `components/` - UI 组件
4. `modules/` - 业务模块
5. `main.js` - 全局初始化

### 添加新功能模块
1. 在 `js/modules/` 创建新的模块文件
2. 在 `index.html` 中引入脚本
3. 在 `js/main.js` 的 `window.App` 中导出
4. 在 `css/components/` 或 `css/pages/` 添加对应样式
