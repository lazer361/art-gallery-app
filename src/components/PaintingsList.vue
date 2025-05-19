<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { getPaintings, getAuthors, getLocations } from '../api/paintingsApi'
  import type { Painting, Author, Location } from '../types'

  const props = defineProps<{
    searchQuery: string
    currentPage: number
  }>()

  const emit = defineEmits<{
    (e: 'update:paintings', paintings: Painting[]): void
    (e: 'update:totalPages', total: number): void
    (e: 'update:error', error: string | null): void
    (e: 'update:loading', loading: boolean): void
  }>()

  const paintings = ref<Painting[]>([])
  const error = ref<string | null>(null)

  const fetchData = async () => {
    emit('update:loading', true)
    error.value = null

    try {
      const [{ data, total }, authorsData, locationsData] = await Promise.all([
        getPaintings({
          q: props.searchQuery,
          _page: props.currentPage,
          _limit: 6
        }),
        getAuthors(),
        getLocations()
      ])

      const processedPaintings = data.map((painting: Painting) => ({
        ...painting,
        author:
          (authorsData as Author[]).find((a: Author) => a.id === painting.authorId)?.name ||
          'Unknown',
        location:
          (locationsData as Location[]).find((l: Location) => l.id === painting.locationId)
            ?.location || 'Unknown'
      }))

      paintings.value = processedPaintings
      emit('update:paintings', processedPaintings)
      emit('update:totalPages', Math.ceil(total / 6))
      emit('update:error', null)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load data'
      emit('update:error', error.value)
      paintings.value = []
    } finally {
      emit('update:loading', false)
    }
  }

  watch(
    () => [props.searchQuery, props.currentPage],
    () => fetchData(),
    { immediate: true }
  )
</script>

<template>
  <slot :paintings="paintings" :error="error" />
</template>
