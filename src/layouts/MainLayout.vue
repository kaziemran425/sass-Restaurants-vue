<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-dark text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>Main Panel</q-toolbar-title>

        <q-space />

        <q-btn
          v-if="isLoggedIn"
          flat
          icon="logout"
          label="Logout"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>

        <q-item-label header>Quick Menu</q-item-label>

        <q-item clickable v-ripple to="/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/waiter/place-order">
          <q-item-section avatar>
            <q-icon name="restaurant" />
          </q-item-section>
          <q-item-section>Waiter Panel</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/kitchen/display">
          <q-item-section avatar>
            <q-icon name="local_fire_department" />
          </q-item-section>
          <q-item-section>Kitchen Panel</q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple to="/menu">
          <q-item-section avatar>
            <q-icon name="qr_code" />
          </q-item-section>
          <q-item-section>QR Menu</q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const isLoggedIn = computed(() => {
  return !!localStorage.getItem("token");
});

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  router.push("/auth/login");
};
</script>
