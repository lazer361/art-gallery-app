// src/stores/paintings.ts
import { defineStore } from 'pinia'
import { getPaintings, getAuthors, getLocations } from '../api/paintingsApi'
import type { Painting, Author, Location } from '../types'

export const usePaintingsStore = defineStore('paintings', {
  state: () => ({
    paintings: [] as Painting[],
    authors: [] as Author[],
    locations: [] as Location[],
    currentPage: 1,
    totalPages: 1,
    searchQuery: '',
    isLoading: false,
    isLoadingAuthors: false,
    isLoadingLocations: false,
    error: null as string | null,
    hasSearchResults: true,
    authorsCache: {} as Record<number, string>,
    locationsCache: {} as Record<number, string>
  }),

  actions: {
    async fetchInitialData() {
      this.isLoadingAuthors = true
      this.isLoadingLocations = true

      try {
        const [authors, locations] = await Promise.all([this.fetchAuthors(), this.fetchLocations()])
        this.authors = authors
        this.locations = locations
      } catch (error) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('Error fetching initial data:', error)
        }
        this.error = 'Failed to load initial data. Please try again later.'
      } finally {
        this.isLoadingAuthors = false
        this.isLoadingLocations = false
      }
    },

    async fetchAuthors() {
      try {
        return await getAuthors()
      } catch (error) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('Error fetching authors:', error)
        }
        throw error
      }
    },

    async fetchLocations() {
      try {
        return await getLocations()
      } catch (error) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('Error fetching locations:', error)
        }
        throw error
      }
    },

    getAuthorName(id: number): string {
      if (this.authorsCache[id]) {
        return this.authorsCache[id]
      }
      const author = this.authors.find((a) => a.id === id)
      const name = author?.name || 'Unknown'
      this.authorsCache[id] = name
      return name
    },

    getLocationName(id: number): string {
      if (this.locationsCache[id]) {
        return this.locationsCache[id]
      }
      const location = this.locations.find((l) => l.id === id)
      const name = location?.location || 'Unknown'
      this.locationsCache[id] = name
      return name
    },

    async fetchPaintings() {
      this.isLoading = true
      this.error = null
      this.hasSearchResults = true

      try {
        const { data, total } = await getPaintings({
          q: this.searchQuery,
          _page: this.currentPage,
          _limit: 6
        })

        this.paintings = data.map((painting) => ({
          ...painting,
          author: this.getAuthorName(painting.authorId),
          location: this.getLocationName(painting.locationId)
        }))

        this.totalPages = Math.ceil(total / 6)
        this.hasSearchResults = data.length > 0 || this.searchQuery === ''
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load paintings'
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('Error:', error)
        }
      } finally {
        this.isLoading = false
      }
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
      this.currentPage = 1
      this.fetchPaintings()
    },

    setPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.fetchPaintings()
      }
    }
  }
})
