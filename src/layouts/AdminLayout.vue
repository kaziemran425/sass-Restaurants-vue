<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated class="bg-teal-14 text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Restaurant Admin Panel</q-toolbar-title>

        <q-space />

        <q-btn flat icon="logout" label="Logout" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Admin Menu</q-item-label>

        <!-- Dashboard -->
        <q-item clickable v-ripple to="/admin/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <!-- POS -->
        <q-expansion-item icon="point_of_sale" label="POS">
          <q-list class="q-pl-md">
            <q-item clickable v-ripple to="/admin/pos">
              <q-item-section>Terminal</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/pos/orders">
              <q-item-section>Orders</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/pos/invoices">
              <q-item-section>Invoices</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Billing -->
        <q-expansion-item icon="receipt_long" label="Billing">
          <q-list class="q-pl-md">
            <q-item clickable v-ripple to="/admin/billing">
              <q-item-section>Billing Dashboard</q-item-section>
            </q-item>

          

            <q-item clickable v-ripple to="/admin/billing/invoices">
              <q-item-section>All Invoice</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/billing/upcoming-orders">
              <q-item-section>Upcoming Orders</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- HRM -->
        <q-expansion-item icon="people" label="HRM">
          <q-list class="q-pl-md">
            <q-item clickable v-ripple to="/admin/hrm/employees">
              <q-item-section>Employees</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/hrm/attendance">
              <q-item-section>Attendance</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/hrm/payroll">
              <q-item-section>Payroll</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/hrm/leaves">
              <q-item-section>Leave Requests</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/hrm/shifts">
              <q-item-section>Shift Schedule</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Inventory -->
        <q-expansion-item icon="inventory" label="Inventory">
          <q-list class="q-pl-md">
            <q-item clickable v-ripple to="/admin/inventory/stock-in">
              <q-item-section>Stock In</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/inventory/reports">
              <q-item-section>Stock Report</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/inventory/suppliers">
              <q-item-section>Suppliers</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Accounting -->
        <q-expansion-item icon="account_balance" label="Accounting">
          <q-list class="q-pl-md">
            <q-item clickable v-ripple to="/admin/accounting/income">
              <q-item-section>Income</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/accounting/expenses">
              <q-item-section>Expenses</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Settings -->
        <q-expansion-item icon="settings" label="Settings">
          <q-list class="q-pl-md">
            <q-item clickable v-ripple to="/admin/settings/restaurant">
              <q-item-section>Restaurant Settings</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/admin/settings/users">
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
import { useAuth } from "src/composables/useAuth";

const router = useRouter();
const { logout } = useAuth();

const leftDrawerOpen = ref(true);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

// ✅ fixed logout function
const handleLogout = () => {
  logout();
  router.push("/auth/login");
};
</script>
