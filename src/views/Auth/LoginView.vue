<template>
  <div
    style="margin-top: 7vh"
    :class="isMobile ? '' : 'space-y-6 p-6 rounded-lg shadow-md max-w-2xl mx-auto'"
  >
    <h1 class="text-2xl font-bold mb-2">Login</h1>
    <p class="text-gray-400 mb-5">Login to your account</p>
    <form @submit.prevent="onSubmit">
      <!-- Email -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <EmailIcon />
          </InputIcon>
          <InputText
            id="email"
            type="email"
            autofocus
            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.email"
            :invalid="v$.email.$error"
          />
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
            <PasswordIcon />
          </InputIcon>
          <Password
            :feedback="false"
            toggleMask
            class="w-full rounded-lg text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.password"
            :invalid="v$.password.$error"
          />
        </IconField>
        <label for="password" class="mb-2">Password</label>
      </FloatLabel>
      <div v-if="v$.password.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.password.required.$invalid">Password is required.</span>
        <span v-else-if="v$.password.minLength.$invalid"
          >Password must be at least 8 characters long.</span
        >
      </div>
      <!-- Resend Verification -->
      <div v-if="canReresendVerification" class="text-red-500 text-sm mt-2">
        <span>
          <Button link :loading="isSubmitting" :disabled="isSubmitting">
            Click here to resend verification email.
          </Button>
        </span>
      </div>
      <div class="forget-password text-end" style="margin-top: 2rem">
        <RouterLink :to="{ name: 'ForgotPassword' }">
          <Button link label="Forgot Password?" />
        </RouterLink>
      </div>
      <!-- Submit Button -->
      <div class="mt-4 px-5 text-center">
        <Button
          label="Login"
          type="submit"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          class="w-full md:w-auto"
          rounded
          style="background-color: #f86a2e; color: white; border: none"
        />
      </div>
    </form>
    <!-- <div class="my-6 text-center text-gray-400">
      <div>
        Don't have an account?
        <RouterLink :to="{ name: 'Register' }">
          <Button link label="Register" style="color: #f86a2e; font-weight: 600" />
        </RouterLink>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { required, maxLength, minLength, email } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { reactive, computed, ref, onMounted } from 'vue'
import type { LoginModel } from '@/models/auth.model'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { useBreakpoints } from '@/composables/useBreakpoints'
import { useAppStore } from '@/stores/app.store'
import EmailIcon from '@/components/icons/EmailIcon.vue'
import PasswordIcon from '@/components/icons/PasswordIcon.vue'

const { type } = useBreakpoints()
const isMobile = computed(() => type.value === 'mobile')

const router = useRouter()
const toast = useToast()
const isSubmitting = ref(false)
const canReresendVerification = ref(false)
const user = reactive<LoginModel>({ email: '', password: '' })
const authStore = useAuthStore()
const appStore = useAppStore()

appStore.setLoading(false)

// Ensure autofocus only if no other element is focused
onMounted(() => {
  const emailInput = document.getElementById('email') as HTMLInputElement
  if (emailInput && document.activeElement === document.body) {
    emailInput.focus()
  }
})

const rules = {
  email: { required, email, maxLength: maxLength(255) },
  password: { required, minLength: minLength(8) }
}

const v$ = useVuelidate(rules, user, { $autoDirty: true })

const onSubmit = async () => {
  v$.value.$touch()
  if (!v$.value.$invalid && !isSubmitting.value) {
    isSubmitting.value = true
    try {
      await authStore.login(user)
      if (authStore.user) {
        toast.add({
          life: 5000,
          severity: 'success',
          summary: 'Success',
          detail: 'Logged in successfully!'
        })
        user.email = ''
        user.password = ''
        v$.value.$reset()

        router.push({ name: 'EmployeeDashboard' })
      } else {
        toast.add({
          life: 5000,
          severity: 'error',
          summary: 'Error',
          detail: "Couldn't log in. Please try again."
        })
      }
    } catch (error: any) {
      if (error.response?.data) {
        const { message, errors, status } = error.response.data
        canReresendVerification.value = status === 'email_not_verified'
        if (errors && errors.length) {
          errors.forEach((err: string) => {
            toast.add({
              life: 5000,
              severity: 'error',
              summary: 'Validation Error',
              detail: err
            })
          })
        } else {
          toast.add({
            life: 5000,
            severity: 'error',
            summary: 'Error',
            detail: message || 'Login failed'
          })
        }
      } else {
        toast.add({
          life: 5000,
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Login failed'
        })
      }
    } finally {
      isSubmitting.value = false
    }
  }
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
