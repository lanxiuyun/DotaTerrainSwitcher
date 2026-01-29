---
description: 
globs: *.vue
alwaysApply: false
---
# Vue 开发规范

## 组件命名
- 组件名应该始终使用多词组合，避免与HTML元素冲突
- 使用PascalCase命名组件：`TodoItem.vue`、`UserProfile.vue`
- 基础组件应使用特定前缀，如`Base`、`App`或`V`
- 组件名应该是描述性的，不要过于简略

## 组件结构
- 使用`<script setup>`语法糖
- 使用组合式API (Composition API)
- 组件选项/属性顺序：
  1. name
  2. components
  3. props
  4. emits
  5. setup()
  6. data()
  7. computed
  8. methods
  9. 生命周期钩子
- 使用单文件组件(SFC)格式

## Props 规范
- Prop名使用camelCase
- Prop需要定义类型和默认值
- 避免使用数组或对象的默认值，应该使用工厂函数返回默认值
- Prop应该尽可能详细地定义，包括类型、是否必须和验证函数
- 双向数据绑定使用v-model

## 事件命名
- 事件名应使用kebab-case，如`item-click`、`menu-select`
- 自定义事件应该有明确的含义，表示发生了什么
- 避免使用容易混淆的事件名称

## 样式指南
- 优先使用scoped CSS
- 避免使用!important
- 组件特定样式应该有特定的前缀
- 考虑使用CSS变量实现主题

## 性能优化
- 使用`v-show`代替`v-if`进行频繁切换
- 长列表使用虚拟滚动
- 避免在计算属性中进行复杂操作
- 使用keep-alive缓存组件
- 合理使用异步组件和懒加载

## 状态管理
- 使用Pinia进行状态管理
- store应该按功能模块划分
- 保持store简单，避免过度设计

## 路由
- 路由名称应当与组件名称匹配
- 使用懒加载减少初始加载时间
- 路由守卫应当简洁，避免复杂逻辑

## 通用建议
- 避免使用`this.$parent`或`this.$refs`直接操作DOM
- 优先使用计算属性而不是复杂的模板表达式
- 使用v-for时必须提供key
- 不要在同一元素上同时使用v-if和v-for
- 复用组件时使用key确保完全重新渲染