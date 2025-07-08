<template>
  <div style="margin-top: 7vh" :class="isMobile ?'' :'space-y-6 p-6 rounded-lg shadow-md max-w-2xl mx-auto'">
    <h1 class="text-2xl font-bold mb-2">Register</h1>
    <p class="text-gray-400 mb-5"></p>
    <form @submit.prevent="onSubmit">
      <!-- First Name -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <ProfileIcon />
          </InputIcon>
          <InputText
            id="first_name"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.first_name"
            :invalid="v$.first_name.$error"
            @focus="triggerValidation(v$, 'first_name')"
            @blur="triggerValidation(v$, 'first_name')"
          />
        </IconField>
        <label for="first_name" class="block text-gray-400 text-lg font-medium mb-2"
          >First Name</label
        >
      </FloatLabel>
      <!-- error message -->
      <div v-if="v$.first_name.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.first_name.required.$invalid">First name is required.</span>
        <span v-else-if="v$.first_name.maxLength.$invalid"
          >First name must be less than 255 characters.</span
        >
      </div>
      <!-- Last Name -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon> <ProfileIcon /> </InputIcon>
          <InputText
            id="last_name"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.last_name"
            :invalid="v$.last_name.$error"
            @focus="triggerValidation(v$, 'last_name')"
            @blur="triggerValidation(v$, 'last_name')"
          />
          <label for="last_name" class="block text-gray-400 text-lg font-medium mb-2"
            >Last Name</label
          >
        </IconField>
      </FloatLabel>
      <!-- error message -->
      <div v-if="v$.last_name.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.last_name.required.$invalid">Last name is required.</span>
        <span v-else-if="v$.last_name.maxLength.$invalid"
          >Last name must be less than 255 characters.</span
        >
      </div>

      <!-- Phone and Email -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <svg
              fill="#999999"
              height="24"
              width="24"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 473.806 473.806"
              xml:space="preserve"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <g>
                    <path
                      d="M374.456,293.506c-9.7-10.1-21.4-15.5-33.8-15.5c-12.3,0-24.1,5.3-34.2,15.4l-31.6,31.5c-2.6-1.4-5.2-2.7-7.7-4 c-3.6-1.8-7-3.5-9.9-5.3c-29.6-18.8-56.5-43.3-82.3-75c-12.5-15.8-20.9-29.1-27-42.6c8.2-7.5,15.8-15.3,23.2-22.8 c2.8-2.8,5.6-5.7,8.4-8.5c21-21,21-48.2,0-69.2l-27.3-27.3c-3.1-3.1-6.3-6.3-9.3-9.5c-6-6.2-12.3-12.6-18.8-18.6 c-9.7-9.6-21.3-14.7-33.5-14.7s-24,5.1-34,14.7c-0.1,0.1-0.1,0.1-0.2,0.2l-34,34.3c-12.8,12.8-20.1,28.4-21.7,46.5 c-2.4,29.2,6.2,56.4,12.8,74.2c16.2,43.7,40.4,84.2,76.5,127.6c43.8,52.3,96.5,93.6,156.7,122.7c23,10.9,53.7,23.8,88,26 c2.1,0.1,4.3,0.2,6.3,0.2c23.1,0,42.5-8.3,57.7-24.8c0.1-0.2,0.3-0.3,0.4-0.5c5.2-6.3,11.2-12,17.5-18.1c4.3-4.1,8.7-8.4,13-12.9 c9.9-10.3,15.1-22.3,15.1-34.6c0-12.4-5.3-24.3-15.4-34.3L374.456,293.506z M410.256,398.806 C410.156,398.806,410.156,398.906,410.256,398.806c-3.9,4.2-7.9,8-12.2,12.2c-6.5,6.2-13.1,12.7-19.3,20 c-10.1,10.8-22,15.9-37.6,15.9c-1.5,0-3.1,0-4.6-0.1c-29.7-1.9-57.3-13.5-78-23.4c-56.6-27.4-106.3-66.3-147.6-115.6 c-34.1-41.1-56.9-79.1-72-119.9c-9.3-24.9-12.7-44.3-11.2-62.6c1-11.7,5.5-21.4,13.8-29.7l34.1-34.1c4.9-4.6,10.1-7.1,15.2-7.1 c6.3,0,11.4,3.8,14.6,7c0.1,0.1,0.2,0.2,0.3,0.3c6.1,5.7,11.9,11.6,18,17.9c3.1,3.2,6.3,6.4,9.5,9.7l27.3,27.3 c10.6,10.6,10.6,20.4,0,31c-2.9,2.9-5.7,5.8-8.6,8.6c-8.4,8.6-16.4,16.6-25.1,24.4c-0.2,0.2-0.4,0.3-0.5,0.5 c-8.6,8.6-7,17-5.2,22.7c0.1,0.3,0.2,0.6,0.3,0.9c7.1,17.2,17.1,33.4,32.3,52.7l0.1,0.1c27.6,34,56.7,60.5,88.8,80.8 c4.1,2.6,8.3,4.7,12.3,6.7c3.6,1.8,7,3.5,9.9,5.3c0.4,0.2,0.8,0.5,1.2,0.7c3.4,1.7,6.6,2.5,9.9,2.5c8.3,0,13.5-5.2,15.2-6.9 l34.2-34.2c3.4-3.4,8.8-7.5,15.1-7.5c6.2,0,11.3,3.9,14.4,7.3c0.1,0.1,0.1,0.1,0.2,0.2l55.1,55.1 C420.456,377.706,420.456,388.206,410.256,398.806z"
                    ></path>
                    <path
                      d="M256.056,112.706c26.2,4.4,50,16.8,69,35.8s31.3,42.8,35.8,69c1.1,6.6,6.8,11.2,13.3,11.2c0.8,0,1.5-0.1,2.3-0.2 c7.4-1.2,12.3-8.2,11.1-15.6c-5.4-31.7-20.4-60.6-43.3-83.5s-51.8-37.9-83.5-43.3c-7.4-1.2-14.3,3.7-15.6,11 S248.656,111.506,256.056,112.706z"
                    ></path>
                    <path
                      d="M473.256,209.006c-8.9-52.2-33.5-99.7-71.3-137.5s-85.3-62.4-137.5-71.3c-7.3-1.3-14.2,3.7-15.5,11 c-1.2,7.4,3.7,14.3,11.1,15.6c46.6,7.9,89.1,30,122.9,63.7c33.8,33.8,55.8,76.3,63.7,122.9c1.1,6.6,6.8,11.2,13.3,11.2 c0.8,0,1.5-0.1,2.3-0.2C469.556,223.306,474.556,216.306,473.256,209.006z"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          </InputIcon>
          <InputText
            id="phone"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.phone"
            :invalid="v$.phone.$error"
            @focus="triggerValidation(v$, 'phone')"
            @blur="triggerValidation(v$, 'phone')"
          />
          <label for="phone" class="block text-gray-400 text-lg font-medium mb-2">Phone</label>
        </IconField>
      </FloatLabel>
      <!-- error message -->
      <div v-if="v$.phone.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.phone.required.$invalid">Phone number is required.</span>
        <span v-else-if="v$.phone.numeric.$invalid">Phone number must be numeric.</span>
        <span v-else-if="v$.phone.maxLength.$invalid || v$.phone.minLength.$invalid"
          >Phone number must be exactly 11 digits.</span
        >
      </div>
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M2 8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5H7"
                stroke="#999999"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9"
                stroke="#999999"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 16.5H8"
                stroke="#999999"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 12.5H5"
                stroke="#999999"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </InputIcon>
          <InputText
            id="email"
            type="email"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.email"
            :invalid="v$.email.$error"
            @focus="triggerValidation(v$, 'email')"
            @blur="triggerValidation(v$, 'email')"
          />
          <label for="email" class="block text-gray-400 text-lg font-medium mb-2">Email</label>
        </IconField>
      </FloatLabel>
      <!-- error message -->
      <div v-if="v$.email.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.email.required.$invalid">Email is required.</span>
        <span v-else-if="v$.email.email.$invalid">Invalid email address.</span>
        <span v-else-if="v$.email.maxLength.$invalid">Email must be less than 255 characters.</span>
      </div>

      <!-- Password and Confirm Password -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <svg
              class="svg-icon"
              height="24"
              width="24"
              style="vertical-align: middle; fill: currentColor; overflow: hidden"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M779.822 367.987h-10.317V272.55C770.365 116.93 657.733 0 508.99 0 362.828 0 251.056 116.93 251.056 272.55v95.437h-7.738c-78.24 0-141.004 66.203-141.004 143.583v367.987c0 80.82 63.624 143.583 141.004 143.583h536.504c78.24 0 141.004-66.203 141.004-143.583V511.57c-1.72-79.96-65.343-143.583-141.004-143.583zM294.905 270.83c0-134.126 90.277-228.702 214.086-228.702 126.388 0 216.665 97.156 216.665 228.702v95.436h-433.33v-95.436h2.58z m582.932 608.726c0 55.885-43.849 102.314-97.155 102.314H243.318c-53.306 0-97.155-46.429-97.155-102.314V511.57c0-55.886 43.849-102.314 97.155-102.314h537.364c53.306 0 97.155 46.428 97.155 102.314v367.987z"
                fill=""
              />
              <path
                d="M507.271 567.456c-34.391 0-61.044 29.232-61.044 63.624 0 24.074 12.037 43.849 31.812 55.886v104.893c0 17.196 14.616 31.812 31.812 31.812s31.811-14.616 31.811-31.812V686.966c19.775-12.037 31.812-31.812 31.812-55.886-6.018-33.532-32.671-63.624-66.203-63.624z"
                fill=""
              />
            </svg>
          </InputIcon>
          <Password
            :feedback="false"
            class="w-full rounded-lg text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.password"
            :invalid="v$.password.$error"
            @focus="triggerValidation(v$, 'password')"
            @blur="triggerValidation(v$, 'password')"
            toggleMask
          />
          <label for="password" class="block text-gray-400 text-lg font-medium mb-2"
            >Password</label
          >
        </IconField>
      </FloatLabel>
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
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <svg
              class="svg-icon"
              height="24"
              width="24"
              style="vertical-align: middle; fill: currentColor; overflow: hidden"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M779.822 367.987h-10.317V272.55C770.365 116.93 657.733 0 508.99 0 362.828 0 251.056 116.93 251.056 272.55v95.437h-7.738c-78.24 0-141.004 66.203-141.004 143.583v367.987c0 80.82 63.624 143.583 141.004 143.583h536.504c78.24 0 141.004-66.203 141.004-143.583V511.57c-1.72-79.96-65.343-143.583-141.004-143.583zM294.905 270.83c0-134.126 90.277-228.702 214.086-228.702 126.388 0 216.665 97.156 216.665 228.702v95.436h-433.33v-95.436h2.58z m582.932 608.726c0 55.885-43.849 102.314-97.155 102.314H243.318c-53.306 0-97.155-46.429-97.155-102.314V511.57c0-55.886 43.849-102.314 97.155-102.314h537.364c53.306 0 97.155 46.428 97.155 102.314v367.987z"
                fill=""
              />
              <path
                d="M507.271 567.456c-34.391 0-61.044 29.232-61.044 63.624 0 24.074 12.037 43.849 31.812 55.886v104.893c0 17.196 14.616 31.812 31.812 31.812s31.811-14.616 31.811-31.812V686.966c19.775-12.037 31.812-31.812 31.812-55.886-6.018-33.532-32.671-63.624-66.203-63.624z"
                fill=""
              />
            </svg>
          </InputIcon>
          <Password
            :feedback="false"
            class="w-full rounded-lg text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.confirm_password"
            :invalid="v$.confirm_password.$error"
            @focus="triggerValidation(v$, 'confirm_password')"
            @blur="triggerValidation(v$, 'confirm_password')"
            toggleMask
          />
          <label for="confirmPassword" class="block text-gray-400 text-lg font-medium mb-2"
            >Confirm Password</label
          >
        </IconField>
      </FloatLabel>
      <!-- error message -->
      <div v-if="v$.confirm_password.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.confirm_password.required.$invalid">Confirm password is required.</span>
        <span v-else-if="v$.confirm_password.sameAsPassword.$invalid">Passwords must match.</span>
      </div>
      <!-- Address -->
      <!-- <div class="col">
        <label for="address" class="block text-gray-400 text-lg font-medium mb-2">Address</label>
        <InputText
          id="address"
          placeholder="Address"
          class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
          v-model="user.address"
          :invalid="v$.address.$error"
          @focus="triggerValidation(v$, 'address')"
          @blur="triggerValidation(v$, 'address')"
        />
        <div v-if="v$.address.$error" class="text-red-500 text-sm mt-2">
          <span v-if="v$.address.required.$invalid">Address is required.</span>
          <span v-else-if="v$.address.maxLength.$invalid"
            >Address must be less than 255 characters.</span
          >
        </div>
      </div> -->

      <!-- Submit Button -->
      <div class="mt-4 px-5 text-center">
        <Button
          label="Register"
          type="submit"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          class="w-full md:w-auto"
          rounded
          style="background-color: #f86a2e; color: white; border: none"
        />
      </div>
    </form>
    <div class="forget-password text-center">
      <RouterLink :to="{ name: 'Login' }">
        <Button link label="Return To Login?" />
      </RouterLink>
    </div>

    <div class="text-center mb-1">
      OR <br />
      <!-- Google Login Button -->
      <GoogleLogin :callback="handleGoogleSignUp" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { required, maxLength, minLength, numeric, email, sameAs } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { computed, reactive, ref } from 'vue'
