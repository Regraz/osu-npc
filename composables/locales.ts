import { useI18n } from 'vue-i18n'

export function useLocales() {
  const locales: Array<{ name: string, code: string, loaded?: boolean }> = [
    { name: 'English', code: 'en-US' },
    { name: '中文（简体）', code: 'zh-CN' },
  ]

  const { locale: _locale, availableLocales: loadedLocales, t, setLocaleMessage } = useI18n()
  const setLocaleWithoutSave = async (code: string) => {
    // lazy load
    if (locales.find(l => l.code === code && !l.loaded)) {
      const m = await import(`../locales/${code}/index.ts`)
      setLocaleMessage(code, m.default)
      locales.find(l => l.code === code)!.loaded = true
    }
    _locale.value = code
  }

  const cookie = useCookie('locale', {
    maxAge: 25_565 * 24 * 60 * 60, // forever
  })

  const _ready = useState(() => false)
  const ready = computed<boolean>(() => _ready.value)

  const setLocale = async (code: string) => {
    cookie.value = code
    useHead({
      htmlAttrs: {
        lang: code,
      },
    })
    await setLocaleWithoutSave(code)
  }

  useHead({
    htmlAttrs: {
      lang: cookie.value || 'zh-CN',
    },
  })

  const init = async (acceptLangHeader?: string) => {
    if (ready.value) {
      return
    }

    if (cookie.value) {
      await setLocaleWithoutSave(cookie.value)
      return
    }

    if (process.client || !acceptLangHeader) {
      return
    }

    // no cookies, auto load language
    const acceptLangs = acceptLangHeader.split(',')
    const acceptLangList = acceptLangs.map((lang) => {
      const [name, langQ] = lang.split(';')
      const q = langQ ? Number.parseFloat(langQ.split('=')[1]) : 1
      const langM = { code: name, q }
      return langM
    }).sort((a, b) => b.q - a.q)
    for (const lang of acceptLangList) {
      for (const available of locales) {
        if (lang.code.toLowerCase() === available.code.toLowerCase()) {
          await setLocale(lang.code)
          return
        }
      }
    }
  }

  const locale = computed({
    get: () => _locale.value,
    set: async (code: string) => {
      await setLocale(code)
    },
  })

  return { t, loadedLocales, locales, locale, setLocale, localeCookie: cookie, init }
}
