<template>
  <button @click="toggleTheme" class="p-2 rounded border">
    {{ theme === 'dark' ? '☀️ Light' : '🌙 Dark' }}
  </button>
</template>

<script setup>
import { useTheme } from '~/composables/useTheme'
const { theme, toggleTheme } = useTheme()
</script>
