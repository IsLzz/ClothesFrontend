<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const themeStore = useThemeStore()
const router = useRouter()

onMounted(async () => {
  themeStore.initTheme()
  try {
    await userStore.fetchUserInfo()
  } catch (error) {
    console.error('初始化应用时出错:', error)
  }
})
</script>

<template>
  <router-view></router-view>
</template>

<style scoped>

</style>
