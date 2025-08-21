<template>
  <div
    style="margin-top: 7vh"
    :class="isMobile ? '' : 'space-y-6 p-6 rounded-lg shadow-md max-w-2xl mx-auto'"
  >
    <h1 class="text-2xl font-bold mb-2">Register</h1>
    <p class="text-gray-400 mb-5">Create your account</p>
    <form @submit.prevent="onSubmit">
      <!-- Username -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <ProfileIcon />
          </InputIcon>
          <InputText
            id="user_name"
            autofocus
            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.userName"
            :invalid="v$.user.userName.$error"
          />
        </IconField>
        <label for="user_name" class="block text-gray-400 text-lg font-medium mb-2">Username</label>
      </FloatLabel>
      <div v-if="v$.user.userName.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.user.userName.required.$invalid">Username is required.</span>
        <span v-else-if="v$.user.userName.maxLength.$invalid"
          >Username must be less than 255 characters.</span
        >
      </div>

      <!-- First Name -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <ProfileIcon />
          </InputIcon>
          <InputText
            id="first_name"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.firstName"
            :invalid="v$.user.firstName.$error"
          />
        </IconField>
        <label for="first_name" class="block text-gray-400 text-lg font-medium mb-2"
          >First Name</label
        >
      </FloatLabel>
      <div v-if="v$.user.firstName.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.user.firstName.required.$invalid">First name is required.</span>
        <span v-else-if="v$.user.firstName.maxLength.$invalid"
          >First name must be less than 255 characters.</span
        >
      </div>

      <!-- Last Name -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <ProfileIcon />
          </InputIcon>
          <InputText
            id="last_name"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.lastName"
            :invalid="v$.user.lastName.$error"
          />
        </IconField>
        <label for="last_name" class="block text-gray-400 text-lg font-medium mb-2"
          >Last Name</label
        >
      </FloatLabel>
      <div v-if="v$.user.lastName.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.user.lastName.required.$invalid">Last name is required.</span>
        <span v-else-if="v$.user.lastName.maxLength.$invalid"
          >Last name must be less than 255 characters.</span
        >
      </div>

      <!-- Email -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <EmailIcon />
          </InputIcon>
          <InputText
            id="email"
            type="email"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.email"
            :invalid="v$.user.email.$error"
          />
          <label for="email" class="block text-gray-400 text-lg font-medium mb-2">Email</label>
        </IconField>
      </FloatLabel>
      <div v-if="v$.user.email.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.user.email.required.$invalid">Email is required.</span>
        <span v-else-if="v$.user.email.email.$invalid">Invalid email address.</span>
        <span v-else-if="v$.user.email.maxLength.$invalid"
          >Email must be less than 255 characters.</span
        >
      </div>

      <!-- Phone -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <PhoneIcon />
          </InputIcon>
          <InputText
            id="phone"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.phone"
            :invalid="v$.user.phone.$error"
          />
          <label for="phone" class="block text-gray-400 text-lg font-medium mb-2">Phone</label>
        </IconField>
      </FloatLabel>
      <div v-if="v$.user.phone.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.user.phone.required.$invalid">Phone number is required.</span>
        <span v-else-if="v$.user.phone.numeric.$invalid">Phone number must be numeric.</span>
        <span v-else-if="v$.user.phone.maxLength.$invalid"
          >Phone number must be exactly 8 digits.</span
        >
        <span v-else-if="v$.user.phone.minLength.$invalid"
          >Phone number must be exactly 8 digits.</span
        >
      </div>

      <!-- Address -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <AddressIcon />
          </InputIcon>
          <InputText
            id="address"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.address"
            :invalid="v$.user.address.$error"
          />
          <label for="address" class="block text-gray-400 text-lg font-medium mb-2">Address</label>
        </IconField>
      </FloatLabel>
      <div v-if="v$.user.address.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.user.address.required.$invalid">Address is required.</span>
        <span v-else-if="v$.user.address.maxLength.$invalid"
          >Address must be less than 255 characters.</span
        >
      </div>

      <!-- Job Title -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <JobIcon />
          </InputIcon>
          <InputText
            id="job_title"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.jobTitle"
            :invalid="v$.user.jobTitle.$error"
          />
          <label for="job_title" class="block text-gray-400 text-lg font-medium mb-2"
            >Job Title</label
          >
        </IconField>
      </FloatLabel>
      <div v-if="v$.user.jobTitle.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.user.jobTitle.required.$invalid">Job title is required.</span>
        <span v-else-if="v$.user.jobTitle.maxLength.$invalid"
          >Job title must be less than 255 characters.</span
        >
      </div>

      <!-- Department -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <DepartmentIcon />
          </InputIcon>
          <InputText
            id="department"
            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.department"
            :invalid="v$.user.department.$error"
          />
          <label for="department" class="block text-gray-400 text-lg font-medium mb-2"
            >Department</label
          >
        </IconField>
      </FloatLabel>
      <div v-if="v$.user.department.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.user.department.required.$invalid">Department is required.</span>
        <span v-else-if="v$.user.department.maxLength.$invalid"
          >Department must be less than 255 characters.</span
        >
      </div>

      <!-- Birth Date -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <CalendarIcon />
          </InputIcon>
          <DatePicker
            id="birth_date"
            v-model="birthDateModel"
            :min-date="hundredYearsAgo"
            :max-date="today"
            class="w-full rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            :invalid="v$.user.birthDate.$error"
            dateFormat="yy-mm-dd"
            showIcon
          />
          <label for="birth_date" class="block text-gray-400 text-lg font-medium mb-2"
            >Birth Date</label
          >
        </IconField>
      </FloatLabel>
      <div v-if="v$.user.birthDate.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.user.birthDate.required.$invalid">Birth date is required.</span>
        <span v-else-if="v$.user.birthDate.validDate.$invalid"
          >Birth date must be a valid date.</span
        >
        <span v-else-if="v$.user.birthDate.notFutureDate.$invalid"
          >Birth date cannot be in the future.</span
        >
      </div>

      <!-- Hire Date -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <CalendarIcon />
          </InputIcon>
          <DatePicker
            id="hire_date"
            v-model="hireDateModel"
            :min-date="oneYearAgo"
            :max-date="today"
            class="w-full rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
            :invalid="v$.user.hireDate.$error"
            dateFormat="yy-mm-dd"
            showIcon
          />
          <label for="hire_date" class="block text-gray-400 text-lg font-medium mb-2"
            >Hire Date</label
          >
        </IconField>
      </FloatLabel>
      <div v-if="v$.user.hireDate.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.user.hireDate.required.$invalid">Hire date is required.</span>
        <span v-else-if="v$.user.hireDate.validDate.$invalid">Hire date must be a valid date.</span>
      </div>

      <!-- Contract Type -->
      <BaseDropdown
        id="contract_type"
        v-model="user.contractType"
        :options="contractTypes"
        optionLabel="label"
        optionValue="value"
        label="Contract Type"
      >
        <template #icon>
          <ContractIcon />
        </template>
      </BaseDropdown>
      <div v-if="v$.user.contractType.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.user.contractType.required.$invalid">Contract type is required.</span>
        <span v-else-if="v$.user.contractType.validOption.$invalid">Invalid contract type.</span>
      </div>

      <!-- Status -->
      <BaseDropdown
        id="status"
        v-model="user.status"
        :options="statuses"
        optionLabel="label"
        optionValue="value"
        label="status"
      >
        <template #icon>
          <StatusIcon />
        </template>
      </BaseDropdown>
      <div v-if="v$.user.status.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.user.status.required.$invalid">Status is required.</span>
        <span v-else-if="v$.user.status.validOption.$invalid">Invalid status.</span>
      </div>

      <!-- Password -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <PasswordIcon />
          </InputIcon>
          <Password
            :feedback="false"
            class="w-full rounded-lg text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="user.password"
            :invalid="v$.user.password.$error"
            toggleMask
          />
          <label for="password" class="block text-gray-400 text-lg font-medium mb-2"
            >Password</label
          >
        </IconField>
      </FloatLabel>
      <div v-if="v$.user.password.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.user.password.required.$invalid">Password is required.</span>
        <span v-else-if="v$.user.password.minLength.$invalid"
          >Password must be at least 8 characters long.</span
        >
        <span v-else-if="v$.user.password.containsUpperCase.$invalid"
          >Password must contain at least one uppercase letter.</span
        >
        <span v-else-if="v$.user.password.containsLowerCase.$invalid"
          >Password must contain at least one lowercase letter.</span
        >
        <span v-else-if="v$.user.password.containsNumber.$invalid"
          >Password must contain at least one number.</span
        >
        <span v-else-if="v$.user.password.containsSymbol.$invalid"
          >Password must contain at least one special character.</span
        >
      </div>

      <!-- Confirm Password -->
      <FloatLabel class="w-full mt-5" variant="on">
        <IconField>
          <InputIcon>
            <PasswordIcon />
          </InputIcon>
          <Password
            :feedback="false"
            class="w-full rounded-lg text-white border-gray-600 focus:ring focus:ring-green-500"
            v-model="confirmPassword"
            :invalid="v$.confirmPassword.$error"
            toggleMask
          />
          <label for="confirmPassword" class="block text-gray-400 text-lg font-medium mb-2"
            >Confirm Password</label
          >
        </IconField>
      </FloatLabel>
      <div v-if="v$.confirmPassword.$error" class="text-red-500 text-sm mt-2">
        <span v-if="v$.confirmPassword.required.$invalid">Confirm password is required.</span>
        <span v-else-if="v$.confirmPassword.sameAsPassword.$invalid">Passwords must match.</span>
      </div>

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
  </div>
