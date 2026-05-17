<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-primary">
        <q-icon name="dashboard" class="q-mr-sm" /> Billing Dashboard
      </div>
      <q-btn flat round icon="refresh" @click="loadData" :loading="isLoading" />
    </div>

    <div class="row q-col-gutter-md">
      <!-- Today's Sales -->
      <div class="col-12 col-sm-4">
        <q-card class="bg-blue-9 text-white shadow-3" style="border-radius: 12px;">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle2 text-blue-2">Today's Sales</div>
              <div class="text-h4 text-weight-bold">৳ {{ formatMoney(todaySales) }}</div>
            </div>
            <q-icon name="account_balance_wallet" size="3em" color="blue-5" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Orders Completed -->
      <div class="col-12 col-sm-4">
        <q-card class="bg-green-9 text-white shadow-3" style="border-radius: 12px;">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle2 text-green-2">Orders Completed</div>
              <div class="text-h4 text-weight-bold">{{ completedOrders }}</div>
            </div>
            <q-icon name="check_circle" size="3em" color="green-5" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Pending Orders -->
      <div class="col-12 col-sm-4">
        <q-card class="bg-orange-9 text-white shadow-3" style="border-radius: 12px;">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle2 text-orange-2">Pending Orders</div>
              <div class="text-h4 text-weight-bold">{{ pendingOrders }}</div>
            </div>
            <q-icon name="hourglass_empty" size="3em" color="orange-5" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const isLoading = ref(false)
    const todaySales = ref(0)
    const completedOrders = ref(0)
    const pendingOrders = ref(0)

    const formatMoney = (val) => Number(val).toLocaleString('en-IN')

    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 500)) // Fake API delay

      // Load Invoices
      const invoices = JSON.parse(localStorage.getItem('saas_invoices') || '[]')
      todaySales.value = invoices.reduce((sum, inv) => sum + Number(inv.totalRaw || 0), 0)
      completedOrders.value = invoices.length

      // Load Pending Orders
      const liveOrders = JSON.parse(localStorage.getItem('saas_live_orders') || '[]')
      pendingOrders.value = liveOrders.length || 5 // Default 5 if empty

      isLoading.value = false
    }

    onMounted(() => {
      loadData()
    })

    return { isLoading, todaySales, completedOrders, pendingOrders, formatMoney, loadData }
  }
}
</script>
