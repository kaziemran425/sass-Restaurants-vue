<template>
  <q-page padding>
    <div class="text-h5 q-mb-md text-weight-bold text-green-9">
      <q-icon name="trending_up" class="q-mr-sm" /> Income & Profit Report
    </div>

    <!-- Summary Cards -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-sm-4">
        <q-card class="bg-green-9 text-white shadow-5">
          <q-card-section>
            <div class="text-subtitle2">Total Income (Gross)</div>
            <div class="text-h4">৳ 1,25,000</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card class="bg-red-8 text-white shadow-5">
          <q-card-section>
            <div class="text-subtitle2">Total Expenses</div>
            <div class="text-h4">৳ 45,200</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card class="bg-indigo-9 text-white shadow-5">
          <q-card-section>
            <div class="text-subtitle2">Net Profit</div>
            <div class="text-h4">৳ 79,800</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Details Table -->
    <q-card flat bordered>
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">Monthly Breakdown</div>
        <q-btn-dropdown outline color="primary" label="Export Report">
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section avatar><q-icon name="picture_as_pdf" color="red" /></q-item-section>
              <q-item-section>Download PDF</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section avatar><q-icon name="description" color="green" /></q-item-section>
              <q-item-section>Export CSV</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-section>

      <q-table
        :rows="incomeHistory"
        :columns="incomeCols"
        flat
        hide-bottom
      >
        <template v-slot:body-cell-profit="props">
          <q-td :props="props" class="text-weight-bold text-green">
            ৳ {{ props.value }}
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const incomeCols = [
      { name: 'month', label: 'Month/Date', field: 'month', align: 'left' },
      { name: 'sales', label: 'Sales Income', field: 'sales', align: 'right' },
      { name: 'expense', label: 'Total Expense', field: 'expense', align: 'right' },
      { name: 'profit', label: 'Net Profit', field: 'profit', align: 'right' }
    ]

    const incomeHistory = ref([
      { month: 'May 2026 (To date)', sales: '1,25,000', expense: '45,200', profit: '79,800' },
      { month: 'April 2026', sales: '3,10,000', expense: '1,20,000', profit: '1,90,000' },
      { month: 'March 2026', sales: '2,85,000', expense: '1,15,000', profit: '1,70,000' }
    ])

    return { incomeCols, incomeHistory }
  }
}
</script>
