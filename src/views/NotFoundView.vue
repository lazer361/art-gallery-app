<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'NotFoundView'
  })
</script>

<template>
  <div class="not-found">
    <h1 class="not-found-title">404 - Page Not Found</h1>
    <p class="not-found-text">The requested page could not be found</p>
    <router-link to="/" class="return-link">Go to Home</router-link>
  </div>
</template>

<style scoped>
  .not-found {
    text-align: center;
    padding: 2rem;
    color: #333;
  }

  .not-found-title {
    color: #575757;
  }

  .not-found-text {
    color: #9c9c9c;
  }

  .return-link {
    display: inline-block;
    margin-top: 1rem;
    color: #42b983;
    text-decoration: none;
  }

  .dark .not-found {
    color: #eee;
  }

  .dark .return-link {
    color: #3aa675;
  }
</style>
