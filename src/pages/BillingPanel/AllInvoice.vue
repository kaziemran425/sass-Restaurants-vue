<template>
  <q-page padding>
    <q-card flat bordered style="border-radius: 12px;">
      <q-card-section class="row items-center justify-between bg-grey-1">
        <div class="text-h5 text-weight-bold">
          <q-icon name="receipt_long" class="q-mr-sm text-primary" /> Invoices History
        </div>
        <q-input dense outlined bg-color="white" v-model="filter" placeholder="Search Invoice..." style="width: 250px">
          <template v-slot:append><q-icon name="search" /></template>
        </q-input>
      </q-card-section>

      <q-table
        :rows="invoices"
        :columns="columns"
        row-key="id"
        flat
        :filter="filter"
        :loading="isLoading"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'Paid' ? 'green' : 'orange'" rounded class="q-px-sm q-py-xs">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round icon="print" color="primary" size="sm" @click="printInvoice(props.row.id)" />
            <q-btn flat round icon="visibility" color="grey-8" size="sm" />
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey q-pa-md">
            <span>No invoices found. Try creating an order from POS.</span>
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
      { name: 'total', label: 'Total Amount', field: 'total', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
    ]

    const loadInvoices = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400)) // Fake API delay

      const saved = localStorage.getItem('saas_invoices')
      if (saved) {
        invoices.value = JSON.parse(saved)
      } else {
        // Fallback Dummy
        invoices.value = [
          { id: 'INV-1001', date: '2026-05-13', total: '৳ 1,250', status: 'Paid' },
          { id: 'INV-1002', date: '2026-05-13', total: '৳ 450', status: 'Paid' }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadInvoices())

    const printInvoice = (id) => {
      $q.notify({ message: `Printing Invoice ${id}...`, color: 'info', icon: 'print' })
    }

    return { filter, columns, invoices, isLoading, printInvoice }
  }
}
</script>
