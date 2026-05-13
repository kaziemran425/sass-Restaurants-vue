<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">Invoices / Billing History</div>
      <q-input dense filled v-model="filter" placeholder="Search Invoice...">
        <template v-slot:append><q-icon name="search" /></template>
      </q-input>
    </div>

    <q-table :rows="invoices" :columns="columns" row-key="id" flat bordered>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round icon="print" color="primary" size="sm" />
          <q-btn flat round icon="visibility" color="grey" size="sm" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const filter = ref('')
    const columns = [
      { name: 'id', label: 'Inv #', field: 'id', align: 'left' },
      { name: 'date', label: 'Date', field: 'date' },
      { name: 'total', label: 'Total Amount', field: 'total' },
      { name: 'status', label: 'Status', field: 'status' },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
    ]
    const invoices = ref([
      { id: 'INV-1001', date: '2026-05-13', total: '৳ 1,250', status: 'Paid' },
      { id: 'INV-1002', date: '2026-05-13', total: '৳ 450', status: 'Paid' }
    ])

    return { filter, columns, invoices }
  }
}
</script>
