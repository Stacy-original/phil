import { ref, watchEffect } from 'vue'

const theme = ref('light')

if (process.client) {
  const saved = localStorage.getItem('theme')
  if (saved) theme.value = saved
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
}

watchEffect(() => {
  if (process.client) {
    localStorage.setItem('theme', theme.value)
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
  }
})

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  return { theme, toggleTheme }
}
