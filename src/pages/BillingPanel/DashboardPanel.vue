<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold text-dark">
        <q-icon name="dashboard" class="q-mr-sm text-primary" /> Billing Dashboard
      </div>
      <q-btn
        outline
        color="primary"
        icon="refresh"
        label="Refresh Data"
        @click="loadData"
        :loading="isLoading"
        class="bg-white"
      />
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4">
        <q-card class="bg-blue-9 text-white shadow-2 summary-card" style="border-radius: 12px;">
          <q-card-section class="row items-center justify-between q-pa-lg">
            <div>
              <div class="text-subtitle1 text-blue-2 text-weight-medium">Today's Sales</div>
              <div class="text-h4 text-weight-bolder q-mt-sm">৳ {{ formatMoney(todaySales) }}</div>
            </div>
            <q-icon name="account_balance_wallet" size="4em" color="blue-5" class="opacity-80" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card class="bg-green-9 text-white shadow-2 summary-card" style="border-radius: 12px;">
          <q-card-section class="row items-center justify-between q-pa-lg">
            <div>
              <div class="text-subtitle1 text-green-2 text-weight-medium">Completed (Today)</div>
              <div class="text-h4 text-weight-bolder q-mt-sm">{{ completedOrders }}</div>
            </div>
            <q-icon name="check_circle" size="4em" color="green-5" class="opacity-80" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card class="bg-orange-9 text-white shadow-2 summary-card" style="border-radius: 12px;">
          <q-card-section class="row items-center justify-between q-pa-lg">
            <div>
              <div class="text-subtitle1 text-orange-2 text-weight-medium">Pending Orders</div>
              <div class="text-h4 text-weight-bolder q-mt-sm">{{ pendingOrders }}</div>
            </div>
            <q-icon name="hourglass_empty" size="4em" color="orange-5" class="opacity-80" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered style="border-radius: 12px;" class="bg-white">
      <q-card-section class="row items-center justify-between border-bottom q-pb-sm">
        <div class="text-h6 text-weight-bold text-dark">
          <q-icon name="history" class="q-mr-sm" /> Recent Transactions
        </div>
        <q-btn flat color="primary" label="View All" to="/superadmin/invoices" />
      </q-card-section>

      <q-table
        :rows="recentInvoices"
        :columns="columns"
        row-key="id"
        flat
        hide-pagination
        :loading="isLoading"
        class="text-grey-9"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'Paid' ? 'green-6' : 'orange-8'" class="q-px-sm q-py-xs text-weight-bold">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center flex-col text-grey-6 q-pa-xl column">
            <q-icon size="3em" name="receipt_long" class="q-mb-md opacity-50" />
            <div class="text-h6">No recent transactions</div>
          </div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    // --- State ---
    const isLoading = ref(false)
    const todaySales = ref(0)
    const completedOrders = ref(0)
    const pendingOrders = ref(0)
    const recentInvoices = ref([])

    // --- Table Configuration ---
    const columns = [
      { name: 'id', label: 'Invoice #', field: 'id', align: 'left', sortable: true },
      { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
      { name: 'customer', label: 'Customer', field: 'customer', align: 'left' },
      { name: 'total', label: 'Total Amount', field: 'total', align: 'right' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' }
    ]

    // --- Helper Methods ---
    const formatMoney = (val) => Number(val || 0).toLocaleString('en-IN')

    // --- Core Logic ---
    const loadData = async () => {
      isLoading.value = true
      // Simulated API delay
      await new Promise(res => setTimeout(res, 500))

      const todayStr = new Date().toISOString().split('T')[0]

      // 1. Load or Seed Invoices
      let invoices = JSON.parse(localStorage.getItem('saas_invoices'))
      if (!invoices) {
        invoices = [
          { id: 'INV-1001', date: todayStr, customer: 'Walk-in', totalRaw: 1250, total: '৳ 1,250', status: 'Paid' },
          { id: 'INV-1002', date: todayStr, customer: 'Kazi Emran', totalRaw: 450, total: '৳ 450', status: 'Paid' }
        ]
        localStorage.setItem('saas_invoices', JSON.stringify(invoices))
      }

      // 2. Load or Seed Live Orders
      let liveOrders = JSON.parse(localStorage.getItem('saas_live_orders'))
      if (!liveOrders) {
        liveOrders = [
          { id: 'ORD-1001', table: 'T-01', status: 'Pending', time: '5' },
          { id: 'ORD-1002', table: 'T-04', status: 'Cooking', time: '12' }
        ]
        localStorage.setItem('saas_live_orders', JSON.stringify(liveOrders))
      }

      // 3. Calculate Metrics
      // Filter invoices to only count TODAY'S sales
      const todaysInvoices = invoices.filter(inv => inv.date === todayStr)

      todaySales.value = todaysInvoices.reduce((sum, inv) => sum + Number(inv.totalRaw || 0), 0)
      completedOrders.value = todaysInvoices.length

      pendingOrders.value = liveOrders.length

      // Populate recent transactions table (grab top 5)
      recentInvoices.value = invoices.slice(0, 5)

      isLoading.value = false
    }

    onMounted(() => {
      loadData()
    })

    // --- Explicit Return ---
    return {
      isLoading,
      todaySales,
      completedOrders,
      pendingOrders,
      recentInvoices,
      columns,
      formatMoney,
      loadData
    }
  }
}
</script>

<style scoped>
/* Card Styling & Hover Effects */
.summary-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important;
}
.opacity-80 {
  opacity: 0.8;
}
.opacity-50 {
  opacity: 0.5;
}
.border-bottom {
  border-bottom: 1px solid #eee;
}
</style>
