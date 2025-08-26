import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

// 支持的语言类型
export type SupportedLocale = 'zh-CN' | 'en-US'

// 获取浏览器语言
function getDefaultLocale(): SupportedLocale {
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) {
    return 'zh-CN'
  }
  return 'en-US'
}

// 从localStorage获取保存的语言设置
function getSavedLocale(): SupportedLocale {
  const saved = localStorage.getItem('locale')
  if (saved === 'zh-CN' || saved === 'en-US') {
    return saved
  }
  return getDefaultLocale()
}

const i18n = createI18n({
  legacy: false, // 使用Composition API
  locale: getSavedLocale(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

// 语言切换函数
export function setLocale(locale: SupportedLocale) {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
}

// 获取当前语言
export function getCurrentLocale(): SupportedLocale {
  return i18n.global.locale.value as SupportedLocale
}

// 获取支持的语言列表（用于 NSelect：需要 label 和 value）
export function getSupportedLocales() {
  return [
    { label: '中文', value: 'zh-CN' as const },
    { label: 'English', value: 'en-US' as const },
  ]
}

export default i18n
