<script setup lang="ts">
  import { computed } from 'vue'
  import { useTheme } from '../composables/useTheme'

  const props = defineProps({
    currentPage: {
      type: Number,
      required: true,
      validator: (value: number) => value >= 1
    },
    totalPages: {
      type: Number,
      required: true,
      validator: (value: number) => value >= 1
    }
  })

  const emit = defineEmits(['page-change'])

  const { isDark } = useTheme()

  const visiblePages = computed(() => {
    const pages: (number | string)[] = []
    const { currentPage, totalPages } = props

    pages.push(1)

    if (currentPage > 3) {
      pages.push('...')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i)
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  })

  const goToPage = (page: number | string) => {
    if (typeof page === 'number' && page >= 1 && page <= props.totalPages) {
      emit('page-change', page)
    }
  }
</script>

<template>
  <div v-if="totalPages > 1" class="pagination-wrapper">
    <div class="pagination">
      <button
        class="pagination-arrow pagination-arrow--prev"
        :class="{ 'pagination-arrow--disabled': currentPage === 1 }"
        :disabled="currentPage === 1"
        aria-label="Previous page"
        @click="goToPage(currentPage - 1)"
      >
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.68774 0.283372C7.51288 0.0696493 7.19787 0.0381482 6.98415 0.213012L0.384147 5.61301C0.268079 5.70798 0.200766 5.85002 0.200766 5.99999C0.200766 6.14996 0.268079 6.29201 0.384147 6.38697L6.98415 11.787C7.19787 11.9618 7.51288 11.9303 7.68774 11.7166C7.86261 11.5029 7.83111 11.1879 7.61739 11.013L1.49036 5.99999L7.61739 0.986969C7.83111 0.812106 7.86261 0.497094 7.68774 0.283372Z"
            :fill="isDark ? '#DEDEDE' : '#575757'"
          />
        </svg>
      </button>

      <div class="pagination-numbers">
        <button
          v-for="(page, index) in visiblePages"
          :key="index"
          class="page-number"
          :class="{
            active: page === currentPage,
            'page-dots': page === '...'
          }"
          :disabled="page === '...'"
          :aria-label="typeof page === 'number' ? `Page ${page}` : 'Ellipsis'"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="pagination-arrow pagination-arrow--next"
        :class="{ 'pagination-arrow--disabled': currentPage === totalPages }"
        :disabled="currentPage === totalPages"
        aria-label="Next page"
        @click="goToPage(currentPage + 1)"
      >
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.312263 0.283372C0.487125 0.0696493 0.802136 0.0381482 1.01585 0.213012L7.61585 5.61301C7.73192 5.70798 7.79923 5.85002 7.79923 5.99999C7.79923 6.14996 7.73192 6.29201 7.61585 6.38697L1.01585 11.787C0.802136 11.9618 0.487125 11.9303 0.312263 11.7166C0.137392 11.5029 0.168893 11.1879 0.382614 11.013L6.50964 5.99999L0.382614 0.986969C0.168893 0.812106 0.137392 0.497094 0.312263 0.283372Z"
            :fill="isDark ? '#DEDEDE' : '#575757'"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .pagination-wrapper {
    margin-top: 40px;
    margin-bottom: 40px;
    display: flex;
    justify-content: center;

    @media (max-width: 320px) {
      margin-top: 30px;
    }
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 300;
    line-height: 140%;
    letter-spacing: 0%;
  }

  .pagination-arrow {
    width: 20px;
    height: 20px;
    background: transparent;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s ease;

    svg {
      transition: fill 0.3s ease;
    }

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:hover:not(&--disabled) {
      background: var(--color-pagination-arrow-hover-bg);

      svg path {
        fill: var(--color-pagination-arrow-hover-fill);
      }
    }
  }

  .pagination-numbers {
    display: flex;
    align-items: center;
    gap: 20px;
    height: 24px;
    margin: 0 20px;
  }

  .page-number {
    height: 24px;
    min-width: 24px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--color-pagination-text);
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 300;
    line-height: 140%;
    letter-spacing: 0%;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(.active, .page-dots) {
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background-color: var(--color-pagination-hover-line);
      }
    }

    &.active {
      width: 24px;
      height: 24px;
      background: var(--color-pagination-active-bg);
      color: var(--color-pagination-active-text);
      font-weight: 400;
      border-radius: 4px;
    }

    &.page-dots {
      cursor: default;
    }
  }
</style>
