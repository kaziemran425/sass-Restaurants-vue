<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <!-- কন্টেন্টকে একদম মাঝখানে আনার জন্য Flexbox ব্যবহার করা হয়েছে -->
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="auth-card q-pa-lg shadow-24">
          <q-card-section class="text-center">
            <img
              src="~assets/quasar-logo-vertical.svg"
              style="width: 100px; height: 100px"
            />
            <div class="text-h5 q-mt-md text-weight-bold text-primary">
              SBD Express
            </div>
            <div class="text-caption text-grey-7">
              Manage your restaurant efficiently
            </div>
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <!-- এখানে LoginPage বা RegisterPage লোড হবে -->
            <router-view />
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 400px;
  border-radius: 15px;
}
</style>
