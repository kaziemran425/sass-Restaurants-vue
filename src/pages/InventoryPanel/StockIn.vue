<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-primary">
        <q-icon name="inventory_2" class="q-mr-sm" /> Stock Entry
      </div>
      <q-btn color="primary" icon="add_box" label="Add New Stock" @click="openDialog" />
    </div>

    <q-card flat bordered style="border-radius: 12px;">
      <q-table
        title="Recent Stock Inflow"
        :rows="stockEntries"
        :columns="columns"
        row-key="id"
        flat
        :loading="isLoading"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-totalCost="props">
          <q-td :props="props" class="text-weight-bold text-primary">
            ৳ {{ formatMoney(props.value) }}
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'Received' ? 'green' : 'orange'" class="q-px-sm q-py-xs">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteStock(props.row.id)" />
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey q-pa-md">
            <span>No stock entries found.</span>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Stock Input Dialog -->
    <q-dialog v-model="stockDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center justify-between">
          <div class="text-h6">Purchase Entry</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="handleStockEntry">
          <q-card-section class="q-gutter-sm q-pt-md">
            <q-select
              filled
              v-model="form.item"
              :options="itemOptions"
              label="Select Item *"
              :rules="[val => !!val || 'Item is required']"
            />
            <div class="row q-col-gutter-sm">
              <q-input
                filled
                v-model.number="form.qty"
                type="number"
                label="Quantity *"
                class="col-6"
                :rules="[val => val > 0 || 'Valid quantity required']"
              />
              <q-input
                filled
                v-model.number="form.cost"
                type="number"
                label="Unit Cost (৳) *"
                class="col-6"
                :rules="[val => val > 0 || 'Valid cost required']"
              />
            </div>

            <!-- Auto calculated total display -->
            <div class="text-right text-subtitle2 text-primary q-mb-sm">
              Estimated Total: ৳ {{ formatMoney(form.qty * form.cost) }}
            </div>

            <q-select
              filled
              v-model="form.supplier"
              :options="supplierOptions"
              label="Supplier *"
              :rules="[val => !!val || 'Supplier is required']"
            />
          </q-card-section>

          <q-card-actions align="right" class="q-pb-md q-pr-md bg-grey-1">
            <q-btn flat label="Cancel" color="grey" v-close-popup />
            <q-btn unelevated label="Confirm Entry" type="submit" color="primary" :loading="isSaving" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const isLoading = ref(false)
    const isSaving = ref(false)
    const stockDialog = ref(false)

    const getInitialForm = () => ({ item: '', qty: null, cost: null, supplier: '' })
    const form = reactive(getInitialForm())

    const columns = [
      { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
      { name: 'item', label: 'Item Name', field: 'item', align: 'left' },
      { name: 'qty', label: 'Quantity', field: 'qty', align: 'left' },
      { name: 'totalCost', label: 'Total Cost', field: 'totalCost', align: 'left', sortable: true },
      { name: 'status', label: 'Status', field: 'status', align: 'center' },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
    ]

    const stockEntries = ref([])

    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400)) // Fake API
      const saved = localStorage.getItem('saas_stock_entries')
      if (saved) {
        stockEntries.value = JSON.parse(saved)
      } else {
        stockEntries.value = [
          { id: 1, date: '2026-05-10', item: 'Chicken Breast', qty: '20 KG', totalCost: 9000, status: 'Received' },
          { id: 2, date: '2026-05-12', item: 'Basmati Rice', qty: '50 KG', totalCost: 6500, status: 'Pending' }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadData())

    watch(stockEntries, (newVal) => {
      localStorage.setItem('saas_stock_entries', JSON.stringify(newVal))
    }, { deep: true })

    const formatMoney = (val) => Number(val || 0).toLocaleString('en-IN')

    const openDialog = () => {
      Object.assign(form, getInitialForm())
      stockDialog.value = true
    }

    const handleStockEntry = async () => {
      isSaving.value = true
      await new Promise(res => setTimeout(res, 600)) // Fake API save

      const unitType = form.item.includes('Oil') ? 'Liters' : 'KG'

      stockEntries.value.unshift({
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        item: form.item,
        qty: `${form.qty} ${unitType}`,
        totalCost: (form.qty * form.cost),
        status: 'Received'
      })

      stockDialog.value = false
      isSaving.value = false
      $q.notify({ color: 'positive', message: 'Stock added successfully', icon: 'done_all' })
    }

    const deleteStock = (id) => {
      $q.dialog({ title: 'Confirm', message: 'Delete this record?', cancel: true }).onOk(() => {
        stockEntries.value = stockEntries.value.filter(s => s.id !== id)
        $q.notify({ color: 'negative', message: 'Record deleted', icon: 'delete' })
      })
    }

    return {
      stockDialog, form, columns, stockEntries, isLoading, isSaving, formatMoney,
      openDialog, handleStockEntry, deleteStock,
      itemOptions: ['Chicken Breast', 'Basmati Rice', 'Soybean Oil', 'Flour', 'Salt'],
      supplierOptions: ['City Group Ltd', 'Fresh Foods Ltd', 'Local Market']
    }
  }
}
</script>
