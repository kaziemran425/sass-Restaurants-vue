<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-dark">
        <q-icon name="grid_view" class="q-mr-sm text-primary" /> Active Tables
      </div>
      <div class="row q-gutter-sm items-center">
        <div class="text-caption text-grey-8 q-mr-sm">
          <q-badge color="orange" rounded class="q-mr-xs"/> Occupied
          <q-badge color="green" rounded class="q-ml-sm q-mr-xs"/> Available
        </div>
        <q-btn flat round dense icon="refresh" color="primary" @click="loadTables" :loading="isLoading" />
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-center q-mt-xl" style="height: 40vh;">
      <q-spinner-dots color="primary" size="4em" />
    </div>

    <div v-else class="row q-col-gutter-md">
      <div v-for="table in tables" :key="table.name" class="col-6 col-sm-4 col-md-3 col-lg-2">
        <q-card
          flat bordered
          :class="table.active ? 'bg-orange-1 border-orange shadow-2' : 'bg-white shadow-1 border-transparent'"
          class="text-center q-pa-md table-card column justify-between full-height"
          style="border-radius: 12px;"
        >
          <q-card-section class="q-pa-none">
            <q-icon
              name="table_restaurant"
              size="50px"
              :color="table.active ? 'orange-9' : 'grey-4'"
              class="q-mb-sm"
            />
            <div class="text-h6 text-weight-bold text-dark">{{ table.name }}</div>

            <q-badge
              :color="table.active ? 'orange-8' : 'green-6'"
              class="q-mt-xs q-px-sm text-weight-bold shadow-1"
            >
              {{ table.active ? 'Occupied' : 'Available' }}
            </q-badge>
          </q-card-section>

          <q-card-actions class="q-pa-none q-mt-md">
            <q-btn
              v-if="table.active"
              unelevated
              color="orange-9"
              label="View Order"
              size="sm"
              icon="receipt"
              class="full-width text-weight-bold"
              @click="viewTableDetails(table)"
            />
            <q-btn
              v-else
              outline
              color="primary"
              label="Take Order"
              size="sm"
              icon="add_shopping_cart"
              class="full-width text-weight-bold bg-white"
              to="/waiter/place-order"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="detailsDialog">
      <q-card style="min-width: 350px; border-radius: 12px;">
        <q-card-section class="bg-orange-9 text-white row items-center justify-between q-pb-md">
          <div class="text-h6">Table {{ selectedTableDetails?.table }}</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md bg-grey-1" v-if="selectedTableDetails">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-caption text-grey-8">Order ID: <span class="text-weight-bold text-dark">{{ selectedTableDetails.id }}</span></div>
            <q-badge :color="getStatusColor(selectedTableDetails.status)" class="text-weight-bold">
              {{ selectedTableDetails.status }}
            </q-badge>
          </div>

          <div class="text-subtitle2 text-weight-bold q-mb-sm">Ordered Items:</div>
          <q-list dense separator class="bg-white rounded-borders border-grey">
            <q-item v-for="(item, index) in selectedTableDetails.items" :key="index" class="q-py-sm">
              <q-item-section>
                <q-item-label class="text-weight-bold text-dark">{{ item.name }}</q-item-label>
                <q-item-label caption v-if="item.note" class="text-red-6 italic">Note: {{ item.note }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="grey-3" text-color="dark" class="text-weight-bolder">x{{ item.qty }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section v-else class="text-center text-grey q-pa-xl">
          No active order found for this table.
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-2 q-pa-md">
          <q-btn flat label="Close" color="grey-8" v-close-popup />
          <q-btn unelevated color="primary" label="Add Items" icon="add" to="/waiter/place-order" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    // --- State ---
    const isLoading = ref(false)
    const tables = ref([])
    const detailsDialog = ref(false)
    const selectedTableDetails = ref(null)
    const liveOrdersList = ref([])

    // --- Core Logic ---
    const loadTables = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400)) // Simulated API Delay

      // Fetch live orders
      liveOrdersList.value = JSON.parse(localStorage.getItem('saas_live_orders') || '[]')

      // Find tables that have active orders (not completed/billed)
      // Usually, when a bill is paid, the order is moved to saas_invoices and removed from live_orders
      const activeTableNumbers = liveOrdersList.value
        .map(o => o.table.includes('T-') ? o.table : `T-${o.table.padStart(2, '0')}`)

      // Generate base tables and check occupancy
      const generatedTables = []
      for (let i = 1; i <= 10; i++) { // Increased to 10 tables
        const tName = `T-${String(i).padStart(2, '0')}` // format '4' to 'T-04'
        generatedTables.push({
          name: tName,
          active: activeTableNumbers.includes(tName)
        })
      }

      tables.value = generatedTables
      isLoading.value = false
    }

    onMounted(() => loadTables())

    // --- Methods ---
    const viewTableDetails = (table) => {
      // Find the specific order for this table
      // We look for the exact table match or the version without 'T-'
      const rawTableNum = table.name.replace('T-', '')

      const order = liveOrdersList.value.find(o =>
        o.table === table.name ||
        o.table === rawTableNum ||
        o.table === String(parseInt(rawTableNum))
      )

      if (order) {
        selectedTableDetails.value = order
        detailsDialog.value = true
      }
    }

    const getStatusColor = (status) => {
      switch(status) {
        case 'Pending': return 'blue-grey-6'
        case 'Cooking': return 'orange-8'
        case 'Ready': return 'green-6'
        case 'Served': return 'primary'
        default: return 'grey'
      }
    }

    // --- Explicit Return ---
    return {
      tables,
      isLoading,
      detailsDialog,
      selectedTableDetails,
      loadTables,
      viewTableDetails,
      getStatusColor
    }
  }
}
</script>

<style scoped>
.table-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.table-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1) !important;
}
.border-orange {
  border: 2px solid var(--q-warning) !important;
}
.border-transparent {
  border: 2px solid transparent !important;
}
.border-grey {
  border: 1px solid #e0e0e0;
}
.italic {
  font-style: italic;
}
</style>
