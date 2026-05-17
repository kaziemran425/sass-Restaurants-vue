<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card style="width: 450px; max-width: 90vw" class="q-pa-md shadow-10">

      <q-card-section class="text-center bg-primary text-white">
        <div class="text-h6">Restaurant SaaS</div>
        <div class="text-subtitle2">Create your restaurant account</div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form @submit.prevent="handleRegister">

          <!-- FULL NAME -->
          <q-input
            v-model="name"
            label="Full Name"
            outlined
            lazy-rules
            :rules="[val => !!val || 'Name is required']"
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

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

          <!-- ROLE -->
          <q-select
            v-model="role"
            label="Select Role"
            outlined
            :options="roleOptions"
            lazy-rules
            :rules="[val => !!val || 'Role is required']"
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="verified_user" />
            </template>
          </q-select>

          <q-btn
            label="Register"
            type="submit"
            color="positive"
            class="full-width"
            size="lg"
            :loading="loading"
          />
        </q-form>

        <div class="text-center q-mt-md">
          Already have an account?
          <q-btn flat label="Login Now" color="primary" to="/auth/login" />
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

const name = ref("");
const email = ref("");
const password = ref("");
const role = ref(null);

const loading = ref(false);
const showPassword = ref(false);

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Waiter", value: "waiter" },
  { label: "Kitchen", value: "kitchen" },
];

const handleRegister = () => {
  loading.value = true;

  setTimeout(() => {
    // Load old users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");

    // Check duplicate email
    const alreadyExists = storedUsers.find((u) => u.email === email.value);

    if (alreadyExists) {
      loading.value = false;
      $q.notify({
        type: "negative",
        message: "This email is already registered!",
        position: "top",
      });
      return;
    }

    // New user object
    const newUser = {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value.value,
    };

    storedUsers.push(newUser);

    // Save to localStorage
    localStorage.setItem("registeredUsers", JSON.stringify(storedUsers));

    loading.value = false;

    $q.notify({
      type: "positive",
      message: "Registration Successful! Now Login.",
      position: "top",
    });

    router.push("/auth/login");
  }, 800);
};
</script>
