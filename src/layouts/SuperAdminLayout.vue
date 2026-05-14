<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-indigo-10 text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title>SaaS Master Control</q-toolbar-title>
        <q-btn flat round icon="account_circle" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above bordered class="bg-indigo-1">
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-indigo-10">Administration</q-item-label>
          <q-item clickable v-ripple to="/superadmin/dashboard">
            <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
            <q-item-section>Master Dashboard</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/superadmin/restaurants">
            <q-item-section avatar><q-icon name="storefront" /></q-item-section>
            <q-item-section>Restaurants</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/superadmin/plans">
            <q-item-section avatar><q-icon name="card_membership" /></q-item-section>
            <q-item-section>Pricing Plans</q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item clickable v-ripple to="/auth/login" class="text-red">
            <q-item-section avatar><q-icon name="logout" color="red" /></q-item-section>
            <q-item-section>Logout</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const drawer = ref(false)
    return { drawer }
  }
}
</script>
