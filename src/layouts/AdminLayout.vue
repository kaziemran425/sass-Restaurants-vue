<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          SBD Express Admin
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label header>Main Menu</q-item-label>

        <!-- Dashboard -->
        <q-item clickable v-underline to="/" exact>
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <!-- HRM Group -->
        <q-expansion-item icon="people" label="HR Management">
          <q-item clickable to="/hrm/employees" class="q-ml-md">
            <q-item-section>Employee List</q-item-section>
          </q-item>
          <q-item clickable to="/hrm/attendance" class="q-ml-md">
            <q-item-section>Attendance</q-item-section>
          </q-item>
          <q-item clickable to="/hrm/payroll" class="q-ml-md">
            <q-item-section>Payroll</q-item-section>
          </q-item>
        </q-expansion-item>

        <!-- Inventory Group -->
        <q-expansion-item icon="inventory" label="Inventory">
          <q-item clickable to="/inventory/stock-in" class="q-ml-md">
            <q-item-section>Stock In</q-item-section>
          </q-item>
          <q-item clickable to="/inventory/reports" class="q-ml-md">
            <q-item-section>Reports</q-item-section>
          </q-item>
        </q-expansion-item>

        <!-- POS Direct Link -->
        <q-item clickable to="/pos" class="bg-orange-1 text-orange-9">
          <q-item-section avatar>
            <q-icon name="point_of_sale" />
          </q-item-section>
          <q-item-section>Open POS Panel</q-item-section>
        </q-item>

        <q-separator q-my-md />

        <!-- Settings -->
        <q-item clickable to="/settings/restaurant">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>Settings</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
