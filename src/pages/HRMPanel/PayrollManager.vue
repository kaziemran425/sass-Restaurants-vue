<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">Payroll Manager</div>
      <q-btn color="primary" icon="receipt_long" label="Generate Payroll" @click="generatePayroll" :loading="isGenerating" />
    </div>

    <!-- Smart Stats -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4" v-for="item in stats" :key="item.label">
        <q-card :class="item.color" class="text-white shadow-2" style="border-radius: 12px;">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle2" style="opacity: 0.8">{{ item.label }}</div>
              <div class="text-h4 text-weight-bold">{{ item.value }}</div>
            </div>
            <q-icon :name="item.icon" size="3em" style="opacity: 0.5" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Payroll Table -->
    <q-card flat bordered style="border-radius: 12px;">
      <q-table :rows="payrollData" :columns="payColumns" flat :loading="isLoading">
        <template v-slot:body-cell-net="props">
          <q-td :props="props" class="text-weight-bold text-primary">
            ৳ {{ formatMoney(props.row.basic + props.row.bonus) }}
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'Paid' ? 'green' : 'orange'">{{ props.value }}</q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn v-if="props.row.status !== 'Paid'" unelevated size="sm" color="green" label="Pay Now" @click="markAsPaid(props.row.id)" />
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
    const isLoading = ref(false)
    const isGenerating = ref(false)
    const payrollData = ref([])

    const payColumns = [
      { name: 'name', label: 'Employee', field: 'name', align: 'left' },
      { name: 'basic', label: 'Basic Salary (৳)', field: 'basic', align: 'right' },
      { name: 'bonus', label: 'Bonus (৳)', field: 'bonus', align: 'right' },
      { name: 'net', label: 'Net Payable', field: 'net', align: 'right' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
    ]

    const formatMoney = (val) => Number(val || 0).toLocaleString('en-IN')

    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400))
      const saved = localStorage.getItem('saas_payroll')
      if (saved) payrollData.value = JSON.parse(saved)
      else {
        payrollData.value = [
          { id: 1, name: 'Kazi Emran', basic: 45000, bonus: 2000, status: 'Pending' }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadData())
    watch(payrollData, (newVal) => localStorage.setItem('saas_payroll', JSON.stringify(newVal)), { deep: true })

    const stats = computed(() => {
      const total = payrollData.value.reduce((sum, p) => sum + (p.basic + p.bonus), 0)
      const paidEmps = payrollData.value.filter(p => p.status === 'Paid').length
      const pendingTotal = payrollData.value.filter(p => p.status !== 'Paid').reduce((sum, p) => sum + (p.basic + p.bonus), 0)

      return [
        { label: 'Total Payroll', value: `৳ ${formatMoney(total)}`, color: 'bg-primary', icon: 'account_balance' },
        { label: 'Paid Employees', value: paidEmps, color: 'bg-green-7', icon: 'people' },
        { label: 'Pending Payment', value: `৳ ${formatMoney(pendingTotal)}`, color: 'bg-orange-8', icon: 'pending_actions' }
      ]
    })

    const generatePayroll = async () => {
      isGenerating.value = true
      await new Promise(res => setTimeout(res, 800))
      // Logic: Fetch from 'saas_employees' and generate list
      const emps = JSON.parse(localStorage.getItem('saas_employees') || '[]')
      if (emps.length > 0) {
        payrollData.value = emps.map(e => ({
          id: e.id, name: e.name, basic: e.salary, bonus: 0, status: 'Pending'
        }))
        $q.notify({ color: 'positive', message: 'Payroll generated for this month.', icon: 'sync' })
      } else {
        $q.notify({ color: 'warning', message: 'No employees found in system.', icon: 'warning' })
      }
      isGenerating.value = false
    }

    const markAsPaid = (id) => {
      const index = payrollData.value.findIndex(p => p.id === id)
      if (index !== -1) {
        payrollData.value[index].status = 'Paid'
        $q.notify({ color: 'positive', message: 'Payment marked as Paid.', icon: 'done_all' })
      }
    }

    return { payrollData, payColumns, stats, isLoading, isGenerating, formatMoney, generatePayroll, markAsPaid }
  }
}
</script>
