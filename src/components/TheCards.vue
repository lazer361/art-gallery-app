<script setup lang="ts">
  import { ref } from 'vue'
  import type { Painting } from '@/types'
  import PaintingsList from './PaintingsList.vue'
  import PaintingsGrid from './PaintingsGrid.vue'
  import PaintingCard from './PaintingCard.vue'
  import Pagination from './Pagination.vue'
  import SkeletonLoader from './SkeletonLoader.vue'
  import ErrorMessage from './ErrorMessage.vue'
  import NoResults from './NoResults.vue'
  import AppContainer from './AppContainer.vue'

  interface Props {
    searchQuery?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    searchQuery: ''
  })

  const currentPage = ref(1)
  const totalPages = ref(1)
  const paintings = ref<Painting[]>([])
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  const handlePageChange = (page: number) => {
    currentPage.value = page
  }
</script>

<template>
  <AppContainer>
    <PaintingsList
      :search-query="props.searchQuery"
      :current-page="currentPage"
      @update:paintings="paintings = $event"
      @update:total-pages="totalPages = $event"
      @update:error="error = $event"
      @update:loading="isLoading = $event"
    >
      <template #default="{ paintings: slotPaintings, error: slotError }">
        <SkeletonLoader v-if="isLoading" :is-dark-theme="false" />

        <ErrorMessage v-else-if="slotError" :message="slotError" />

        <NoResults
          v-else-if="!slotPaintings.length && props.searchQuery"
          :query="props.searchQuery"
        />

        <template v-else>
          <PaintingsGrid>
            <PaintingCard
              v-for="painting in slotPaintings"
              :key="painting.id"
              :painting="painting"
            />
          </PaintingsGrid>

          <Pagination
            v-if="slotPaintings.length > 0"
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
          />
        </template>
      </template>
    </PaintingsList>
  </AppContainer>
</template>
