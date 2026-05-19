<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-red-13 text-weight-bold text-primary">
        <q-icon name="inventory_2" class="q-mr-sm" /> Stock Entry (Inflow)
      </div>
      <div class="row q-gutter-sm items-center">
        <q-input
          outlined
          dense
          v-model="filter"
          placeholder="Search items..."
          bg-color="white"
          style="width: 250px"
          clearable
        >
          <template v-slot:append><q-icon name="search" /></template>
        </q-input>
        <q-btn color="teal-13" icon="add_box" label="New Entry" @click="openDialog" />
      </div>
    </div>

    <q-card flat bordered style="border-radius: 12px;" class="bg-white">
      <q-table
        :rows="stockEntries"
        :columns="columns"
        row-key="id"
        flat
        :filter="filter"
        :loading="isLoading"
        :pagination="{ rowsPerPage: 10 }"
        class="text-grey-9"
      >
        <template v-slot:body-cell-item="props">
          <q-td :props="props" class="text-weight-bold">
            {{ props.value }}
          </q-td>
        </template>
        <template v-slot:body-cell-totalCost="props">
          <q-td :props="props" class="text-weight-bold text-primary">
            ৳ {{ formatMoney(props.value) }}
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'Received' ? 'green-6' : 'orange-8'" class="q-px-sm q-py-xs text-weight-bold">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round dense color="negative" icon="delete" size="sm" @click="deleteStock(props.row.id)">
              <q-tooltip>Delete Record</q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="full-width row flex-center flex-col text-grey-6 q-pa-xl column">
            <q-icon size="4em" name="inbox" class="q-mb-md opacity-50" />
            <div class="text-h6">No stock entries found.</div>
            <div class="text-caption">Click "New Entry" to add raw materials to inventory.</div>
          </div>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="stockDialog" persistent>
      <q-card style="min-width: 450px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center justify-between q-pb-md">
          <div class="text-h6">Purchase Entry</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="handleStockEntry">
          <q-card-section class="q-gutter-sm q-pt-md">

            <q-select
              filled
              v-model="form.itemObj"
              :options="itemOptions"
              label="Select Item *"
              option-label="name"
              :rules="[val => !!val || 'Item is required']"
              hint="Select a raw material from your inventory list"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>Unit: {{ scope.opt.unit }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <div class="row q-col-gutter-sm">
              <q-input
                filled
                v-model.number="form.qty"
                type="number"
                label="Quantity *"
                class="col-6"
                min="0.1"
                step="0.1"
                :suffix="form.itemObj ? form.itemObj.unit : ''"
                :rules="[val => val > 0 || 'Valid quantity required']"
              />
              <q-input
                filled
                v-model.number="form.cost"
                type="number"
                label="Unit Cost (৳) *"
                class="col-6"
                min="1"
                :rules="[val => val > 0 || 'Valid cost required']"
              />
            </div>

            <div class="row justify-between items-center bg-grey-2 q-pa-sm rounded-borders q-my-sm">
              <span class="text-weight-bold text-grey-8">Estimated Total:</span>
              <span class="text-h6 text-primary text-weight-bolder">৳ {{ formatMoney(estimatedTotal) }}</span>
            </div>

            <q-select
              filled
              v-model="form.supplier"
              :options="supplierOptions"
              label="Supplier *"
              :rules="[val => !!val || 'Supplier is required']"
            />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md bg-grey-1">
            <q-btn flat label="Cancel" color="grey-8" v-close-popup />
            <q-btn unelevated label="Confirm Entry" type="submit" color="primary" :loading="isSaving" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()

    // --- State ---
    const filter = ref('')
    const isLoading = ref(false)
    const isSaving = ref(false)
    const stockDialog = ref(false)

    // Form data relies on an object so we can access its unit property
    const getInitialForm = () => ({ itemObj: null, qty: null, cost: null, supplier: '' })
    const form = reactive(getInitialForm())

    const stockEntries = ref([])
    const itemOptions = ref([])

    const columns = [
      { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
      { name: 'item', label: 'Item Name', field: 'item', align: 'left', sortable: true },
      { name: 'qty', label: 'Quantity', field: 'qty', align: 'left' },
      { name: 'totalCost', label: 'Total Cost', field: 'totalCost', align: 'right', sortable: true },
      { name: 'supplier', label: 'Supplier', field: 'supplier', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
    ]

    // --- Computed ---
    const estimatedTotal = computed(() => {
      const q = form.qty || 0
      const c = form.cost || 0
      return q * c
    })

    // --- Core Logic ---
    const formatMoney = (val) => Number(val || 0).toLocaleString('en-IN')

    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400)) // Fake API delay

      // 1. Load Stock Entries
      const savedStock = localStorage.getItem('saas_stock_entries')
      if (savedStock) {
        stockEntries.value = JSON.parse(savedStock)
      } else {
        stockEntries.value = [
          { id: 1, date: new Date().toISOString().split('T')[0], item: 'Chicken Breast', qty: '20 KG', totalCost: 9000, supplier: 'Fresh Foods Ltd', status: 'Received' },
          { id: 2, date: new Date().toISOString().split('T')[0], item: 'Basmati Rice', qty: '50 KG', totalCost: 6500, supplier: 'City Group Ltd', status: 'Received' }
        ]
      }

      // 2. Load Item Options from Inventory Master List
      const savedItems = localStorage.getItem('saas_inventory_items')
      if (savedItems) {
        itemOptions.value = JSON.parse(savedItems)
      } else {
        // Fallback default raw materials
        itemOptions.value = [
          { id: 101, name: 'Chicken Breast', unit: 'KG' },
          { id: 102, name: 'Basmati Rice', unit: 'KG' },
          { id: 103, name: 'Soybean Oil', unit: 'Liters' },
          { id: 104, name: 'Flour', unit: 'KG' },
          { id: 105, name: 'Salt', unit: 'KG' },
          { id: 106, name: 'Burger Buns', unit: 'Pcs' }
        ]
        // Save these defaults so other components can access them
        localStorage.setItem('saas_inventory_items', JSON.stringify(itemOptions.value))
      }

      isLoading.value = false
    }

    onMounted(() => loadData())

    // Auto-save
    watch(stockEntries, (newVal) => {
      localStorage.setItem('saas_stock_entries', JSON.stringify(newVal))
    }, { deep: true })

    // --- Methods ---
    const openDialog = () => {
      Object.assign(form, getInitialForm())
      stockDialog.value = true
    }

    const handleStockEntry = async () => {
      isSaving.value = true
      await new Promise(res => setTimeout(res, 600)) // Fake API save

      stockEntries.value.unshift({
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        item: form.itemObj.name,
        qty: `${form.qty} ${form.itemObj.unit}`,
        totalCost: estimatedTotal.value,
        supplier: form.supplier,
        status: 'Received'
      })

      stockDialog.value = false
      isSaving.value = false
      $q.notify({ color: 'positive', message: 'Stock added successfully', icon: 'done_all', position: 'top-right' })
    }

    const deleteStock = (id) => {
      $q.dialog({
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this stock entry?',
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(() => {
        stockEntries.value = stockEntries.value.filter(s => s.id !== id)
        $q.notify({ color: 'negative', message: 'Record deleted', icon: 'delete', position: 'top-right' })
      })
    }

    // --- Explicit Return ---
    return {
      filter,
      stockDialog,
      form,
      columns,
      stockEntries,
      isLoading,
      isSaving,
      estimatedTotal,
      itemOptions,
      supplierOptions: ['City Group Ltd', 'Fresh Foods Ltd', 'Local Market', 'Meat Supplier Co.'],
      formatMoney,
      openDialog,
      handleStockEntry,
      deleteStock
    }
  }
}
</script>

<style scoped>
.opacity-50 {
  opacity: 0.5;
}
</style>
