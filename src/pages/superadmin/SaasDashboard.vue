<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold text-indigo-10">
        <q-icon name="dashboard_customize" class="q-mr-sm" /> SaaS Master Overview
      </div>
      <q-btn outline color="indigo" icon="refresh" label="Sync System" @click="loadDashboard" :loading="isLoading" />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-center q-pa-xl">
      <q-spinner-cube color="indigo" size="4em" />
    </div>

    <div v-else>
      <!-- Smart Stats Grid -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-6 col-md-3" v-for="stat in stats" :key="stat.label">
          <q-card :class="stat.color" class="text-white shadow-3" style="border-radius: 12px;">
            <q-card-section class="row items-center justify-between">
              <div>
                <div class="text-subtitle2" style="opacity: 0.9">{{ stat.label }}</div>
                <div class="text-h4 text-weight-bold q-my-sm">{{ stat.value }}</div>
              </div>
              <q-icon :name="stat.icon" size="3em" style="opacity: 0.4" />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Recent Registrations Table -->
      <q-card flat bordered style="border-radius: 12px;">
        <q-card-section class="bg-indigo-1">
          <div class="text-h6 text-indigo-10 text-weight-bold">Recent Tenant Registrations</div>
        </q-card-section>
        <q-table
          :rows="recentRestaurants"
          :columns="columns"
          row-key="id"
          flat
          hide-bottom
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.value === 'Active' ? 'positive' : 'warning'" class="q-px-sm">
                {{ props.value }}
              </q-badge>
            </q-td>
          </template>
          <template v-slot:body-cell-plan="props">
            <q-td :props="props" class="text-weight-bold text-indigo">
              {{ props.value }}
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const isLoading = ref(false)
    const restaurants = ref([])

    const columns = [
      { name: 'name', label: 'Restaurant Name', field: 'name', align: 'left' },
      { name: 'owner', label: 'Owner', field: 'owner', align: 'left' },
      { name: 'plan', label: 'Selected Plan', field: 'plan', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' }
    ]

    const formatMoney = (val) => Number(val).toLocaleString('en-IN')

    const loadDashboard = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 600)) // Fake API Delay

      const saved = localStorage.getItem('saas_restaurants')
      if (saved) {
        restaurants.value = JSON.parse(saved)
      } else {
        restaurants.value = [
          { id: 1, name: 'Sultans Dine', owner: 'Rahim Ali', plan: 'Enterprise', status: 'Active', fee: 5000 },
          { id: 2, name: 'Burger King Local', owner: 'Sultan Ahmed', plan: 'Professional', status: 'Pending', fee: 3000 },
          { id: 3, name: 'Kacchi Bhai', owner: 'Kamal Hossain', plan: 'Basic', status: 'Active', fee: 1000 }
        ]
        localStorage.setItem('saas_restaurants', JSON.stringify(restaurants.value))
      }
      isLoading.value = false
    }

    onMounted(() => loadDashboard())

    const stats = computed(() => {
      const total = restaurants.value.length
      const active = restaurants.value.filter(r => r.status === 'Active').length
      const pending = restaurants.value.filter(r => r.status === 'Pending').length
      // Calculate revenue based on active plans
      const revenue = restaurants.value.filter(r => r.status === 'Active').reduce((sum, r) => sum + (r.fee || 0), 0)

      return [
        { label: 'Total Restaurants', value: total, color: 'bg-indigo-7', icon: 'storefront' },
        { label: 'Active Subscriptions', value: active, color: 'bg-green-7', icon: 'verified' },
        { label: 'Monthly Revenue', value: `৳ ${formatMoney(revenue)}`, color: 'bg-blue-8', icon: 'payments' },
        { label: 'Pending Approvals', value: pending, color: 'bg-orange-8', icon: 'hourglass_empty' }
      ]
    })

    const recentRestaurants = computed(() => [...restaurants.value].reverse().slice(0, 5))

    return { isLoading, stats, columns, recentRestaurants, loadDashboard }
  }
}
</script>
