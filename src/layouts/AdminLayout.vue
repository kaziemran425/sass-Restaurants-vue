<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title>Restaurant Admin</q-toolbar-title>
        <q-btn flat round icon="point_of_sale" to="/pos" class="q-mr-sm">
          <q-tooltip>Open POS</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above bordered class="bg-grey-1">
      <q-list padding>
        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar><q-icon name="analytics" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-expansion-item icon="people" label="HR Management">
          <q-item clickable to="/hrm/employees" class="q-ml-md">
            <q-item-section>Employees</q-item-section>
          </q-item>
          <q-item clickable to="/hrm/attendance" class="q-ml-md">
            <q-item-section>Attendance</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item icon="inventory" label="Inventory">
          <q-item clickable to="/inventory/stock-in" class="q-ml-md">
            <q-item-section>Stock In</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item icon="account_balance_wallet" label="Accounting">
          <q-item clickable to="/accounting/income" class="q-ml-md">
            <q-item-section>Income Report</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item clickable v-ripple to="/settings/restaurant">
          <q-item-section avatar><q-icon name="settings" /></q-item-section>
          <q-item-section>Settings</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
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
