<template>
  <div style="margin-top: 7vh" :class="isMobile ? '' : 'space-y-6 p-6 rounded-lg shadow-md max-w-2xl mx-auto'">
    <h1 class="text-2xl font-bold mb-2">Login</h1>
    <p class="text-gray-400 mb-5">Login to your account</p>
    <form @submit.prevent="onSubmit">
      <!-- Email -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M2 8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5H7" stroke="#999999"
                stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9" stroke="#999999" stroke-width="1.5"
                stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M2 16.5H8" stroke="#999999" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M2 12.5H5" stroke="#999999" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </InputIcon>
          <InputText id="email" type="email"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.email" :invalid="v$.email.$error" @focus="triggerValidation(v$, 'email')"
            @blur="triggerValidation(v$, 'email')" />
        </IconField>
        <label for="email" class="mb-2">Email</label>
      </FloatLabel>
      <div v-if="v$.email.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.email.required.$invalid">Email is required.</span>
        <span v-else-if="v$.email.email.$invalid">Invalid email address.</span>
        <span v-else-if="v$.email.maxLength.$invalid">Email must be less than 255 characters.</span>
      </div>
      <!-- Password -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <svg class="svg-icon" height="24" width="24"
              style="vertical-align: middle; fill: currentColor; overflow: hidden" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M779.822 367.987h-10.317V272.55C770.365 116.93 657.733 0 508.99 0 362.828 0 251.056 116.93 251.056 272.55v95.437h-7.738c-78.24 0-141.004 66.203-141.004 143.583v367.987c0 80.82 63.624 143.583 141.004 143.583h536.504c78.24 0 141.004-66.203 141.004-143.583V511.57c-1.72-79.96-65.343-143.583-141.004-143.583zM294.905 270.83c0-134.126 90.277-228.702 214.086-228.702 126.388 0 216.665 97.156 216.665 228.702v95.436h-433.33v-95.436h2.58z m582.932 608.726c0 55.885-43.849 102.314-97.155 102.314H243.318c-53.306 0-97.155-46.429-97.155-102.314V511.57c0-55.886 43.849-102.314 97.155-102.314h537.364c53.306 0 97.155 46.428 97.155 102.314v367.987z"
                fill="" />
              <path
                d="M507.271 567.456c-34.391 0-61.044 29.232-61.044 63.624 0 24.074 12.037 43.849 31.812 55.886v104.893c0 17.196 14.616 31.812 31.812 31.812s31.811-14.616 31.811-31.812V686.966c19.775-12.037 31.812-31.812 31.812-55.886-6.018-33.532-32.671-63.624-66.203-63.624z"
                fill="" />
            </svg>
          </InputIcon>
          <Password :feedback="false" toggleMask
            class="w-full rounded-lg text-white border-gray-600 focus:ring focus:ring-green-500" v-model="user.password"
            :invalid="v$.password.$error" @focus="triggerValidation(v$, 'password')"
            @blur="triggerValidation(v$, 'password')" />
        </IconField>
        <label for="password" class="mb-2">Password</label>
      </FloatLabel>
      <div v-if="v$.password.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.password.required.$invalid">Password is required.</span>
        <span v-else-if="v$.password.minLength.$invalid">Password must be at least 8 characters long.</span>
      </div>

      <!-- canReresendVerification -->
      <div v-if="canReresendVerification" class="text-red-500 text-sm mt-2">
        <span><Button @click="resendEmailVerificationAction" link :loading="isSubmitting" :disabled="isSubmitting">Click
            here to resend verification email.</Button></span>
      </div>
      <div class="forget-password text-end" style="margin-top: 2rem">
        <RouterLink :to="{ name: 'ForgotPassword' }">
          <Button link label="Forgot Password?" />
        </RouterLink>
      </div>
      <!-- Submit Button -->
      <div class="mt-4 px-5 text-center">
        <Button label="Login" type="submit" :loading="isSubmitting" :disabled="isSubmitting" class="w-full md:w-auto"
          rounded style="background-color: #f86a2e; color: white; border: none" />
      </div>
    </form>
    <div class="my-6 text-center text-gray-400">
      <div>
        Don't have an account?
        <RouterLink :to="{ name: 'Register' }">
          <Button link label="Register" style="color: #f86a2e; font-weight: 600" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { required, maxLength, minLength } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { reactive, computed, ref } from 'vue'
import { LoginModel } from '@/models/auth.model'
import { login, resendEmailVerification } from '@/services/auth.service'
import { useToast } from 'primevue/usetoast'
import { triggerValidation } from '@/helpers/validation.helpers'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { useBreakpoints } from '@/composables/useBreakpoints'
import { useAppStore } from '@/stores/app.store'

const { type } = useBreakpoints()
const isMobile = computed(() => type.value === 'mobile')

const router = useRouter()
const toast = useToast()
const isSubmitting = ref(false)
const canReresendVerification = ref(false)
const user = reactive<LoginModel>(new LoginModel())
const authStore = useAuthStore()
useAppStore().setLoading(false)

const rules = {
  email: { required, maxLength: maxLength(255) },
  password: { required, minLength: minLength(8) }
}

const v$ = useVuelidate(rules, user, { $autoDirty: true })
// on submit
const onSubmit = async () => {
  v$.value.$touch()
  if (!v$.value.$invalid && !isSubmitting.value) {
    isSubmitting.value = true
    try {
      var  data  = await login(user)
      if (data) {
        toast.add({
          life: 5000,
          severity: 'success',
          summary: 'Success',
          detail: 'Logged in successfully!'
        })
        Object.assign(user, new LoginModel())
        v$.value.$reset()
        authStore.login(data)

        router.push({ name: 'AdminDashboard' })
      } else {
        toast.add({
          life: 5000,
          severity: 'error',
          summary: 'Error',
          detail: "Couldn't log in. Please try again."
        })
      }
    } catch (e: any) {
      if (e?.response?.data) {
        const data = e.response.data
        const { innerData } = data
        if (innerData && innerData.length) {
          Object.keys(innerData).forEach((key) => {
            toast.add({
              life: 5000,
              severity: 'error',
              summary: 'Validation Error',
              detail: innerData[key][0]
            })
          })
        } else {
          canReresendVerification.value = data.status === 'email_not_verified'
          toast.add({
            life: 5000,
            severity: 'error',
            summary: 'Error',
            detail: e.response.data.message
          })
        }
      } else {
        toast.add({ life: 5000, severity: 'error', summary: 'Error', detail: e.message })
      }
    }
    isSubmitting.value = false
  }
}

const resendEmailVerificationAction = async () => {
  isSubmitting.value = true
  try {
    const {
      data: { message }
    } = await resendEmailVerification(user.email)
    toast.add({ life: 5000, severity: 'success', summary: 'Success', detail: message })
    canReresendVerification.value = false
  } catch (error: any) {
    const {
      data: { status, message }
    } = error.response
    if (status === 'already_verified') {
      toast.add({ life: 5000, severity: 'info', summary: 'Info', detail: message })
    } else {
      toast.add({ life: 5000, severity: 'error', summary: 'Error', detail: message })
    }
  }
  isSubmitting.value = false
}
</script>

<style lang="scss">
.p-password-input {
  width: 100%;
}

.p-password:has(.p-password-toggle-mask-icon) .p-password-input {
  padding-inline-start: calc((var(--p-form-field-padding-x) * 2) + var(--p-icon-size));
}

.forget-password {
  .p-button-link {
    font-size: 12px;
    color: #f86a2e;
  }
}
</style>
