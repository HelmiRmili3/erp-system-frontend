<template>
  <div>
    <Dialog
      v-if="canVerify"
      v-model:visible="state.dialog"
      modal
      :closable="false"
      :header="state.header"
      :style="{ width: '25rem' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        {{ state.message }}
      </span>
      <ProgressBar
        v-if="!mustRerequestVerification"
        :value="state.progressValue"
        style="height: 6px"
        :showValue="false"
      ></ProgressBar>
      <div v-else>
        <div class="col">
          <label for="email" class="block text-gray-400 text-lg font-medium mb-2">Email</label>
          <InputText
            id="email"
            placeholder="Email address"
            type="email"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="state.email"
            :invalid="v$.email.$error"
            @focus="triggerValidation(v$, 'email')"
            @blur="triggerValidation(v$, 'email')"
          />
          <!-- error message -->
          <div v-if="v$.email.$error" class="text-red-500 text-sm mt-2">
            <span v-if="v$.email.required.$invalid">Email is required.</span>
            <span v-else-if="v$.email.email.$invalid">Invalid email address.</span>
            <span v-else-if="v$.email.maxLength.$invalid"
              >Email must be less than 255 characters.</span
            >
          </div>
          <div class="flex justify-end mt-4">
            <Button
              @click="resendEmailVerificationAction"
              :disabled="v$.email.$invalid || state.isRequestingVerification"
              :loading="state.isRequestingVerification"
            >
              Resend
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { resendEmailVerification, verifyEmail } from '@/services/auth.service'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { email, maxLength, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { triggerValidation } from '@/helpers/validation.helpers'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const url = route.query.url?.toString()

const canVerify = !!url
const mustRerequestVerification = computed(() => state.status === 'invalid')
onMounted(() => {
  verifyEmailAction()
})

const state = reactive({
  message:
    "We're trying to validate your email, state will be fast. You'll be redirected to the login page once the process is done.",
  header: 'Please wait',
  status: '',
  dialog: true,
  progressValue: 0,
  email: '',
  isRequestingVerification: false
})

const v$ = useVuelidate({ email: { required, email, maxLength: maxLength(255) } }, state, {
  $autoDirty: true
})

let interval = setInterval(() => {
  state.progressValue += Math.floor(Math.random() * 10)
  if (state.progressValue >= 90) {
    clearInterval(interval)
  }
}, 500)

const verifyEmailAction = async () => {
  if (!canVerify) {
    toast.add({
      life: 5000,
      severity: 'error',
      summary: 'Error',
      detail: "Invalid URL you'll be redirected to the login page"
    })
    return
  }

  try {
    const { data } = await verifyEmail(url)
    state.header = 'Email verified'
    state.message = data.message
    state.status = data.status
    toast.add({ life: 5000, severity: 'success', summary: state.header, detail: state.message })
  } catch (error: any) {
    const { data } = error.response
    state.header = data.message
    state.message = data.data
    state.status = data.status
    toast.add({
      life: 5000,
      severity: state.status == 'already_verified' ? 'info' : 'error',
      summary: state.header,
      detail: state.message
    })
  } finally {
    state.progressValue = 100
    if (state.status === 'email_verified' || state.status === 'already_verified') {
      router.push('/login')
    }
  }
}

const resendEmailVerificationAction = async () => {
  state.isRequestingVerification = true
  try {
    const {
      data: { message }
    } = await resendEmailVerification(state.email)
    toast.add({ life: 5000, severity: 'success', summary: 'Success', detail: message })
  } catch (error: any) {
    const {
      data: { status, message }
    } = error.response
    if (status === 'already_verified') {
      toast.add({ life: 5000, severity: 'info', summary: 'Info', detail: message })
      router.push('/login')
    } else {
      toast.add({ life: 5000, severity: 'error', summary: 'Error', detail: message })
    }
  }
  state.isRequestingVerification = false
}
</script>

<style></style>
