<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-weight-bold">
        <q-icon name="grid_view" class="q-mr-sm text-primary" /> Active Tables
      </div>
      <q-btn flat round dense icon="refresh" color="primary" @click="loadTables" :loading="isLoading" />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-center q-mt-xl">
      <q-spinner-dots color="primary" size="3em" />
    </div>

    <div v-else class="row q-col-gutter-md">
      <div v-for="table in tables" :key="table.name" class="col-6 col-sm-4 col-md-3">
        <q-card
          flat bordered
          :class="table.active ? 'bg-orange-1 border-orange shadow-2' : 'bg-white shadow-1'"
          class="text-center q-pa-md table-card"
          style="border-radius: 12px;"
        >
          <q-icon
            name="table_restaurant"
            size="40px"
            :color="table.active ? 'orange-9' : 'grey-5'"
            class="q-mb-sm"
          />
          <div class="text-subtitle1 text-weight-bold text-black">{{ table.name }}</div>

          <q-badge
            :color="table.active ? 'orange' : 'green'"
            class="q-mt-xs q-px-sm"
          >
            {{ table.active ? 'Occupied' : 'Available' }}
          </q-badge>

          <div class="q-mt-md">
            <q-btn
              v-if="table.active"
              unelevated
              color="orange-9"
              label="View Order"
              size="sm"
              class="full-width text-weight-bold"
              @click="viewTableDetails(table)"
            />
            <q-btn
              v-else
              outline
              color="primary"
              label="Take Order"
              size="sm"
              class="full-width text-weight-bold"
              to="/waiter/place-order"
            />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const isLoading = ref(false)
    const tables = ref([])

    const loadTables = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400))

      const liveOrders = JSON.parse(localStorage.getItem('saas_live_orders') || '[]')
      // Find tables that have active orders (not completed/billed)
      const activeTableNumbers = liveOrders
        .filter(o => o.status !== 'Completed' && o.status !== 'Paid')
        .map(o => `T-${o.table.padStart(2, '0')}`) // formats '4' to 'T-04'

      // Generate base tables and check occupancy
      const generatedTables = []
      for (let i = 1; i <= 8; i++) {
        const tName = `T-0${i}`
        generatedTables.push({
          name: tName,
          active: activeTableNumbers.includes(tName)
        })
      }

      tables.value = generatedTables
      isLoading.value = false
    }

    onMounted(() => loadTables())

    const viewTableDetails = (table) => {
      $q.notify({
        color: 'info',
        message: `Showing current orders for ${table.name}`,
        icon: 'info'
      })
      // Here you can open a dialog showing the items they ordered
    }

    return { tables, isLoading, loadTables, viewTableDetails }
  }
}
</script>

<style scoped>
.table-card { transition: transform 0.2s; }
.table-card:hover { transform: translateY(-4px); }
.border-orange { border: 2px solid #ff9800 !important; }
</style>
