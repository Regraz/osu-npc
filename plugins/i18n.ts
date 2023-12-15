import { createI18n } from 'vue-i18n'
import zhCN from '~/locales/zh-CN'

type MessageSchema = typeof zhCN

export default defineNuxtPlugin((nuxtApp) => {
  const vueApp = nuxtApp.vueApp
  const i18n = createI18n<[MessageSchema], 'zh-CN'>({
    legacy: false,
    globalInjection: true,
    locale: 'zh-CN',
    fallbackLocale: 'zh-CN',
    messages: {
      'zh-CN': zhCN,
    },
  })

  vueApp.use(i18n)
})
