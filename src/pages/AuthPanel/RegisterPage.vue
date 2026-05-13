<template>
  <q-page class="flex flex-center">
    <q-card class="register-card shadow-24">
      <q-card-section class="bg-secondary text-white text-center q-pa-lg">
        <div class="text-h5 text-weight-bold">Start Your SaaS Journey</div>
        <div class="text-subtitle2">Register your restaurant</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <q-form @submit="handleRegister" class="q-gutter-sm">
          <q-input
            filled
            v-model="fullName"
            label="Full Name"
            :rules="[val => !!val || 'Name is required']"
          />

          <q-input
            filled
            v-model="restaurantName"
            label="Restaurant Name"
            :rules="[val => !!val || 'Restaurant name is required']"
          />

          <q-input
            filled
            v-model="email"
            label="Email"
            type="email"
            :rules="[val => !!val || 'Email is required']"
          />

          <q-input
            filled
            v-model="password"
            label="Password"
            type="password"
            :rules="[val => val.length >= 6 || 'Min 6 characters']"
          />

          <q-checkbox
            v-model="terms"
            label="I agree to the terms and conditions"
            :rules="[val => val === true || 'Must agree to terms']"
          />

          <div class="q-mt-md">
            <q-btn
              label="Create Account"
              type="submit"
              color="secondary"
              class="full-width q-py-sm"
              :loading="loading"
              :disabled="!terms"
            />
          </div>

          <div class="text-center q-mt-md">
            Already have an account?
            <q-btn flat color="primary" label="Login" to="/auth/login" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default {
  name: 'RegisterPage',
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const fullName = ref('')
    const restaurantName = ref('')
    const email = ref('')
    const password = ref('')
    const terms = ref(false)
    const loading = ref(false)

    const handleRegister = () => {
      loading.value = true

      setTimeout(() => {
        // Local Storage temporary save
        const registrationData = {
          user: fullName.value,
          restaurant: restaurantName.value,
          email: email.value
        }

        localStorage.setItem('pending_verification', JSON.stringify(registrationData))

        $q.notify({
          color: 'info',
          message: 'Account created! Please login.',
          icon: 'info'
        })

        loading.value = false
        router.push('/auth/login')
      }, 2000)
    }

    return {
      fullName,
      restaurantName,
      email,
      password,
      terms,
      loading,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-card {
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
}
</style>
