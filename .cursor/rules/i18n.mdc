---
description: i18n 词条与类型同步规范
globs: src/i18n/**
alwaysApply: false
---

# i18n 开发规范（本项目）

## 词条新增/修改必须同步
- 新增/修改文案时，同时更新：
  - `src/i18n/locales/zh-CN.ts`
  - `src/i18n/locales/en-US.ts`
  - `src/i18n/types.ts`（保持 `I18nMessages` 与实际词条结构一致）

## Key 约定
- 统一使用 `t("a.b.c")` 的点路径
- 避免同一含义出现多个 key（先复用已有 key）

## 类型优先
- 以 `src/i18n/types.ts` 为“结构真相”，词条文件需完全覆盖该结构（缺项视为问题）
