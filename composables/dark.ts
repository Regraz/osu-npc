export function useDarkMode() {
  const colorMode = useColorMode()
  const toggleDark = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    if (process.client) {
      // if system preference same to the preference, then set to system
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isSystemDark === (colorMode.preference === 'dark')) {
        colorMode.preference = 'system'
      }
    }
  }
  const icon = computed(() => {
    return {
      light: 'material-symbols:sunny-rounded',
      dark: 'material-symbols:dark-mode-rounded',
      system: 'material-symbols:night-sight-auto',
    }[colorMode.preference as 'light' | 'dark' | 'system']
  })

  return { colorMode, toggleDark, darkBtnIcon: icon }
}
