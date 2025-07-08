<template>
  <header class="bg-white">
    <!-- Top bar -->
    <div class="bg-[#f5f5f5] py-2 text-sm w-full border-b-2 border-gray-300">
      <div class="container mx-auto px-4">
        <!-- Mobile View -->
        <div class="lg:hidden">
          <div class="flex justify-between items-center">
            <button @click="isMenuOpen = !isMenuOpen" class="text-gray-600 hover:text-orange-600">
              <i class="fas fa-bars"></i>
            </button>
            <div class="flex items-center space-x-4">
              <RouterLink :to="{ name: 'Home' }" class="text-gray-600 hover:text-orange-600">
                Accueil
              </RouterLink>
              <CartIcon />
            </div>
          </div>

          <!-- Mobile Menu -->
          <div v-if="isMenuOpen" class="mt-4 space-y-4">
            <div class="flex items-center text-xs">
              <i class="fas fa-map-marker-alt mr-2"></i>
              <span class="break-words">{{ configObject.address }}</span>
            </div>
            <div class="flex items-center text-xs">
              <i class="fas fa-phone mr-2"></i>
              <span>{{ configObject.phone }}</span>
            </div>
            <div class="flex items-center text-xs">
              <i class="fas fa-envelope mr-2"></i>
              <span class="break-words">{{ configObject.email }}</span>
            </div>
          </div>
        </div>

        <!-- Desktop View -->
        <div class="hidden lg:flex justify-between items-center">
          <div class="flex items-center space-x-6">
            <div class="flex items-center">
              <i class="fas fa-map-marker-alt mr-2"></i>
              <span>{{ configObject.address }}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-phone mr-2"></i>
              <span>{{ configObject.phone }}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-envelope mr-2"></i>
              <span>{{ configObject.email }}</span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <RouterLink :to="{ name: 'Home' }" class="text-gray-600 hover:text-orange-600">
              Accueil
            </RouterLink>
            <CartIcon />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useConfigurationsStore } from '../stores/configurations.store'
import CartIcon from './cart/CartIcon.vue'

defineOptions({
  name: 'SiteHeader'
})

const { configObject } = useConfigurationsStore()
const isMenuOpen = ref(false)
</script>

<script lang="ts">
export default {}
</script>

<style scoped>
.break-words {
  word-break: break-word;
}
</style>
