<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Payroll Manager</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4" v-for="item in stats" :key="item.label">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-subtitle2">{{ item.label }}</div>
            <div class="text-h4">{{ item.value }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-table :rows="payrollData" :columns="payColumns" class="q-mt-lg" flat bordered />
  </q-page>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const stats = ref([
      { label: 'Total Payroll', value: '৳ 80,000' },
      { label: 'Paid Employees', value: '12' },
      { label: 'Pending', value: '৳ 5,000' }
    ])
    const payColumns = [
      { name: 'name', label: 'Employee', field: 'name', align: 'left' },
      { name: 'basic', label: 'Basic Salary', field: 'basic' },
      { name: 'bonus', label: 'Bonus', field: 'bonus' },
      { name: 'net', label: 'Net Payable', field: 'net' }
    ]
    const payrollData = ref([
      { name: 'Kazi Emran', basic: 45000, bonus: 2000, net: 47000 }
    ])
    return { stats, payColumns, payrollData }
  }
}
</script>
