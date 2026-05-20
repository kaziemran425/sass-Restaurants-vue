<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated class="bg-purple text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>SaaS Super Admin</q-toolbar-title>

        <q-space />

        <q-btn flat icon="logout" label="Logout" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Super Admin Menu</q-item-label>

        <q-item clickable v-ripple to="/superadmin/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/superadmin/restaurants">
          <q-item-section avatar>
            <q-icon name="store" />
          </q-item-section>
          <q-item-section>Restaurants</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/superadmin/plans">
          <q-item-section avatar>
            <q-icon name="payments" />
          </q-item-section>
          <q-item-section>Subscription Plans</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- PAGE -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "src/composables/useAuth";

const router = useRouter();
const { logout } = useAuth();

const leftDrawerOpen = ref(true);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

// ✅ fixed logout
const handleLogout = () => {
  logout();
  router.replace("/auth/login");
};
</script>
