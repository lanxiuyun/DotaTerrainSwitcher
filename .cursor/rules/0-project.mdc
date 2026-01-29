---
description: 项目事实与全局约束（可执行）
globs:
alwaysApply: true
---

# 项目事实

## 技术栈（已确认）
- 前端：Vue 3 + TypeScript + Vite
- UI：Naive UI
- 路由：Vue Router（路由保持 hash 模式，见 `src/router/index.ts`）
- i18n：vue-i18n（词条：`src/i18n/locales/*`；类型：`src/i18n/types.ts`）
- 桌面端：Tauri v2（Rust 入口：`src-tauri/src/lib.rs`；配置：`src-tauri/tauri.conf.json`）

## 包管理与命令
- 包管理器：pnpm（Tauri 配置中 `beforeDevCommand/beforeBuildCommand` 使用 pnpm）
- 本地开发：优先使用 `pnpm tauri dev`
- 打包：使用 `pnpm build` 打包（仅在你明确要求我打包时参考）

## 目录约定
- 页面：`src/pages/*`
- 布局：`src/layouts/AppLayout.vue`
- 组件：`src/components/*`
- i18n：`src/i18n/*`
- 样式：`src/styles/*`
- 路由入口：`src/router/index.ts`
- Tauri 资源：`src-tauri/resources/**`（会被打包进应用资源，见 `src-tauri/tauri.conf.json` 的 bundle.resources）

## 规则使用优先级
- 全局约束：`0-project.mdc`、`general.mdc`
- Vue：`vue.mdc`（仅 `.vue`）
- Tauri：`tauri.mdc`（仅 `src-tauri/**`）
- Git 提交信息：`git.mdc`（仅在你明确要求我“生成提交信息/提交代码”时参考）