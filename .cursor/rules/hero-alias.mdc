---
description: 英雄别名功能（HeroAlias）变更约束
globs:
  - src/pages/HeroAlias.vue
  - src-tauri/src/lib.rs
  - src-tauri/resources/alias-tools/**
alwaysApply: false
---

# HeroAlias 页面开发规则（可执行）

## 入口与联动文件（改这个功能时要一起考虑）
- 页面：`src/pages/HeroAlias.vue`
- 默认数据：`src/data/heroAliasDefaults.ts`
- Tauri 命令：`apply_hero_aliases`（实现：`src-tauri/src/lib.rs`）
- 资源工具：`src-tauri/resources/alias-tools/**`（VRF / VPKEdit）
- i18n：`src/i18n/locales/*` + `src/i18n/types.ts`

## 资源与打包约束（dev/release 一致）
- 外部可执行工具必须从 `tauri::AppHandle` 的 `path().resource_dir()` 定位（避免依赖工作目录或项目相对路径）。
- 工具目录约定：`src-tauri/resources/alias-tools/**`（与 `tauri.conf.json` 的 `bundle.resources` 保持一致）。

## 平台约束（Windows-only）
- `apply_hero_aliases` 以 Windows 为目标平台：非 Windows 平台需要明确提示“不支持/不可用”，避免误以为跨平台可用。

## 可执行文件探测约束（兼容多名称）
- VRF 可执行文件名需兼容：`VRF.exe` / `Source2Viewer-CLI.exe`
- VPKEdit CLI 可执行文件名需兼容：`VPKEdit-cli.exe` / `vpkeditcli.exe`
- 如变更目录或文件名：必须同步更新 Rust 端的探测逻辑与错误提示文案。

## 仓库维护约束（二进制与忽略策略）
- `src-tauri/resources/alias-tools/**` 下的外部工具通常不建议入库（体积大、更新频繁）。
- 若选择不入库：需在项目根 `.gitignore` 明确忽略该目录，并在日志/提示中引导用户自行放置工具文件。

## 交互与数据约束
- 默认别名数据内置于 `src/data/heroAliasDefaults.ts`，**不在运行时读取 YAML**
- 用户改动持久化到 `tauri-plugin-store` 的 `store.bin`
- 页面只负责：展示/编辑别名、校验、展示日志、调用 `invoke("apply_hero_aliases")`
- 别名去重：大小写不敏感，但保留原始写法用于显示/写入
- 当前 UI 范围：仅允许编辑已有英雄的别名（不新增/删除英雄条目）

## 改动优先级
- 优先保证 i18n key 不破坏（新增文案必须补齐中英文和 types）
- 任何涉及外部工具路径/名称变更：必须同步更新 Rust 端的可执行文件探测逻辑与报错提示
