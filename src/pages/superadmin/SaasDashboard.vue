<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg text-weight-bold text-indigo-10">SaaS Master Overview</div>

    <div class="row q-col-gutter-md">
      <!-- Stats Cards -->
      <div class="col-12 col-sm-3" v-for="stat in stats" :key="stat.label">
        <q-card class="bg-white text-indigo-10 shadow-2">
          <q-card-section>
            <div class="text-subtitle2">{{ stat.label }}</div>
            <div class="text-h4 text-weight-bolder">{{ stat.value }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Recent Registrations -->
    <q-card flat bordered class="q-mt-lg shadow-1">
      <q-card-section class="bg-indigo-1">
        <div class="text-h6">New Restaurant Registrations</div>
      </q-card-section>
      <q-table
        :rows="recentRestaurants"
        :columns="columns"
        flat
        hide-bottom
      />
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const stats = ref([
      { label: 'Total Restaurants', value: '124' },
      { label: 'Active Subscriptions', value: '98' },
      { label: 'Monthly Revenue', value: '৳ 2.5L' },
      { label: 'Pending Approvals', value: '07' }
    ])

    const columns = [
      { name: 'name', label: 'Restaurant Name', field: 'name', align: 'left' },
      { name: 'owner', label: 'Owner', field: 'owner' },
      { name: 'plan', label: 'Selected Plan', field: 'plan' },
      { name: 'status', label: 'Status', field: 'status' }
    ]

    const recentRestaurants = ref([
      { name: 'Kacchi Dine', owner: 'Rahim Ali', plan: 'Premium', status: 'Active' },
      { name: 'Pizza Burg', owner: 'Sultan Ahmed', plan: 'Standard', status: 'Pending' }
    ])

    return { stats, columns, recentRestaurants }
  }
}
</script>
