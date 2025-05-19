<script setup lang="ts">
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { usePaintingsStore } from '../stores/paintings'
  import TheHeader from '../components/TheHeader.vue'
  import SearchComponent from '../components/SearchComponent.vue'
  import PaintingsGrid from '../components/PaintingsGrid.vue'
  import PaintingCard from '../components/PaintingCard.vue'
  import Pagination from '../components/Pagination.vue'
  import SkeletonLoader from '../components/SkeletonLoader.vue'
  import ErrorMessage from '../components/ErrorMessage.vue'
  import NoResults from '../components/NoResults.vue'

  const store = usePaintingsStore()
  const { paintings, isLoading, error, currentPage, totalPages, hasSearchResults, searchQuery } =
    storeToRefs(store)

  onMounted(() => {
    store.fetchInitialData()
    store.fetchPaintings()
  })
</script>

<template>
  <div class="container">
    <TheHeader />
    <SearchComponent @search="store.setSearchQuery" />

    <div class="content">
      <SkeletonLoader v-if="isLoading" />

      <template v-else>
        <template v-if="hasSearchResults">
          <PaintingsGrid>
            <PaintingCard v-for="painting in paintings" :key="painting.id" :painting="painting" />
          </PaintingsGrid>

          <Pagination
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="store.setPage"
          />
        </template>

        <NoResults v-else :query="searchQuery" />
      </template>

      <ErrorMessage v-if="error" :message="error" />
    </div>
  </div>
</template>

<style scoped>
  .content {
    margin-top: 40px;
  }
</style>
