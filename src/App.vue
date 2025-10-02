<template>
  <div class="relative">
    <div
      v-show="loading"
      class="absolute bg-white bg-opacity-60 h-screen w-screen flex items-center justify-center z-[9999]"
    >
      <div class="flex items-center">
        <loading-svg class="w-32 h-32" />
      </div>
    </div>

    <div class="py-10 px-5 mb-4">
      <router-view v-slot="{ Component, route }">
        <transition name="route.meta.transition ?? ''" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
      <Toast position="bottom-center" />
      <ConfirmPopup />
      <DynamicDialog />
    </div>
  </div>
</template>
<script setup lang="ts">
import LoadingSvg from '@/assets/loader.svg?component'
import { useAppStore } from './stores/app.store'
import { storeToRefs } from 'pinia'
// import { useConfigurationsStore } from './stores/configurations.store'

const { loading } = storeToRefs(useAppStore())

const appStore = useAppStore()
// const configurationStore = useConfigurationsStore()

const init = async () => {
  appStore.setLoading(true)
  // await configurationStore.initConfigurations()
  appStore.setLoading(false)
}

init()
</script>

<style>
body {
  background-color: #f5f0ea;
}

header {
  line-height: 1.5;
  max-height: 120vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

.slide-left {
  animation: slideLeft 0.5s ease-in-out forwards;
}

@keyframes slideLeft {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.p-overlay-mask {
  z-index: 10;
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}
</style>
