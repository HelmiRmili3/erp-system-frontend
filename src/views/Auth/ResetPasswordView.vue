<template>
  <div class="space-y-6 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
    <Card title="Reset password">
      <template #title>Reset password</template>
      <template #content>
        <form @submit.prevent="onSubmit">
          <!-- Email -->
          <div class="col">
            <label for="email" class="block text-gray-400 text-lg font-medium mb-2">Email</label>
            <InputText
              id="email"
              placeholder="Email address"
              type="email"
              class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
              v-model="form.email"
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
          </div>
          <!-- Password and Confirm Password -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div class="col">
              <label for="password" class="block text-gray-400 text-lg font-medium mb-2"
                >Password</label
              >
              <Password
                :feedback="false"
                toggleMask
                placeholder="Password"
                class="w-full rounded-lg text-white border-gray-600 focus:ring focus:ring-green-500"
                v-model="form.password"
                :invalid="v$.password.$error"
                @focus="triggerValidation(v$, 'password')"
                @blur="triggerValidation(v$, 'password')"
              />
              <!-- error message -->
              <div v-if="v$.password.$error" class="text-red-500 text-sm mt-2">
                <span v-if="v$.password.required.$invalid">Password is required.</span>
                <span v-else-if="v$.password.minLength.$invalid"
                  >Password must be at least 8 characters long.</span
                >
                <span v-else-if="v$.password.containsUpperCase.$invalid"
                  >Password must contain at least one uppercase letter.</span
                >
                <span v-else-if="v$.password.containsLowerCase.$invalid"
                  >Password must contain at least one lowercase letter.</span
                >
                <span v-else-if="v$.password.containsNumber.$invalid"
                  >Password must contain at least one number.</span
                >
                <span v-else-if="v$.password.containsSymbol.$invalid"
                  >Password must contain at least one symbol.</span
                >
                <span v-else-if="v$.password.containsSpecial.$invalid"
                  >Password must contain at least one special character.</span
                >
              </div>
            </div>

            <div class="col">
              <label for="confirmPassword" class="block text-gray-400 text-lg font-medium mb-2"
                >Confirm Password</label
              >
              <Password
                :feedback="false"
                toggleMask
                id="confirmPassword"
                placeholder="Confirm Password"
                class="w-full rounded-lg text-white border-gray-600 focus:ring focus:ring-green-500"
                v-model="form.confirm_password"
                :invalid="v$.confirm_password.$error"
                @focus="triggerValidation(v$, 'confirm_password')"
                @blur="triggerValidation(v$, 'confirm_password')"
              />
              <!-- error message -->
              <div v-if="v$.confirm_password.$error" class="text-red-500 text-sm mt-2">
                <span v-if="v$.confirm_password.required.$invalid"
                  >Confirm password is required.</span
                >
                <span v-else-if="v$.confirm_password.sameAsPassword.$invalid"
                  >Passwords must match.</span
                >
              </div>
            </div>
          </div>
          <!-- canRerequestToken -->
          <div v-if="canRerequestToken" class="text-red-500 text-sm mt-2">
            <span>
              <Button
                @click="resendResetPasswordAction"
                link
                :loading="isSubmitting"
                :disabled="isSubmitting"
              >
                Click here to resend verification email.
              </Button>
            </span>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end mt-4">
            <Button
              label="Send"
              type="submit"
              :loading="isSubmitting"
              :disabled="isSubmitting"
              class="w-full md:w-auto"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { required, maxLength, email, minLength, sameAs } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { computed, reactive, ref } from 'vue'
import { ResetPasswordModel } from '@/models/auth.model'
import { resetPassword } from '@/services/auth.service'
import { useToast } from 'primevue/usetoast'
import { triggerValidation } from '@/helpers/validation.helpers'
import { useRoute, useRouter } from 'vue-router'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const isSubmitting = ref(false)
const canRerequestToken = ref(false)
const form = reactive<ResetPasswordModel>(new ResetPasswordModel())

form.token = route.query.token as string

const rules = {
  email: { required, email, maxLength: maxLength(255) },
  password: {
    required,
    minLength: minLength(8),
    containsUpperCase: (value: string) => value.match(/[A-Z]/),
    containsLowerCase: (value: string) => value.match(/[a-z]/),
    containsNumber: (value: string) => value.match(/[0-9]/),
    containsSymbol: (value: string) => value.match(/[^A-Za-z0-9]/),
    containsSpecial: (value: string) => value.match(/[!-/:-@[-`{-~]/)
  },
  confirm_password: { required, sameAsPassword: sameAs(computed(() => form.password)) }
}

const v$ = useVuelidate(rules, form, { $autoDirty: true })

const onSubmit = async () => {
  v$.value.$touch()
  if (!v$.value.$invalid && !isSubmitting.value) {
    isSubmitting.value = true
    try {
      var { data } = await resetPassword(form)
      if (data.succeeded) {
        toast.add({ life: 5000, severity: 'success', summary: 'Success', detail: data.message })
        await new Promise((resolve) => setTimeout(resolve, 5000))
        Object.assign(form, new ResetPasswordModel())
        v$.value.$reset()
        router.push({ name: 'Login' })
      } else {
        toast.add({ life: 5000, severity: 'error', summary: 'Error', detail: data.message })
      }
    } catch (e: any) {
      if (e.response.data) {
        const data = e.response.data
        canRerequestToken.value = data.status === 'invalid_token'
        toast.add({
          life: 5000,
          severity: 'error',
          summary: 'Error',
          detail: e.response.data.message
        })
      } else {
        toast.add({ life: 5000, severity: 'error', summary: 'Error', detail: e.message })
      }
    }
    isSubmitting.value = false
  }
}

const resendResetPasswordAction = async () => {
  isSubmitting.value = true
  try {
    // const { data: { message } } = await requestResetPassword(form.email);
    toast.add({ life: 5000, severity: 'success', summary: 'Success', detail: '' })
    canRerequestToken.value = false
  } catch (error: any) {
    const {
      data: { message }
    } = error.response
    toast.add({ life: 5000, severity: 'error', summary: 'Error', detail: message })
  }
  isSubmitting.value = false
}
</script>

<style scoped></style>