</template>

<script lang="ts" setup>
import { required, maxLength, minLength, numeric, email, sameAs } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import type { ErrorObject } from '@vuelidate/core'
import { computed, reactive, ref, onMounted } from 'vue'
import type { RegisterModel } from '@/models/auth.model'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import ProfileIcon from '@/components/icons/ProfileIcon.vue'
import EmailIcon from '@/components/icons/EmailIcon.vue'
import PhoneIcon from '@/components/icons/PhoneIcon.vue'
import JobIcon from '@/components/icons/JobIcon.vue'
import PasswordIcon from '@/components/icons/PasswordIcon.vue'
import StatusIcon from '@/components/icons/StatusIcon.vue'
import ContractIcon from '@/components/icons/ContractIcon.vue'
import CalendarIcon from '@/components/icons/CalendarIcon.vue'
import DepartmentIcon from '@/components/icons/DepartmentIcon.vue'
import { useBreakpoints } from '@/composables/useBreakpoints'
import { useAppStore } from '@/stores/app.store'
import AddressIcon from '@/components/icons/AddressIcon.vue'

const { type } = useBreakpoints()
const isMobile = computed(() => type.value === 'mobile')

const toast = useToast()
const isSubmitting = ref(false)
const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const oneYearAgo = new Date()

const today = new Date()
const hundredYearsAgo = new Date()
hundredYearsAgo.setFullYear(today.getFullYear() - 100)

