import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义可用的主题
export type Theme = 'light' | 'dark' | 'cupcake' | 'luxury' | 'business' | 'nord' | 'winter'

export const useThemeStore = defineStore('theme', () => {
  // 主题列表
  const themes: Theme[] = ['light', 'dark', 'cupcake', 'luxury', 'business', 'nord', 'winter']
  
  // 当前主题
  const currentTheme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'light')

  // 切换主题
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }

  // 初始化主题
  const initTheme = () => {
    console.log('initTheme')
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme && themes.includes(savedTheme)) {
      setTheme(savedTheme)
    } else {
      setTheme('light')
    }
  }

  return {
    themes,
    currentTheme,
    setTheme,
    initTheme
  }

}) 