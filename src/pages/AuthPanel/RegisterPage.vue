<template>
  <!-- Added a subtle background color to make the white card pop -->
  <q-page class="flex flex-center bg-grey-1">
    <!-- Modern card with shadow, padding, and rounded corners -->
    <q-card class="q-pa-sm shadow-4" style="width: 400px; border-radius: 16px">
      <!-- New Header with an Avatar Icon -->
      <q-card-section class="text-center q-pb-none">
        <q-avatar
          size="64px"
          color="teal-1"
          text-color="primary"
          class="q-mb-md bg-blue-1"
        >
          <q-icon name="person_add" size="32px" />
        </q-avatar>
        <div class="text-h5 text-bold text-teal-13">Create Account</div>
        <div class="text-subtitle2 text-grey-6 q-mt-xs">
          Please fill in the details below
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-y-md">
          <!-- Inputs upgraded with outlines and prepend icons -->
          <q-input v-model="name" label="Full Name" outlined color="primary">
            <template v-slot:prepend>
              <q-icon name="badge" class="text-grey-6" />
            </template>
          </q-input>

          <q-input v-model="email" label="Email" outlined color="primary">
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

          <q-select
            v-model="role"
            :options="roles"
            label="Select Role"
            outlined
            color="primary"
          >
            <template v-slot:prepend>
              <q-icon name="work" class="text-grey-6" />
            </template>
          </q-select>
        </div>
      </q-card-section>

      <!-- Upgraded Actions: Full width primary button with a centered login link -->
      <q-card-section class="q-pt-none">
        <q-btn
          label="Register"
          color="teal-13"
          size="16px"
          class="full-width q-mb-md text-bold"
          unelevated
          style="border-radius: 8px"
          @click="handleRegister"
        />

        <div class="text-center q-mt-sm">
          <span class="text-grey-7">Already have an account?</span>
          <q-btn
            flat
            no-caps
            dense
            label="Login"
            color="primary"
            to="/auth/login"
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
const { register } = useAuth();

const name = ref("");
const email = ref("");
const password = ref("");
const role = ref("waiter");

const roles = ["admin", "manager", "waiter", "kitchen", "superadmin"];

const handleRegister = () => {
  if (!name.value || !email.value || !password.value) {
    alert("All fields are required!");
    return;
  }

  const userData = {
    id: Date.now(),
    name: name.value,
    email: email.value,
    password: password.value,
    role: role.value,
  };

  register(userData);

  alert("Registration Successful! Now login.");
  router.push("/auth/login");
};
</script>
