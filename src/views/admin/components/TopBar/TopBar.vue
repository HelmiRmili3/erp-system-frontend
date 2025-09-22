<template>
  <div class="flex justify-start items-center flex-row gap-5">
    <div class="flex flex-1 justify-start items-center flex-row gap-5">
      <div class="flex justify-start items-start flex-col py-2.5">
        <span class="text-[#2A2A2A] text-xl font-semibold"> Hi {{ user?.firstName }} 👋 </span>
        <span class="text-[#494949] text-xs">Welcome to your dashboard! </span>
      </div>
      <div class="flex flex-1 justify-start items-center flex-row gap-5">
        <div class="flex flex-1 justify-start items-center flex-row gap-[15px]">
          <div class="flex flex-1 justify-start items-start flex-col">
            <div class="flex self-stretch justify-start items-start flex-col">
              <div
                class="flex self-stretch justify-start items-start flex-col gap-3 px-4 bg-[#FFFFFE] border-solid border-[#F2F2F2] border rounded-[10px]"
              >
                <div class="self-stretch h-[0px]"></div>
                <div class="flex self-stretch justify-between items-center flex-row gap-1">
                  <div class="flex justify-start items-center flex-row gap-1">
                    <div class="flex justify-center items-center flex-row">
                      <search-icon />
                    </div>
                    <p class="flex-1 text-[#5F6C7B] text-sm font-medium opacity-80">Recherche</p>
                  </div>
                  <div class="flex justify-start items-center flex-row gap-2"></div>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Section -->
    <div class="flex justify-start items-center flex-row gap-5 relative">
      <div
        class="flex justify-start items-center flex-row gap-2.5 py-[5px] px-2.5 cursor-pointer"
        @click="toggleDropdown"
      >
        <div class="flex justify-center items-center flex-row rounded-3xl">
          <div class="flex justify-center items-center flex-row">
            <div class="bg-[#FDC28C]"></div>
            <img :src="userAvatar" class="w-10 h-10 rounded-full object-cover" alt="User Avatar" />
          </div>
        </div>
        <div class="flex justify-start items-start flex-col">
          <span class="text-[#2A2A2A] text-sm font-medium">{{ user?.userName }}</span>
          <span class="text-[#5F6C7B] text-xs">{{ user?.roles[0] }}</span>
        </div>
        <div class="flex justify-center items-center flex-row">
          <chevron-down-icon />
        </div>
      </div>

      <!-- Dropdown Menu -->
      <transition name="fade">
        <div
          v-if="dropdownVisible"
          class="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50"
        >
          <button
            @click="confirmLogout"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </transition>
    </div>

    <!-- Logout Confirmation Dialog -->
    <Dialog
      v-model:visible="showLogoutConfirm"
      header="Confirm Logout"
      modal
      :style="{ width: '400px' }"
    >
      <div class="flex flex-col gap-4">
        <p>Are you sure you want to logout?</p>
        <div class="flex justify-end gap-2">
          <Button label="Cancel" severity="secondary" text @click="showLogoutConfirm = false" />
          <Button label="Logout" severity="danger" @click="logoutConfirmed" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import SearchIcon from './searchIcon.svg'
import ChevronDownIcon from './chevronDownIcon.svg'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { ref, computed } from 'vue'
import { useAuthStore } from '../../../../stores/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const user = authStore.user

const dropdownVisible = ref(false)
const showLogoutConfirm = ref(false)

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
}

const confirmLogout = () => {
  dropdownVisible.value = false
  showLogoutConfirm.value = true
}

const logoutConfirmed = () => {
  showLogoutConfirm.value = false
  authStore.logout()
  router.push({ name: 'Login' })
}

const userAvatar = computed(() => {
  return 'https://avatar.iran.liara.run/public/17'
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
