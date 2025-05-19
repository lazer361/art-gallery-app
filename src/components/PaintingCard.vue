<script lang="ts">
  import { defineComponent, ref, computed, onMounted, watch } from 'vue'
  import { usePaintingsStore } from '../stores/paintings'
  import type { Painting } from '../types'

  export default defineComponent({
    name: 'PaintingCard',
    props: {
      painting: {
        type: Object as () => Painting,
        required: true,
        validator: (painting: Painting) => {
          return (
            typeof painting.id === 'number' &&
            typeof painting.name === 'string' &&
            typeof painting.authorId === 'number' &&
            typeof painting.locationId === 'number'
          )
        }
      }
    },
    setup(props) {
      const store = usePaintingsStore()
      const fullImageUrl = ref<string | undefined>(undefined)
      const isLoading = ref(true)
      const hasError = ref(false)
      const displayImage = ref(false)
      const imageOpacity = ref(0)
      const retryCount = ref(0)
      const maxRetries = 5
      const retryDelay = 1000

      const getFullImageUrl = (url: string | null): string | null => {
        if (!url) return null

        try {
          if (url.startsWith('http')) {
            return url
          }

          const baseUrl = 'https://test-front.framework.team'
          const separator = url.startsWith('/') ? '' : '/'
          return `${baseUrl}${separator}${url}`
        } catch (error) {
          return null
        }
      }

      const loadImage = () => {
        const url = getFullImageUrl(props.painting.imageUrl)
        fullImageUrl.value = url || undefined

        if (!url) {
          isLoading.value = false
          hasError.value = true
          displayImage.value = false
          return
        }

        isLoading.value = true
        hasError.value = false
        displayImage.value = false
        imageOpacity.value = 0

        const img = new Image()
        img.src = url

        img.onload = () => {
          isLoading.value = false
          hasError.value = false
          displayImage.value = true
          imageOpacity.value = 1
          retryCount.value = 0
        }

        img.onerror = () => {
          if (retryCount.value < maxRetries) {
            retryCount.value++
            setTimeout(loadImage, retryDelay)
          } else {
            isLoading.value = false
            hasError.value = true
            displayImage.value = false
            retryCount.value = 0
          }
        }
      }

      const onImageLoad = () => {
        isLoading.value = false
        hasError.value = false
        displayImage.value = true
        imageOpacity.value = 1
      }

      const onImageError = () => {
        if (retryCount.value < maxRetries) {
          retryCount.value++
          setTimeout(loadImage, retryDelay)
        } else {
          isLoading.value = false
          hasError.value = true
          displayImage.value = false
          retryCount.value = 0
        }
      }

      onMounted(loadImage)

      watch(
        () => props.painting.imageUrl,
        () => {
          retryCount.value = 0
          loadImage()
        }
      )

      const showErrorPlaceholder = computed(() => {
        return !isLoading.value && hasError.value
      })

      const authorName = computed(() => {
        const author = store.authors.find((a) => a.id === props.painting.authorId)
        return store.isLoadingAuthors ? 'Loading...' : author?.name || 'Unknown'
      })

      const locationName = computed(() => {
        const location = store.locations.find((l) => l.id === props.painting.locationId)
        return store.isLoadingLocations ? 'Loading...' : location?.location || 'Unknown'
      })

      return {
        store,
        fullImageUrl,
        isLoading,
        hasError,
        displayImage,
        imageOpacity,
        showErrorPlaceholder,
        authorName,
        locationName,
        onImageLoad,
        onImageError
      }
    }
  })
</script>

