<script setup lang="ts">
  import { useTheme } from './composables/useTheme'

  const { isDark } = useTheme()
</script>

<template>
  <div id="app" :class="{ dark: isDark }">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