oneYearAgo.setFullYear(today.getFullYear() - 1)

const user = reactive<RegisterModel>({
  email: '',
  userName: '',
  password: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  address: '',
  phone: '',
  jobTitle: '',
  department: '',
  hireDate: '',
  contractType: 0,
  status: 0
})
const confirmPassword = ref<string>('')

const contractTypes = [
  { label: 'CDI', value: 1 },
  { label: 'CDD', value: 2 },
  { label: 'Freelance', value: 3 }
]
const statuses = [
  { label: 'Active', value: 1 },
  { label: 'Inactive', value: 0 }
]

const validDate = (value: string) => {
  const date = new Date(value)
  return !isNaN(date.getTime())
}

const notFutureDate = (value: string) => {
  const date = new Date(value)
  return date <= new Date()
}

const birthDateModel = computed({
  get: () => (user.birthDate ? new Date(user.birthDate) : null),
  set: (value: Date | null) => {
    user.birthDate = value ? value.toISOString() : ''
  }
})

const hireDateModel = computed({
  get: () => (user.hireDate ? new Date(user.hireDate) : null),
  set: (value: Date | null) => {
    user.hireDate = value ? value.toISOString() : ''
  }
})

// Centralized field configuration with rules and messages
const fields = {
  userName: {
    rules: { required, maxLength: maxLength(255) },
    messages: {
      required: 'Username is required.',
      maxLength: 'Username must be less than 255 characters.'
    }
  },
  firstName: {
    rules: { required, maxLength: maxLength(255) },
    messages: {
      required: 'First name is required.',
      maxLength: 'First name must be less than 255 characters.'
    }
  },
  lastName: {
    rules: { required, maxLength: maxLength(255) },
    messages: {
      required: 'Last name is required.',
      maxLength: 'Last name must be less than 255 characters.'
    }
  },
  email: {
    rules: { required, email, maxLength: maxLength(255) },
    messages: {
      required: 'Email is required.',
      email: 'Invalid email address.',
      maxLength: 'Email must be less than 255 characters.'
    }
  },
  phone: {
    rules: { required, numeric, maxLength: maxLength(8), minLength: minLength(8) },
    messages: {
      required: 'Phone number is required.',
      numeric: 'Phone number must be numeric.',
      maxLength: 'Phone number must be exactly 8 digits.',
      minLength: 'Phone number must be exactly 8 digits.'
    }
  },
  address: {
    rules: { required, maxLength: maxLength(255) },
    messages: {
      required: 'Address is required.',
      maxLength: 'Address must be less than 255 characters.'
    }
  },
  jobTitle: {
    rules: { required, maxLength: maxLength(255) },
    messages: {
      required: 'Job title is required.',
      maxLength: 'Job title must be less than 255 characters.'
    }
  },
  department: {
    rules: { required, maxLength: maxLength(255) },
    messages: {
      required: 'Department is required.',
      maxLength: 'Department must be less than 255 characters.'
    }
  },
  birthDate: {
    rules: { required, validDate, notFutureDate },
    messages: {
      required: 'Birth date is required.',
      validDate: 'Birth date must be a valid date.',
      notFutureDate: 'Birth date cannot be in the future.'
    }
  },
  hireDate: {
    rules: { required, validDate },
    messages: {
      required: 'Hire date is required.',
      validDate: 'Hire date must be a valid date.'
    }
  },
  contractType: {
    rules: {
      required,
      validOption: (value: number) => [1, 2, 3].includes(value)
    },
    messages: {
      required: 'Contract type is required.',
      validOption: 'Invalid contract type.'
    }
  },
  status: {
    rules: {
      required,
      validOption: (value: number) => [0, 1].includes(value)
    },
    messages: {
      required: 'Status is required.',
      validOption: 'Invalid status.'
    }
  },
  password: {
    rules: {
      required,
      minLength: minLength(8),
      containsUpperCase: (value: string) => value.match(/[A-Z]/) || false,
      containsLowerCase: (value: string) => value.match(/[a-z]/) || false,
      containsNumber: (value: string) => value.match(/[0-9]/) || false,
      containsSymbol: (value: string) => value.match(/[^A-Za-z0-9]/) || false
    },
    messages: {
      required: 'Password is required.',
      minLength: 'Password must be at least 8 characters long.',
      containsUpperCase: 'Password must contain at least one uppercase letter.',
      containsLowerCase: 'Password must contain at least one lowercase letter.',
      containsNumber: 'Password must contain at least one number.',
      containsSymbol: 'Password must contain at least one special character.'
    }
  },
  confirmPassword: {
    rules: { required, sameAsPassword: sameAs(computed(() => user.password)) },
    messages: {
      required: 'Confirm password is required.',
      sameAsPassword: 'Passwords must match.'
    }
  }
}

