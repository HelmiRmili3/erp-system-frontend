<template>
    <div class="space-y-6  p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <Card title="Forgot password">
            <template #title>Forgot password</template>
            <template #content>
                <form @submit.prevent="onSubmit">
                    <!-- Email -->
                    <div class="col">
                        <label for="email" class="block text-gray-400 text-lg font-medium mb-2">Email</label>
                        <InputText id="email" placeholder="Email address" type="email"
                            class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
                            v-model="form.email" :invalid="v$.email.$error" @focus="triggerValidation(v$, 'email')"
                            @blur="triggerValidation(v$, 'email')" />
                        <!-- error message -->
                        <div v-if="v$.email.$error" class="text-red-500 text-sm mt-2">
                            <span v-if="v$.email.required.$invalid">Email is required.</span>
                            <span v-else-if="v$.email.email.$invalid">Invalid email address.</span>
                            <span v-else-if="v$.email.maxLength.$invalid">Email must be less than 255
                                characters.</span>
                        </div>
                    </div>
                    <!-- Submit Button -->
                    <div class="flex justify-between mt-4">
                        <RouterLink :to="{ name: 'Login' }">
                            <Button link label="Back to login" />
                        </RouterLink>
                        <Button label="Send" type="submit" :loading="isSubmitting" :disabled="isSubmitting"
                            class="w-full md:w-auto" />
                    </div>
                </form>
            </template>
        </Card>
    </div>
</template>

<script lang="ts" setup>
import { required, maxLength, email } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { reactive, ref } from "vue";
import { ForgotPasswordModel } from "@/models/auth.model";
import { requestResetPassword } from "@/services/auth.service";
import { useToast } from 'primevue/usetoast';
import { triggerValidation } from "@/helpers/validation.helpers";

const toast = useToast();
const isSubmitting = ref(false);
const form = reactive<ForgotPasswordModel>(new ForgotPasswordModel());

const rules = {
    email: { required, email, maxLength: maxLength(255) },
};

const v$ = useVuelidate(rules, form, { $autoDirty: true });

const onSubmit = async () => {
    v$.value.$touch();
    if (!v$.value.$invalid && !isSubmitting.value) {
        isSubmitting.value = true;
        try {
            var { data } = await requestResetPassword(form.email);
            if (data.success) {
                toast.add({ life: 5000, severity: 'success', summary: 'Success', detail: data.message });
                Object.assign(form, new ForgotPasswordModel());
                v$.value.$reset();
            } else {
                toast.add({ life: 5000, severity: 'error', summary: 'Error', detail: data.message });
            }
        } catch (e: any) {
            if (e.response.data) {
                toast.add({ life: 5000, severity: 'error', summary: 'Error', detail: e.response.data.message });
            } else {
                toast.add({ life: 5000, severity: 'error', summary: 'Error', detail: e.message });
            }
        }
        isSubmitting.value = false;
    }
};
</script>

<style scoped></style>