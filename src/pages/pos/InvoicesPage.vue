<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">
        <q-icon name="receipt" class="q-mr-sm text-primary" /> Invoice History
      </div>
      <div class="row q-gutter-sm">
        <q-input outlined dense v-model="filter" placeholder="Search Invoice..." bg-color="white" style="width: 250px">
          <template v-slot:append><q-icon name="search" /></template>
        </q-input>
        <q-btn icon="refresh" color="primary" flat round @click="loadInvoices" :loading="isLoading" />
        <q-btn icon="download" color="primary" outline label="Export" />
      </div>
    </div>

    <q-card flat bordered style="border-radius: 12px;">
      <q-table
        :rows="invoices"
        :columns="columns"
        row-key="id"
        flat
        :filter="filter"
        :loading="isLoading"
        :pagination="{ rowsPerPage: 15 }"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'Paid' ? 'green' : 'red'" class="q-px-sm q-py-xs">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round dense color="primary" icon="visibility" size="sm" class="q-mr-xs" />
            <q-btn flat round dense color="secondary" icon="print" size="sm" @click="printInvoice(props.row.id)" />
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey q-pa-md">
            <q-icon size="2em" name="receipt_long" class="q-mr-sm" />
            <span>No invoices found. Process an order in POS first.</span>
          </div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const filter = ref('')
    const isLoading = ref(false)
    const invoices = ref([])

    const columns = [
      { name: 'id', label: 'Invoice #', field: 'id', align: 'left', sortable: true },
      { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
      { name: 'customer', label: 'Customer', field: 'customer', align: 'left' },
      { name: 'total', label: 'Total', field: 'total', align: 'right', sortable: true },
      { name: 'status', label: 'Status', field: 'status', align: 'center' },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
    ]

    const loadInvoices = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400))
      const saved = localStorage.getItem('saas_invoices')
      if (saved) {
        invoices.value = JSON.parse(saved)
      } else {
        invoices.value = [
          { id: 'INV-5001', date: '2026-05-14', customer: 'Walk-in', total: '৳ 1,250', status: 'Paid' },
          { id: 'INV-5002', date: '2026-05-14', customer: 'Kazi Emran', total: '৳ 450', status: 'Paid' }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadInvoices())

    const printInvoice = (id) => {
      $q.notify({ color: 'info', message: `Printing Invoice ${id}...`, icon: 'print' })
    }

    return { filter, columns, invoices, isLoading, loadInvoices, printInvoice }
  }
}
</script>