import { RegisterModel } from '@/models/auth.model'
import { googleSignIn, register } from '@/services/auth.service'
import { useToast } from 'primevue/usetoast'
import { triggerValidation } from '@/helpers/validation.helpers'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import ProfileIcon from '@/components/icons/ProfileIcon.vue'
import { useBreakpoints } from '@/composables/useBreakpoints'

const { type } = useBreakpoints()
const isMobile = computed(() => type.value === 'mobile')

const toast = useToast()
const isSubmitting = ref(false)
const user = reactive<RegisterModel>(new RegisterModel())
const authStore = useAuthStore()
const router = useRouter()

const rules = {
  first_name: { required, maxLength: maxLength(255) },
  last_name: { required, maxLength: maxLength(255) },
  phone: { required, numeric, maxLength: maxLength(11), minLength: minLength(11) },
  email: { required, email, maxLength: maxLength(255) },
  password: {
    required,
    minLength: minLength(8),
    containsUpperCase: (value: string) => value.match(/[A-Z]/),
    containsLowerCase: (value: string) => value.match(/[a-z]/),
    containsNumber: (value: string) => value.match(/[0-9]/),
    containsSymbol: (value: string) => value.match(/[^A-Za-z0-9]/),
    containsSpecial: (value: string) => value.match(/[!-\/:-@[-`{-~]/)
  },
  confirm_password: { required, sameAsPassword: sameAs(computed(() => user.password)) },
  address: { required, maxLength: maxLength(255) }
}

const v$ = useVuelidate(rules, user, { $autoDirty: true })

const onSubmit = async () => {
  v$.value.$touch()
  if (!v$.value.$invalid && !isSubmitting.value) {
    isSubmitting.value = true
    try {
      var { data } = await register(user)
      if (data.success) {
        toast.add({ life: 5000, severity: 'success', summary: 'Success', detail: data.message })
        Object.assign(user, new RegisterModel())
        v$.value.$reset()
      } else {
        toast.add({ life: 5000, severity: 'error', summary: 'Error', detail: data.message })
      }
    } catch (e: any) {
      if (e.response.data) {
        const data = e.response.data.data
        if (data && Object.keys(data).length) {
          Object.keys(data).forEach((key) => {
            toast.add({
              life: 5000,
              severity: 'error',
              summary: 'Validation Error',
              detail: data[key][0]
            })
          })
        } else {
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

const handleGoogleSignUp = async (response: any) => {
  try {
    const idToken = response.credential
    const { data } = await googleSignIn(idToken)
    if (data.token) {
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.add({
        life: 5000,
        severity: 'success',
        summary: 'Success',
        detail: 'Logged in successfully!'
      })
      authStore.login(data)
      router.push({ name: 'HomePage' })
    }
  } catch (error) {
    console.error('Google authentication failed:', error)
    toast.add({
      life: 5000,
      severity: 'error',
      summary: 'Error',
      detail: 'Google authentication failed'
    })
  }
}
const redirectToLogin = () => {
  router.push({ name: 'Login' })
}
</script>

<style lang="scss">
.forget-password {
  .p-button-link {
    font-size: 14px;
    color: #999999;
  }
}
</style>
