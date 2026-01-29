---
description: 辅助生成 git 提交信息
globs: 
alwaysApply: false
---
# Git 规范

## 提交规范
git 提交模板<type>(<scope>): <subject>，具体要求如下：
1. 注意冒号 : 后有空格
2. type 的枚举值有：
- feat: 新增功能
- fix: 修复 bug
- docs: 文档注释
- style: 代码格式(不影响代码运行的变动)
- refactor: 重构、优化(既不增加新功能, 也不是修复bug)
- perf: 性能优化
- test: 增加测试
- chore: 构建过程或辅助工具的变动
- revert: 回退
- build: 打包
3. 若 subject 中描述超过两种要点，请使用要点列表描述详情，每个要点使用-符号开头，多个换行，参考如下样例：
```
feat(web): implement email verification workflow

- Add email verification token generation service
- Create verification email template with dynamic links
- Add API endpoint for token validation
- Update user model with verification status field
```

## 分支管理
- main/master: 主分支，保持稳定可发布状态
- develop: 开发分支，包含最新开发特性
- feature/*: 功能分支，用于开发新功能
- bugfix/*: 修复分支，用于修复bug
- release/*: 发布分支，用于准备发布

**常用分支命名约定**：

| 分支类型   | 命名格式             | 示例                      |
| ---------- | -------------------- | ------------------------- |
| 功能分支   | feature/[描述]       | feature/user-auth         |
| 修复分支   | fix/[问题ID]-[描述]  | fix/issue-42-login-crash  |
| 发布分支   | release/[版本]       | release/v2.1.0            |
| 热修复分支 | hotfix/[版本]-[描述] | hotfix/v2.0.1-payment-fix |

## 重要原则
- **重要**：不要自动提交 git 代码，除非有明确的提示
- 提交前确保代码通过所有测试
- 保持提交信息简洁明了，描述清楚变更内容
- 避免大型提交，尽量将变更分解为小的、相关的提交