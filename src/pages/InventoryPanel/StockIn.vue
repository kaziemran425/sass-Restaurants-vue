<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">Stock Entry</div>
      <q-btn color="primary" icon="add_box" label="Add New Stock" @click="stockDialog = true" />
    </div>

    <q-card flat bordered>
      <q-table
        title="Recent Stock Inflow"
        :rows="stockEntries"
        :columns="columns"
        row-key="id"
        flat
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'Received' ? 'green' : 'orange'">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Stock Input Dialog -->
    <q-dialog v-model="stockDialog">
      <q-card style="min-width: 400px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Purchase Entry</div>
        </q-card-section>

        <q-card-section class="q-gutter-sm">
          <q-select filled v-model="form.item" :options="itemOptions" label="Select Item" />
          <q-input filled v-model.number="form.qty" type="number" label="Quantity" />
          <q-input filled v-model.number="form.cost" type="number" label="Unit Cost (৳)" />
          <q-select filled v-model="form.supplier" :options="supplierOptions" label="Supplier" />
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md q-pr-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn unelevated label="Confirm Entry" color="primary" @click="handleStockEntry" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const stockDialog = ref(false)
    const form = reactive({ item: '', qty: 0, cost: 0, supplier: '' })

    const columns = [
      { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
      { name: 'item', label: 'Item Name', field: 'item', align: 'left' },
      { name: 'qty', label: 'Quantity', field: 'qty' },
      { name: 'cost', label: 'Total Cost', field: 'totalCost' },
      { name: 'status', label: 'Status', field: 'status' }
    ]

    const stockEntries = ref([
      { id: 1, date: '2026-05-10', item: 'Chicken Breast', qty: '20 KG', totalCost: '৳ 9,000', status: 'Received' },
      { id: 2, date: '2026-05-12', item: 'Basmati Rice', qty: '50 KG', totalCost: '৳ 6,500', status: 'Pending' }
    ])

    const handleStockEntry = () => {
      stockEntries.value.unshift({
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        item: form.item,
        qty: form.qty + ' Unit',
        totalCost: '৳ ' + (form.qty * form.cost),
        status: 'Received'
      })
      stockDialog.value = false
      $q.notify({ color: 'positive', message: 'Stock added successfully', icon: 'done' })
    }

    return {
      stockDialog, form, columns, stockEntries, handleStockEntry,
      itemOptions: ['Chicken', 'Rice', 'Oil', 'Flour'],
      supplierOptions: ['City Group', 'Fresh Foods Ltd', 'Local Market']
    }
  }
}
</script>
