<script setup lang="ts">
  import { useTheme } from '../composables/useTheme'

  const props = defineProps({
    count: {
      type: Number,
      default: 6
    }
  })

  const { isDark } = useTheme()
</script>

<template>
  <PaintingsGrid>
    <div
      v-for="i in props.count"
      :key="`skeleton-${i}`"
      class="skeleton-card"
      :class="{ 'skeleton-card--dark': isDark }"
    >
      <div class="loading-indicator">
        <div class="spinner"></div>
      </div>
    </div>
  </PaintingsGrid>
</template>

<style scoped lang="scss">
  .skeleton-card {
    position: relative;
    aspect-ratio: 392 / 260;
    border-radius: 4px;
    overflow: hidden;
    background: linear-gradient(
      90deg,
      rgba(#f0f0f0, 0.4) 25%,
      rgba(#f0f0f0, 0.8) 50%,
      rgba(#f0f0f0, 0.4) 75%
    );
    background-size: 200% 100%;
    animation: loading 1.5s infinite;

    &--dark {
      background: linear-gradient(
        90deg,
        rgba(#575757, 0.4) 25%,
        rgba(#575757, 0.8) 50%,
        rgba(#575757, 0.4) 75%
      );
    }
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
</style>
