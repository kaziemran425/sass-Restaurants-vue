<template>
  <q-page padding>
    <div class="text-h5 q-mb-md text-weight-bold text-green-9">
      <q-icon name="trending_up" class="q-mr-sm" /> Income & Profit Report
    </div>

    <!-- Summary Cards (Dynamic Calculations) -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-sm-4">
        <q-card class="bg-green-9 text-white shadow-5" style="border-radius: 12px;">
          <q-card-section>
            <div class="text-subtitle2 text-green-2">Total Income (Gross)</div>
            <div class="text-h4 text-weight-bold">৳ {{ formatMoney(totalGross) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card class="bg-red-8 text-white shadow-5" style="border-radius: 12px;">
          <q-card-section>
            <div class="text-subtitle2 text-red-2">Total Expenses</div>
            <div class="text-h4 text-weight-bold">৳ {{ formatMoney(totalExpense) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card class="bg-indigo-9 text-white shadow-5" style="border-radius: 12px;">
          <q-card-section>
            <div class="text-subtitle2 text-indigo-2">Overall Net Profit</div>
            <div class="text-h4 text-weight-bold">৳ {{ formatMoney(netProfit) }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Details Table -->
    <q-card flat bordered style="border-radius: 12px;">
      <q-card-section class="row items-center justify-between bg-grey-1">
        <div class="text-h6 text-weight-bold">Monthly Breakdown</div>
        <q-btn-dropdown outline color="primary" label="Export Report" :loading="isExporting">
          <q-list>
            <q-item clickable v-close-popup @click="exportData('PDF')">
              <q-item-section avatar><q-icon name="picture_as_pdf" color="red" /></q-item-section>
              <q-item-section>Download PDF</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="exportData('CSV')">
              <q-item-section avatar><q-icon name="description" color="green" /></q-item-section>
              <q-item-section>Export CSV</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-section>

      <q-table
        :rows="incomeHistory"
        :columns="incomeCols"
        row-key="month"
        flat
        hide-bottom
        :pagination="{ rowsPerPage: 12 }"
      >
        <template v-slot:body-cell-sales="props">
          <q-td :props="props">৳ {{ formatMoney(props.value) }}</q-td>
        </template>
        <template v-slot:body-cell-expense="props">
          <q-td :props="props" class="text-red-8">৳ {{ formatMoney(props.value) }}</q-td>
        </template>
        <template v-slot:body-cell-profit="props">
          <q-td :props="props" class="text-weight-bold text-green-8">
            ৳ {{ formatMoney(props.row.sales - props.row.expense) }}
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const isExporting = ref(false)

    const incomeCols = [
      { name: 'month', label: 'Month/Date', field: 'month', align: 'left' },
      { name: 'sales', label: 'Sales Income (Gross)', field: 'sales', align: 'right' },
      { name: 'expense', label: 'Total Expense', field: 'expense', align: 'right' },
      { name: 'profit', label: 'Net Profit', field: 'profit', align: 'right' }
    ]

    const incomeHistory = ref([])

    // Load from Local Storage on Mount
    onMounted(() => {
      const savedIncome = localStorage.getItem('saas_income_history')
      if (savedIncome) {
        incomeHistory.value = JSON.parse(savedIncome)
      } else {
        // Fallback Default Data (Normally this comes from API)
        incomeHistory.value = [
          { month: 'May 2026', sales: 125000, expense: 45200 },
          { month: 'April 2026', sales: 310000, expense: 120000 },
          { month: 'March 2026', sales: 285000, expense: 115000 }
        ]
      }
    })

    // Watcher to save changes automatically
    watch(incomeHistory, (newVal) => {
      localStorage.setItem('saas_income_history', JSON.stringify(newVal))
    }, { deep: true })

    // Dynamic Calculations based on Table Data
    const totalGross = computed(() => incomeHistory.value.reduce((sum, item) => sum + item.sales, 0))
    const totalExpense = computed(() => incomeHistory.value.reduce((sum, item) => sum + item.expense, 0))
    const netProfit = computed(() => totalGross.value - totalExpense.value)

    // Number formatter for neat display (e.g. 1,25,000)
    const formatMoney = (val) => {
      return Number(val || 0).toLocaleString('en-IN')
    }

    // Dummy Export Function for Integration Ready logic
    const exportData = async (type) => {
      isExporting.value = true
      // Simulate network/generation delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      isExporting.value = false
      $q.notify({
        color: 'primary',
        message: `${type} Report generated and downloaded successfully!`,
        icon: 'download'
      })
    }

    return {
      incomeCols, incomeHistory,
      totalGross, totalExpense, netProfit,
      formatMoney, exportData, isExporting
    }
  }
}
</script>
