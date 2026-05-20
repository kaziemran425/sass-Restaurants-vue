<template>
  <!-- Added a subtle background color to the page to make the card pop -->
  <q-page class="flex flex-center bg-grey-1">
    <!-- Increased rounding, added a nice shadow, and slightly adjusted width -->
    <q-card class="q-pa-sm shadow-4" style="width: 400px; border-radius: 16px">
      <!-- New Header with an Avatar Icon -->
      <q-card-section class="text-center q-pb-none">
        <q-avatar
          size="64px"
          color="primary-light"
          text-color="primary"
          class="q-mb-md bg-blue-1"
        >
          <q-icon name="person" size="32px" />
        </q-avatar>
        <div class="text-h5 text-bold text-teal-13">Welcome Back</div>
        <div class="text-subtitle2 text-grey-6 q-mt-xs">
          Please enter your details to sign in
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-y-md">
          <!-- Added icons to inputs for better UX -->
          <q-input
            v-model="email"
            label="Email Address"
            outlined
            color="primary"
          >
            <template v-slot:prepend>
              <q-icon name="email" class="text-grey-6" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            label="Password"
            type="password"
            outlined
            color="primary"
          >
            <template v-slot:prepend>
              <q-icon name="lock" class="text-grey-6" />
            </template>
          </q-input>
        </div>

        <!-- Improved alignment for the remember me & forgot password row -->
        <div class="row items-center justify-between q-mt-sm">
          <q-checkbox
            v-model="rememberMe"
            label="Remember me"
            color="teal-13"
            size="sm"
          />
          <q-btn
            flat
            no-caps
            dense
            label="Forgot Password?"
            color="teal-13"
            to="/auth/forgot-password"
            size="sm"
          />
        </div>
      </q-card-section>

      <!-- Upgraded Actions: Full width button looks better on login cards -->
      <q-card-section class="q-pt-none">
        <q-btn
          label="Login"
          color="teal-13"
          size="16px"
          class="full-width q-mb-md text-bold"
          unelevated
          style="border-radius: 8px"
          @click="handleLogin"
        />

        <div class="text-center q-mt-sm">
          <span class="text-grey-7">Don't have an account?</span>
          <q-btn
            flat
            no-caps
            dense
            label="Register"
            color="primary"
            to="/auth/register"
            class="q-ml-xs text-bold"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "src/composables/useAuth";

const router = useRouter();
const { login } = useAuth();

const email = ref("");
const password = ref("");
const rememberMe = ref(false); // Make sure this is in your script if it wasn't already!

const handleLogin = () => {
  const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));

  // Demo fallback
  if (!registeredUser) {
    alert("No user registered. Please register first!");
    router.push("/auth/register");
    return;
  }

  if (
    email.value !== registeredUser.email ||
    password.value !== registeredUser.password
  ) {
    alert("Invalid email or password!");
    return;
  }

  // login success
  login(
    {
      id: registeredUser.id,
      name: registeredUser.name,
      email: registeredUser.email,
      role: registeredUser.role,
    },
    "demo_token_" + Date.now(),
  );

  // role wise redirect
  if (registeredUser.role === "superadmin") {
    router.push("/superadmin/dashboard");
  } else if (registeredUser.role === "kitchen") {
    router.push("/kitchen/display");
  } else if (registeredUser.role === "waiter") {
    router.push("/waiter/place-order");
  } else {
    router.push("/admin/dashboard");
  }
};
</script>
