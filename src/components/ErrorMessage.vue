<script setup lang="ts">
  defineProps({
    message: {
      type: String,
      required: true
    }
  })
</script>

<template>
  <div class="error-message">
    <h3>{{ message }}</h3>
  </div>
</template>

<style lang="scss" scoped>
  .error-message {
    text-align: center;
    margin-top: 60px;
    color: #ff4444;

    h3 {
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      font-size: 16px;
      line-height: 140%;
    }
  }
</style>
