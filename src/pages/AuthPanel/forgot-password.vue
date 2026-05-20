<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card style="width: 380px; max-width: 90vw" class="q-pa-md">

      <q-card-section class="text-center">
        <div class="text-h6">Forgot Password</div>
        <div class="text-caption text-grey-7">
          Enter your email to reset your password
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="email"
          label="Email"
          type="email"
          outlined
          dense
          :disable="loading"
        />
      </q-card-section>

      <q-card-section v-if="successMessage" class="text-green text-center">
        {{ successMessage }}
      </q-card-section>

      <q-card-section v-if="errorMessage" class="text-red text-center">
        {{ errorMessage }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Send Reset Link"
          color="primary"
          :loading="loading"
          :disable="loading"
          @click="handleForgotPassword"
        />
      </q-card-actions>

      <q-separator class="q-my-md" />

      <q-card-actions align="center">
        <q-btn flat label="Back to Login" to="/auth/login" />
      </q-card-actions>

    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const loading = ref(false);

const successMessage = ref("");
const errorMessage = ref("");

const handleForgotPassword = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  if (!email.value) {
    errorMessage.value = "Email is required!";
    return;
  }

  if (!email.value.includes("@")) {
    errorMessage.value = "Please enter a valid email!";
    return;
  }

  loading.value = true;

  try {
    // Demo delay (simulate API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    successMessage.value =
      "Reset link sent successfully! Please check your email.";

    email.value = "";
  } catch (error) {
    errorMessage.value = "Something went wrong. Try again!";
  } finally {
    loading.value = false;
  }
};
</script>
