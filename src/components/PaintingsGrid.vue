<script setup lang="ts">
  defineProps({
    isDarkTheme: Boolean
  })
</script>

<template>
  <div class="paintings-grid">
    <slot />
  </div>
</template>

<style scoped lang="scss">
  .paintings-grid {
    display: grid;
    justify-content: center;
    gap: 32px;
    grid-template-columns: repeat(3, 392px);

    @media (max-width: 1279px) {
      grid-template-columns: repeat(2, 352px);
      gap: 24px;
    }

    @media (max-width: 767px) {
      grid-template-columns: 280px;
      gap: 20px;
    }
  }
</style>
