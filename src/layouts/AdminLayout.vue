<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated class="bg-teal-14 text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Restaurant Admin Panel</q-toolbar-title>

        <q-space />

        <q-btn flat icon="logout" label="Logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Admin Menu</q-item-label>

        <q-item clickable v-ripple to="/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-expansion-item icon="point_of_sale" label="POS">
          <q-list class="q-pl-md">
            <q-item clickable v-ripple to="/pos">
              <q-item-section>Terminal</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/pos/orders">
              <q-item-section>Orders</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/pos/invoices">
              <q-item-section>Invoices</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-expansion-item icon="receipt_long" label="Billing">
          <q-list class="q-pl-md">
            <q-item clickable v-ripple to="/billing">
              <q-item-section>Billing Dashboard</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/billing/pos">
              <q-item-section>POS Home</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/billing/invoices">
              <q-item-section>All Invoice</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/billing/upcoming-orders">
              <q-item-section>Upcoming Orders</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-expansion-item icon="people" label="HRM">
          <q-list class="q-pl-md">
            <q-item clickable v-ripple to="/hrm/employees">
              <q-item-section>Employees</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/hrm/attendance">
              <q-item-section>Attendance</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/hrm/payroll">
              <q-item-section>Payroll</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/hrm/leaves">
              <q-item-section>Leave Requests</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/hrm/shifts">
              <q-item-section>Shift Schedule</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-expansion-item icon="inventory" label="Inventory">
          <q-list class="q-pl-md">
            <q-item clickable v-ripple to="/inventory/stock-in">
              <q-item-section>Stock In</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/inventory/reports">
              <q-item-section>Stock Report</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/inventory/suppliers">
              <q-item-section>Suppliers</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-expansion-item icon="account_balance" label="Accounting">
          <q-list class="q-pl-md">
            <q-item clickable v-ripple to="/accounting/income">
              <q-item-section>Income</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/accounting/expenses">
              <q-item-section>Expenses</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-expansion-item icon="settings" label="Settings">
          <q-list class="q-pl-md">
            <q-item clickable v-ripple to="/settings/restaurant">
              <q-item-section>Restaurant Settings</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/settings/users">
              <q-item-section>User Management</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
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

const router = useRouter();
const leftDrawerOpen = ref(true);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  router.push("/auth/login");
};
</script>