<template>
  <div class="painting-card">
    <div class="image-container">
      <img
        v-if="displayImage"
        :src="fullImageUrl"
        :alt="painting.name"
        class="painting-image"
        :style="{ opacity: imageOpacity }"
        @load="onImageLoad"
        @error="onImageError"
      />

      <div v-if="isLoading" class="image-placeholder loading-state">
        <div class="placeholder-content">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4H20V20H4V4Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4 16L9 11L13 15L20 8"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 10C14.5523 10 15 9.55228 15 9C15 8.44772 14.5523 8 14 8C13.4477 8 13 8.44772 13 9C13 9.55228 13.4477 10 14 10Z"
              fill="currentColor"
            />
          </svg>
          <span class="loading-text">Loading image...</span>
        </div>
      </div>

      <div v-if="showErrorPlaceholder" class="image-placeholder error-state">
        <div class="placeholder-content">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4H20V20H4V4Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4 16L9 11L13 15L20 8"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 10C14.5523 10 15 9.55228 15 9C15 8.44772 14.5523 8 14 8C13.4477 8 13 8.44772 13 9C13 9.55228 13.4477 10 14 10Z"
              fill="currentColor"
            />
          </svg>
          <span class="error-text">Image not available</span>
        </div>
      </div>

      <div class="info-overlay">
        <div class="info-content">
          <div class="main-info">
            <div class="title">{{ painting.name }}</div>
            <div class="year">{{ painting.created }}</div>
          </div>
          <div class="additional-info">
            <div class="artist">
              <template v-if="store.isLoadingAuthors">
                <span class="loading-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </template>
              <template v-else>
                {{ authorName }}
              </template>
            </div>
            <div class="location">
              <template v-if="store.isLoadingLocations">
                <span class="loading-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </template>
              <template v-else>
                {{ locationName.toUpperCase() }}
              </template>
            </div>
          </div>
          <div class="decorative-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .painting-card {
    position: relative;
    width: 392px;
    height: 260px;
    overflow: hidden;
    margin-bottom: 32px;

    @media (max-width: 1279px) {
      width: 352px;
      height: 220px;
      margin-bottom: 24px;
    }

    @media (max-width: 767px) {
      width: 280px;
      height: 185px;
      margin-bottom: 20px;
    }
  }

  .image-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: var(--color-card-placeholder-bg);
    overflow: hidden;
  }

  .painting-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition:
      opacity 0.5s ease,
      transform 0.3s ease;
    will-change: opacity, transform;

    &:hover {
      transform: scale(1.03);
    }
  }

  .image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.03);
    }

    &.loading-state {
      background-color: var(--color-card-placeholder-bg);

      .placeholder-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        svg {
          width: 48px;
          height: 48px;
          color: var(--color-card-placeholder-text);
        }

        .loading-text {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: var(--color-card-placeholder-text);
        }
      }
    }

    &.error-state {
      background-color: var(--color-card-placeholder-bg);

      .placeholder-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        svg {
          width: 48px;
          height: 48px;
          color: var(--color-card-placeholder-text);
        }

        .error-text {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: var(--color-card-placeholder-text);
        }
      }
    }
  }

  .loading-state {
    background: linear-gradient(
      90deg,
      rgba(240, 240, 240, 0.4) 25%,
      rgba(240, 240, 240, 0.8) 50%,
      rgba(240, 240, 240, 0.4) 75%
    );
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  .dark .loading-state {
    background: linear-gradient(
      90deg,
      rgba(87, 87, 87, 0.4) 25%,
      rgba(87, 87, 87, 0.8) 50%,
      rgba(87, 87, 87, 0.4) 75%
    );
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .info-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 300px;
    height: 82px;
    background-color: var(--color-card-overlay);
    display: flex;
    align-items: center;

    @media (max-width: 1279px) {
      height: 66px;
    }

    @media (max-width: 767px) {
      width: 236px;
      height: 66px;
    }
  }

  .info-content {
    position: relative;
    height: 42px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 19px;
    width: 100%;

    @media (max-width: 1279px) {
      padding-left: 12px;
      height: 42px;
    }

    @media (max-width: 767px) {
      height: 29px;
      padding-left: 12px;
    }
  }

  .main-info {
    transition: all 0.3s ease;
    position: absolute;
    left: 19px;
    right: 0;

    @media (max-width: 1279px) {
      left: 12px;
    }

    @media (max-width: 767px) {
      left: 12px;
    }
  }

  .title {
    font-family: 'Cormorant SC', serif;
    font-weight: 500;
    font-size: 16px;
    color: var(--color-card-title);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 767px) {
      font-size: 12px;
    }
  }

  .year {
    font-family: 'Inter', sans-serif;
    font-weight: bold;
    font-size: 12px;
    color: var(--color-card-year);

    @media (max-width: 767px) {
      font-size: 8px;
    }
  }

  .additional-info {
    position: absolute;
    left: 19px;
    right: 0;
    max-width: 200px;
    transform: translateX(-100%);
    opacity: 0;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 4px;

    @media (max-width: 1279px) {
      left: 12px;
      max-width: 180px;
    }

    @media (max-width: 767px) {
      left: 12px;
      max-width: 150px;
    }

    .artist {
      font-family: 'Cormorant SC', serif;
      font-weight: 500;
      font-size: 16px;
      color: var(--color-card-title);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      @media (max-width: 767px) {
        font-size: 12px;
      }
    }

    .location {
      font-family: 'Inter', sans-serif;
      font-weight: bold;
      font-size: 12px;
      color: var(--color-card-year);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-transform: uppercase;

      @media (max-width: 767px) {
        font-size: 8px;
      }
    }
  }

  .decorative-line {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--color-card-line);
    transition: all 0.3s ease;

    @media (max-width: 1279px) {
      display: none;
    }
  }

  .loading-dots span {
    animation: blink 1.4s infinite both;
    display: inline-block;
    min-width: 4px;
  }

  .loading-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .loading-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes blink {
    0% {
      opacity: 0.2;
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0.2;
    }
  }

  .painting-card:hover {
    .main-info {
      transform: translateY(100px);
      opacity: 0;
    }

    .additional-info {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>
