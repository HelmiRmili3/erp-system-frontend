<template>
  <div class="flex justify-start items-center flex-row gap-5">
    <div class="flex flex-1 justify-start items-center flex-row gap-5">
      <div class="flex justify-start items-start flex-col py-2.5">
        <span class="text-[#2A2A2A] text-xl font-semibold">
          Bienvenue {{ user?.firstName }} 👋
        </span>
        <span class="text-[#494949] text-xs"> Bienvenue sur votre tableau de bord ! </span>
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
    <div class="flex justify-start items-center flex-row gap-5">
      <div class="flex justify-start items-start flex-row gap-5"></div>
      <div class="flex justify-start items-center flex-row gap-2.5 py-[5px] px-2.5">
        <div class="flex justify-center items-center flex-row rounded-3xl">
          <div class="flex justify-center items-center flex-row">
            <div class="bg-[#FDC28C]"></div>
            <img
              src="https://avatar.iran.liara.run/public/17"
              class="w-10 h-10 rounded-full object-cover"
              alt="User Avatar"
            />
          </div>
        </div>
        <div class="flex justify-start items-start flex-col">
          <span class="text-[#2A2A2A] text-sm font-medium cursor-pointer" @click="logout"
            >{{ user?.userName }}
          </span>
          <span class="text-[#5F6C7B] text-xs">{{ user?.roles[0] }}</span>
        </div>
        <div class="flex justify-center items-center flex-row cursor-pointer" @click="logout">
          <chevron-down-icon />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchIcon from './searchIcon.svg'
import ChevronDownIcon from './chevronDownIcon.svg'
import { useAuthStore } from '../../../../stores/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const user = authStore.user
const logout = () => {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>
