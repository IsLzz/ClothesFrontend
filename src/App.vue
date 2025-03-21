<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'

const userStore = useUserStore()
const themeStore = useThemeStore()

onMounted(async () => {
  themeStore.initTheme()
  if (userStore.isLoggedIn) {
    await userStore.fetchUserInfo()
  }
  
})
</script>

<template>
  <router-view></router-view>
</template>

<style scoped>

</style>
