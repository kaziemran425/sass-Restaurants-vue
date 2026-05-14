<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">Invoice History</div>
      <div class="row q-gutter-sm">
        <q-input outlined dense v-model="filter" placeholder="Search Invoice...">
          <template v-slot:append><q-icon name="search" /></template>
        </q-input>
        <q-btn icon="download" color="primary" flat label="Export" />
      </div>
    </div>

    <q-table
      :rows="invoices"
      :columns="columns"
      row-key="id"
      flat
      bordered
      :filter="filter"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="props.value === 'Paid' ? 'green' : 'red'">
            {{ props.value }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-xs">
          <q-btn flat round dense color="primary" icon="visibility" size="sm" />
          <q-btn flat round dense color="secondary" icon="print" size="sm" />
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
      { name: 'id', label: 'Invoice #', field: 'id', align: 'left', sortable: true },
      { name: 'date', label: 'Date', field: 'date', align: 'left' },
      { name: 'customer', label: 'Customer', field: 'customer', align: 'left' },
      { name: 'total', label: 'Total', field: 'total', align: 'right' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' },
      { name: 'actions', label: 'Actions', align: 'right' }
    ]

    const invoices = ref([
      { id: 'INV-5001', date: '2026-05-14 12:30', customer: 'Walk-in', total: '৳ 1,250', status: 'Paid' },
      { id: 'INV-5002', date: '2026-05-14 01:15', customer: 'Kazi Emran', total: '৳ 450', status: 'Paid' }
    ])

    return { filter, columns, invoices }
  }
}
</script>
