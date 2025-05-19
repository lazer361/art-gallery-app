<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useTheme } from '../composables/useTheme'

  const { isDark } = useTheme()
  const searchQuery = ref('')
  const isActive = ref(false)

  const emit = defineEmits(['search'])

  const clearSearch = () => {
    searchQuery.value = ''
    emit('search', '')
  }

  watch(searchQuery, (newVal) => {
    emit('search', newVal.trim())
  })

  const iconColor = computed(() => (isDark.value ? '#DEDEDE' : '#575757'))
  const placeholderColor = computed(() => (isDark.value ? '#575757' : '#9C9C9C'))
</script>

<template>
  <div class="search-section">
    <div
      class="search-container"
      :class="{
        active: isActive,
        filled: searchQuery,
        'dark-theme': isDark
      }"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M6.39891 3.95319e-08C5.38042 0.000145857 4.37668 0.243368 3.4711 0.709452C2.56552 1.17554 1.78426 1.85102 1.19224 2.67977C0.60022 3.50852 0.214546 4.46659 0.0672671 5.47437C-0.0800113 6.48215 0.0153602 7.51053 0.345456 8.47403C0.675551 9.43754 1.23084 10.3084 1.96516 11.0141C2.69949 11.7198 3.59165 12.2401 4.5675 12.5317C5.54335 12.8233 6.5747 12.8778 7.57584 12.6907C8.57698 12.5035 9.519 12.0801 10.3236 11.4557L14.6323 15.766C14.7825 15.916 14.9861 16.0002 15.1984 16C15.4107 15.9998 15.6142 15.9154 15.7642 15.7652C15.9142 15.6149 15.9984 15.4113 15.9983 15.199C15.9981 14.9867 15.9137 14.7832 15.7634 14.6332L11.4548 10.3245C12.1892 9.3785 12.6435 8.24539 12.7659 7.05402C12.8883 5.86264 12.674 4.66082 12.1473 3.58522C11.6206 2.50961 10.8026 1.60339 9.78641 0.969593C8.77021 0.335798 7.59655 -0.000133053 6.39891 3.95319e-08ZM1.59904 6.39982C1.59904 5.12682 2.10474 3.90595 3.00489 3.0058C3.90504 2.10565 5.1259 1.59996 6.39891 1.59996C7.67191 1.59996 8.89277 2.10565 9.79292 3.0058C10.6931 3.90595 11.1988 5.12682 11.1988 6.39982C11.1988 7.67283 10.6931 8.89369 9.79292 9.79384C8.89277 10.694 7.67191 11.1997 6.39891 11.1997C5.1259 11.1997 3.90504 10.694 3.00489 9.79384C2.10474 8.89369 1.59904 7.67283 1.59904 6.39982Z"
          :fill="iconColor"
        />
      </svg>
      <input
        v-model="searchQuery"
        class="search-input"
        type="text"
        placeholder="Painting title"
        :style="{ '--placeholder-color': placeholderColor }"
        @focus="isActive = true"
        @blur="isActive = false"
      />
      <button v-if="searchQuery" class="clear-button" @click="clearSearch">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M12 4L4 12M4 4L12 12"
            :stroke="iconColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .search-section {
    display: flex;
    justify-content: flex-end;
    margin: 44px 0 20px;
    width: 100%;
  }

  .search-container {
    width: 100%;
    max-width: 336px;
    height: 36px;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 4px;
    transition: all 0.3s ease;
    background-color: var(--color-search-bg);
    border: 1px solid var(--color-search-border);

    &.active {
      border-color: var(--color-search-active-border);
    }

    &.filled {
      .search-input {
        color: var(--color-search-text);
      }
    }
    @media (max-width: 800px) {
      max-width: 352px;
    }
    @media (max-width: 768px) {
      width: 100%;
      max-width: 280px;
      height: 33px;
      padding: 6px 12px;
    }
  }

  .search-input {
    flex-grow: 1;
    width: 244px;
    border: none;
    background: transparent;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 300;
    line-height: 140%;
    letter-spacing: 0%;
    outline: none;
    color: var(--color-search-text);

    &::placeholder {
      color: var(--placeholder-color);
    }

    @media (max-width: 320px) {
      font-size: 12px;
    }
  }

  .clear-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
  }
</style>
