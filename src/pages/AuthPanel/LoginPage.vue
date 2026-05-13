<template>
  <q-page class="flex flex-center">
    <q-card class="login-card shadow-24">
      <q-card-section class="bg-primary text-white text-center q-pa-lg">
        <div class="text-h5 text-weight-bold">Restaurant SaaS</div>
        <div class="text-subtitle2">Login to your dashboard</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <q-form @submit="handleLogin" class="q-gutter-md">
          <q-input
            filled
            v-model="email"
            label="Email Address"
            type="email"
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Email is required']"
          >
            <template v-slot:prepend><q-icon name="email" /></template>
          </q-input>

          <q-input
            filled
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            lazy-rules
            :rules="[val => val && val.length >= 6 || 'Min 6 characters']"
          >
            <template v-slot:prepend><q-icon name="lock" /></template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <div class="row items-center justify-between">
            <q-checkbox v-model="rememberMe" label="Remember me" />
            <q-btn flat color="primary" label="Forgot Password?" dense />
          </div>

          <q-btn
            label="Login"
            type="submit"
            color="primary"
            class="full-width q-py-sm"
            :loading="loading"
          />

          <div class="text-center q-mt-md">
            Don't have an account?
            <q-btn flat color="secondary" label="Register Now" to="/auth/register" />
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
  name: 'LoginPage',
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const rememberMe = ref(false)
    const loading = ref(false)

    const handleLogin = () => {
      loading.value = true

      // API Integration Point: Replace with actual axios call
      setTimeout(() => {
        const userData = {
          token: 'token_' + Math.random().toString(36).substr(2),
          email: email.value,
          role: 'admin',
          restaurant_id: 101
        }

        // 3. Local Storage Data Save
        localStorage.setItem('user_session', JSON.stringify(userData))

        $q.notify({
          color: 'positive',
          message: 'Login Successful!',
          icon: 'check'
        })

        loading.value = false
        router.push('/')
      }, 1500)
    }

    return {
      email,
      password,
      showPassword,
      rememberMe,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
}
</style>