// Generate Vuelidate rules from fields configuration
const rules = computed(() => ({
  user: {
    userName: fields.userName.rules,
    firstName: fields.firstName.rules,
    lastName: fields.lastName.rules,
    email: fields.email.rules,
    phone: fields.phone.rules,
    address: fields.address.rules,
    jobTitle: fields.jobTitle.rules,
    department: fields.department.rules,
    birthDate: fields.birthDate.rules,
    hireDate: fields.hireDate.rules,
    contractType: fields.contractType.rules,
    status: fields.status.rules,
    password: fields.password.rules
  },
  confirmPassword: fields.confirmPassword.rules
}))

const v$ = useVuelidate(rules, { user, confirmPassword }, { $autoDirty: true })

appStore.setLoading(false)
onMounted(() => {
  const userNameInput = document.getElementById('user_name') as HTMLInputElement
  if (userNameInput && document.activeElement === document.body) {
    userNameInput.focus()
  }
})

const resetUser = () => {
  Object.assign(user, {
    email: '',
    userName: '',
    password: '',
    confirm_password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    address: '',
    phone: '',
    jobTitle: '',
    department: '',
    hireDate: '',
    contractType: 0,
    status: 0
  })
  confirmPassword.value = ''
  v$.value.$reset()
}

const onSubmit = async () => {
  // Force validation
  await v$.value.$validate()
  // Debug validation state
  console.log('Validation state:', {
    invalid: v$.value.$invalid,
    errors: v$.value.$errors,
    firstName: v$.value.user.firstName.$errors,
    userName: v$.value.user.userName.$errors,
    email: v$.value.user.email.$errors,
    confirmPassword: v$.value.confirmPassword.$errors
  })
  if (!v$.value.$invalid && !isSubmitting.value) {
    isSubmitting.value = true
    try {
      console.log(user)
      const result = await authStore.register(user)

      if (result.succeeded) {
        toast.add({
          life: 5000,
          severity: 'success',
          summary: 'Success',
          detail: 'Registration successful!'
        })
        resetUser()
        router.push({ name: 'AdminDashboard' })
      } else {
        const { errors } = result
        if (errors && errors.length) {
          errors.forEach((err) => {
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
            detail: 'Registration failed'
          })
        }
      }
    } catch (error: any) {
      if (error.response?.data) {
        const { message, errors } = error.response.data
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
            detail: message || 'Registration failed'
          })
        }
      } else {
        toast.add({
          life: 5000,
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Registration failed'
        })
      }
    } finally {
      isSubmitting.value = false
    }
  } else {
    // Show specific validation errors
    const errors = v$.value.$errors as ErrorObject[]
    const errorMessages = errors.map((error) => error.$message)
    errorMessages.forEach((message) => {
      toast.add({
        life: 5000,
        severity: 'error',
        summary: 'Validation Error',
        detail: message
      })
    })
  }
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
