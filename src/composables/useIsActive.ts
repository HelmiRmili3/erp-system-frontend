import { computed } from 'vue'

export const useIsActive = (props: any) => {
  const color = computed(() => (props.isActive ? '#F0681E' : '#999999'))

  return { color }
}
