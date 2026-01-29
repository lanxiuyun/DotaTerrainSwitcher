---
name: HeroAlias内置默认+可编辑持久化
overview: 把 tools/alias/alias.yaml 转成前端内置默认数据；在 HeroAlias 页面提供可视化增删别名，并将改动持久化到 store.bin；点击应用后把数据通过 invoke 传给现有的 tauri 命令 apply_hero_aliases，生成并输出 VPK 到游戏目录。
todos:
  - id: add-defaults-module
    content: 新增 `src/data/heroAliasDefaults.ts`，把 `tools/alias/alias.yaml` 转成 `defaultLanguagePath` + `defaultHeroAliases` 常量
    status: completed
  - id: refactor-heroalias-ui
    content: 改造 `src/pages/HeroAlias.vue`：用 NDataTable + NDynamicTags 展示并编辑每个英雄的别名；增加过滤/基础校验；移除旧的文本解析流程
    status: completed
  - id: persist-to-store
    content: 在 `HeroAlias.vue` 接入 `tauri-plugin-store`：加载/保存 `alias_language_path`、`alias_dota_path`、`alias_hero_aliases_v1`
    status: completed
  - id: invoke-apply
    content: 保持 `invoke("apply_hero_aliases")` 调用，但改为使用编辑后的 `heroes` 作为入参；确保点击应用前持久化并进行去重/trim
    status: completed
  - id: i18n-update
    content: 更新 `src/i18n/types.ts`，并补齐 `src/i18n/locales/zh-CN.ts`、`src/i18n/locales/en-US.ts` 的新文案
    status: completed
isProject: false
---

# HeroAlias 默认数据内置 + 可编辑持久化 + 调 Tauri 打包输出

## 目标与约束

- **默认数据内置**：把 `tools/alias/alias.yaml` 的内容转换为前端代码常量（不在运行时读 YAML）。
- **可视化编辑**：用户在界面上对“已有英雄”增删别名（你选择的范围：**英雄列表固定**）。
- **可持久化**：用户改动保存到 `@tauri-apps/plugin-store` 的 `store.bin`。
- **应用流程**：点击“应用别名”时，将 `{ languagePath, dotaPath, heroes }` 通过 `invoke("apply_hero_aliases", { config })` 传给 Tauri；Tauri 端继续按现有实现提取/修改 `npc_heroes.txt`、打包 VPK、复制到游戏路径（与你给的 Python 流程 `create_vpk()`→`place_vpk()`一致）。
- **不新增下划线前缀函数/变量**：遵守你的命名规则。

## 当前代码现状（关键点）

- 前端现在是“文本框 + 解析”，然后直接调用 Tauri：

```139:146:D:\dotaMaper\src\pages\HeroAlias.vue
    const config: AliasApplyConfig = {
      languagePath: languagePath.value.trim(),
      dotaPath: dotaPath.value.trim() ? dotaPath.value.trim() : undefined,
      heroes: parsed.value.heroes,
    };

    const result = await invoke<ApplyResult>("apply_hero_aliases", { config });
```

- Tauri 端 `apply_hero_aliases` **不读取 YAML**，只用前端传入的 `heroes` 做处理并写出 VPK：

```230:384:D:\dotaMaper\src-tauri\src\lib.rs
#[tauri::command]
fn apply_hero_aliases(app: tauri::AppHandle, config: AliasApplyConfig) -> Result<ApplyResult, String> {
    // ... 提取 npc_heroes.txt
    // ... update_hero_aliases
    // ... VPKEdit 打包 output_vpk = pak02_dir.vpk
    // ... 复制到 dota_path/game/{language_path}/pak02_dir.vpk
    Ok(ApplyResult { logs })
}
```

## 设计方案

### 1) 默认数据内置

- 新增一个数据模块（建议）：`src/data/heroAliasDefaults.ts`
  - 导出：
    - `defaultLanguagePath: string`（来自 YAML 的 `path`）
    - `defaultHeroAliases: Record<string, string[]>`（来自 YAML 的英雄→别名列表）
  - 该文件内容由 `tools/alias/alias.yaml` 直接“翻译”为 TS 对象（一次性内置）。

### 2) 持久化策略（store.bin）

- 在 `HeroAlias.vue` 中：
  - 启动时：从 `store.bin` 读取 `alias_language_path`、`alias_dota_path`、`alias_hero_aliases_v1`。
  - 如果没有保存数据：使用 `defaultLanguagePath` + `defaultHeroAliases` 作为初始值。
  - 保存时：把用户编辑后的 `heroes`（仅配置层面的别名）写回 `alias_hero_aliases_v1`。

### 3) UI 改造（从文本编辑变成表格/标签编辑）

- 改造 `src/pages/HeroAlias.vue`：
  - 保留 `languagePath` 与 `dotaPath` 的输入/选择。
  - 用 Naive UI 的组件展示英雄列表：
    - `NDataTable`（列：英雄 key、别名列表）
    - 别名编辑使用 `NDynamicTags`（每个 hero 一组 tags，可新增/删除 tag）
    - 可选：增加搜索框 `NInput` 过滤英雄。
  - 删除/保留原“文本框 + parseAliasText”逻辑：
    - 计划：**移除文本框**，改为基于 `heroes` 对象直接编辑；
    - 提交给 Tauri 前做一次去重/trim（大小写不敏感去重，保留原始写法），保持与页面规则一致。

### 4) 应用按钮（调用 Tauri 打包输出）

- 点击“应用别名”时：
  - `config.heroes` 使用当前编辑后的 `heroes`。
  - `languagePath` 默认用内置的 `defaultLanguagePath`，用户仍可改。
  - `dotaPath` 仍支持选择文件夹。
  - 调用保持不变：`invoke("apply_hero_aliases", { config })`。

### 5) i18n 与类型

- 更新 i18n 类型：`src/i18n/types.ts` 的 `alias` 段新增必要字段（表格列名、搜索、提示等）。
- 补齐中英文：
  - `src/i18n/locales/zh-CN.ts`
  - `src/i18n/locales/en-US.ts`

## 测试/验收点（本地）

- 页面首次打开：展示内置默认英雄与别名。
- 增删某个英雄的别名 tag：刷新页面后仍保留（来自 `store.bin`）。
- 点击应用：
  - 能正常调用 `apply_hero_aliases` 并输出日志。
  - 生成并复制 `pak02_dir.vpk` 到 `DotaPath/game/{languagePath}/pak02_dir.vpk`（与现有 Rust 逻辑一致）。

## 风险与处理

- **你选择“英雄列表固定”**：UI 不提供新增英雄条目；若后续需要支持新增英雄，我们再扩展（只涉及前端与持久化结构）。
- **删除别名的语义**：本工具配置的别名是“额外别名”；删除只会让该别名不再被写入生成的 pak02（不会移除游戏原始自带别名）。

