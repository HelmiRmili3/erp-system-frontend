<template>
  <div class="card">
    <Menubar v-if="false" :model="items">
      <template #start>
        <svg
          width="35"
          height="40"
          viewBox="0 0 35 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="h-8"
        >
          <path
            d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
            fill="var(--p-primary-color)"
          />
          <path
            d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"
            fill="var(--p-text-color)"
          />
        </svg>
      </template>
      <template #item="{ item, hasSubmenu, root }">
        <component
          class="flex items-center"
          :to="item.link"
          :is="item.link ? RouterLink : 'a'"
          :class="{ 'p-2': !root, 'p-4': root }"
        >
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
          <Badge
            v-if="item.badge"
            :class="{ 'ml-auto': !root, 'ml-2': root }"
            :value="item.badge"
          />
          <span
            v-if="item.shortcut"
            class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
            >{{ item.shortcut }}</span
          >
          <i
            v-if="hasSubmenu"
            :class="[
              'pi pi-angle-down',
              { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }
            ]"
          ></i>
        </component>
      </template>
      <template #end>
        <div class="flex items-center gap-2">
          <SplitButton
            :model="authStore.isAuthenticated ? authenficatedUserItems : userMenuItems"
            @click="userMenuClick"
          >
            <template v-if="authStore.isAuthenticated">
              <Avatar
                image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                shape="circle"
              />
              <span class="flex items-center font-bold">
                <span>{{ authStore.fullName }}</span>
              </span>
            </template>
            <template v-else>
              <Avatar shape="circle" />
              <span class="flex items-center font-bold">
                <span>Guest</span>
              </span>
            </template>
          </SplitButton>
        </div>
      </template>
    </Menubar>
  </div>
  <MainCard v-if="showCart" @close="toggleModal($event)" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import type { MenuItem } from 'primevue/menuitem'

const router = useRouter()
const authStore = useAuthStore()

const userMenuItems = ref([
  // Register
  {
    label: 'Register',
    icon: 'pi pi-user-plus',
    command: () => {
      router.push('/register')
    }
  },
  // Login
  {
    label: 'Login',
    icon: 'pi pi-sign-in',
    command: () => {
      router.push('/login')
    }
  }
])

const authenficatedUserItems = ref([
  // Logout
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => {
      authStore.logout()
      router.push({ name: 'Login' })
    }
  }
])

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    link: '/'
  },
  {
    label: 'Manage Categories',
    icon: 'pi pi-tags',
    link: '/manage-categories',
    visible: computed(() => authStore.isAuthenticated && authStore.isAdmin)
  },
  {
    label: 'Manage Extras',
    icon: 'pi pi-plus',
    link: '/extras',
    visible: computed(() => authStore.isAuthenticated && authStore.isAdmin)
  },
  {
    label: 'Manage Extras Category',
    icon: 'pi pi-plus',
    link: '/extras-category',
    visible: computed(() => authStore.isAuthenticated && authStore.isAdmin)
  }
] as MenuItem[])

const userMenuClick = () => {
  router.push('/profile')
}

const showCart = ref(false)

const toggleModal = (event: boolean) => {
  showCart.value = !event
}
watch(showCart, (value) => {
  const body = document.getElementsByTagName('body')[0]
  if (value) body.style.overflow = 'hidden'
  else body.style.overflow = 'auto'
})
</script>
<style lang="scss">
.nav-bar {
  background-color: var(--p-background-color);
  &.promotion-active {
    padding-top: 2.5rem;
  }
  .navbar-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 1rem;

    //   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    .nav-bar-img {
      img {
        width: 100%;
      }
    }
    .nav-bar-menu {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin-left: -200px;
      .nav-bar-menu-list {
        display: inline-flex;
        padding: 10px 15px;
        justify-content: center;
        align-items: center;
        gap: 20px;
        border-radius: 25px;
        background: var(--Clouded-Delight, #fafafa);

        /* x-small */
        box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
        .nav-bar-menu-list-item {
          display: flex;
          padding: 10px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          border-radius: 20px;
          color: #999999;
          cursor: pointer;
          &:hover {
            color: #333333;
          }
        }
      }
    }
  }
}
.activated {
  background: var(--Spice-Ember, #f0681e);
  color: white !important;
}
</style>
