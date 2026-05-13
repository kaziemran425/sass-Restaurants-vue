<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-indigo-10 text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title>Super Admin Portal (SaaS)</q-toolbar-title>
        <q-btn flat round icon="admin_panel_settings" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="250"
      :breakpoint="500"
      bordered
      class="bg-indigo-1"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item-label header class="text-indigo-10 text-weight-bold">Master Control</q-item-label>

          <q-item clickable v-ripple to="/superadmin/dashboard">
            <q-item-section avatar><q-icon name="analytics" /></q-item-section>
            <q-item-section>SaaS Overview</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/superadmin/restaurants">
            <q-item-section avatar><q-icon name="storefront" /></q-item-section>
            <q-item-section>Restaurant List</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/superadmin/plans">
            <q-item-section avatar><q-icon name="card_membership" /></q-item-section>
            <q-item-section>Subscription Plans</q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-ripple class="text-red" to="/auth/login">
            <q-item-section avatar><q-icon name="logout" /></q-item-section>
            <q-item-section>Exit Portal</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
const drawer = ref(false)
</script>
