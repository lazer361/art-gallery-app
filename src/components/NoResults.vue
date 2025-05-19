<script setup lang="ts">
  defineProps({
    query: {
      type: String,
      required: true
    }
  })
</script>

<template>
  <div class="no-results">
    <h3>
      No matches for
      <span class="query-text">{{ query }}</span>
    </h3>
    <p>Please try again with a different spelling or keywords.</p>
  </div>
</template>

<style scoped lang="scss">
  .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 60px;
    text-align: center;

    h3 {
      font-family: 'Inter', sans-serif;
      font-weight: 300;
      font-size: 16px;
      line-height: 140%;
      letter-spacing: 0%;
      margin-bottom: 12px;
      color: var(--color-text-secondary);

      .query-text {
        font-weight: 500;
      }
    }

    p {
      font-family: 'Inter', sans-serif;
      font-weight: 300;
      font-size: 14px;
      line-height: 140%;
      letter-spacing: 0%;
      color: var(--color-search-placeholder);
    }

    @media (max-width: 1440px) {
      text-align: center;
    }

    @media (max-width: 768px) {
      text-align: center;
    }

    @media (max-width: 320px) {
      text-align: left;
      align-items: flex-start;
    }
  }
</style>
