<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card style="width: 400px; max-width: 90vw" class="q-pa-md shadow-10">

      <q-card-section class="text-center bg-primary text-white">
        <div class="text-h6">Restaurant SaaS</div>
        <div class="text-subtitle2">Login to your dashboard</div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form @submit.prevent="handleLogin">

          <!-- EMAIL -->
          <q-input
            v-model="email"
            label="Email Address"
            outlined
            type="email"
            lazy-rules
            :rules="[
              val => !!val || 'Email is required',
              val => val.includes('@') || 'Enter a valid email'
            ]"
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <!-- PASSWORD -->
          <q-input
            v-model="password"
            label="Password"
            outlined
            :type="showPassword ? 'text' : 'password'"
            lazy-rules
            :rules="[
              val => !!val || 'Password is required',
              val => val.length >= 6 || 'Min 6 characters'
            ]"
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>

            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <div class="row items-center justify-between q-mb-md">
            <q-checkbox v-model="rememberMe" label="Remember me" />
            <q-btn flat label="Forgot Password?" color="primary" />
          </div>

          <q-btn
            label="Login"
            type="submit"
            color="primary"
            class="full-width"
            size="lg"
            :loading="loading"
          />
        </q-form>

        <div class="text-center q-mt-md">
          Don't have an account?
          <q-btn flat label="Register Now" color="positive" to="/auth/register" />
        </div>
      </q-card-section>

      <!-- Demo Account Info -->
      <q-separator class="q-mt-md" />

      <q-card-section>
        <div class="text-caption text-grey-7">
          <b>Demo Login Accounts:</b><br />
          superadmin@gmail.com / 123456 <br />
          admin@gmail.com / 123456 <br />
          manager@gmail.com / 123456 <br />
          waiter@gmail.com / 123456 <br />
          kitchen@gmail.com / 123456
        </div>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();

const email = ref("");
const password = ref("");

const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);

// Default Demo Users
const demoUsers = [
  { email: "superadmin@gmail.com", password: "123456", role: "superadmin", name: "Super Admin" },
  { email: "admin@gmail.com", password: "123456", role: "admin", name: "Restaurant Admin" },
  { email: "manager@gmail.com", password: "123456", role: "manager", name: "Manager" },
  { email: "waiter@gmail.com", password: "123456", role: "waiter", name: "Waiter" },
  { email: "kitchen@gmail.com", password: "123456", role: "kitchen", name: "Kitchen Staff" },
];

const handleLogin = () => {
  loading.value = true;

  setTimeout(() => {
    // Load Registered Users
    const registeredUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]"
    );

    // Merge demo users + registered users
    const allUsers = [...demoUsers, ...registeredUsers];

    // Find user
    const user = allUsers.find(
      (u) => u.email === email.value && u.password === password.value
    );

    if (!user) {
      loading.value = false;
      $q.notify({
        type: "negative",
        message: "Invalid email or password!",
        position: "top",
      });
      return;
    }

    // Save token + user info
    localStorage.setItem("token", "demo-token-123456");
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: user.name || "User",
        email: user.email,
        role: user.role,
      })
    );

    loading.value = false;

    $q.notify({
      type: "positive",
      message: "Login Successful!",
      position: "top",
    });

    // Redirect based on role
    if (user.role === "superadmin") {
      router.push("/superadmin/dashboard");
    } else if (user.role === "waiter") {
      router.push("/waiter/place-order");
    } else if (user.role === "kitchen") {
      router.push("/kitchen/display");
    } else {
      router.push("/dashboard");
    }
  }, 800);
};
</script>
