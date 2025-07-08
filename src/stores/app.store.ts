import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const _loading = ref(false)

  const loading = computed(() => _loading.value)

  const setLoading = (value: boolean) => {
    _loading.value = value
  }

  return {
    loading,
    setLoading
  }
})
