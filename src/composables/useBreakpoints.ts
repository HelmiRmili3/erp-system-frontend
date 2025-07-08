import { computed, onMounted, onUnmounted, ref } from "vue"

export const useBreakpoints = () => {
  const windowWidth = ref(window.innerWidth)

  const onWidthChange = () => windowWidth.value = window.innerWidth
  onMounted(() => window.addEventListener('resize', onWidthChange))
  onUnmounted(() => window.removeEventListener('resize', onWidthChange))
  
  const type = computed(() => {
    
    // if (windowWidth.value < 780) return 'mobile'// Fires when windowWidth.value < 1200
    // else if (windowWidth.value < 1200) return 'tablet' // Fires when windowWidth.value < 780
    // else return 'desktop' // Fires when windowWidth.value >= 1200
    if (windowWidth.value < 780) {
      return 'mobile'
    } else if (windowWidth.value < 1200) {
      return 'tablet'
    } else {
      return 'desktop'
    }
  
  
  })

  const width = computed(() => windowWidth.value)

  return { width, type }
}