<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">
        <q-icon name="format_list_numbered" class="q-mr-sm text-primary" /> Kitchen Queue Manager
      </div>
      <q-btn outline color="primary" icon="refresh" label="Refresh Table" @click="loadData" :loading="isLoading" />
    </div>

    <q-card flat bordered style="border-radius: 12px;">
      <q-table
        :rows="queueRows"
        :columns="queueCols"
        row-key="id"
        flat
        :loading="isLoading"
        :pagination="{ rowsPerPage: 15 }"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'Cooking' ? 'orange' : 'blue-grey'" class="q-px-sm">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-wait="props">
          <q-td :props="props">
            <q-chip
              :color="props.value > 15 ? 'red' : (props.value > 10 ? 'orange' : 'green')"
              text-color="white"
              size="sm"
              class="text-weight-bold"
            >
              {{ props.value }} mins
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn v-if="props.row.status === 'Pending'" flat dense round icon="local_fire_department" color="orange" @click="updateStatus(props.row.id, 'Cooking')">
              <q-tooltip>Start Cooking</q-tooltip>
            </q-btn>
            <q-btn flat dense round icon="done_all" color="positive" @click="updateStatus(props.row.id, 'Ready')">
              <q-tooltip>Mark as Ready</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey q-pa-md">
            <span>No orders in the queue.</span>
          </div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const isLoading = ref(false)
    const allOrders = ref([])

    const queueCols = [
      { name: 'id', label: 'Order ID', field: 'id', align: 'left', sortable: true },
      { name: 'table', label: 'Table', field: 'table', align: 'left', sortable: true },
      { name: 'items', label: 'Items Summary', field: 'itemsSummary', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' },
      { name: 'wait', label: 'Wait Time', field: 'wait', sortable: true, align: 'center' },
      { name: 'actions', label: 'Action', field: 'actions', align: 'right' }
    ]

    const queueRows = ref([])

    const processOrdersForTable = (ordersData) => {
      // Filter out Ready/Served orders and format for table
      queueRows.value = ordersData
        .filter(o => o.status === 'Pending' || o.status === 'Cooking')
        .map(o => {
          // Extract numbers from string like "8 mins" or use default
          const waitTimeStr = o.time || '0';
          const waitTime = parseInt(waitTimeStr.replace(/\D/g, '')) || Math.floor(Math.random() * 20) + 1;

          const itemsSummary = o.items ? o.items.map(i => `${i.name} x${i.qty}`).join(', ') : 'No items';

          return {
            id: o.id,
            table: `T-${o.table}`,
            itemsSummary: itemsSummary,
            status: o.status || 'Pending',
            wait: waitTime
          }
        })
    }

    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400))
      const saved = localStorage.getItem('saas_live_orders')
      if (saved) {
        allOrders.value = JSON.parse(saved)
      } else {
        // Fallback
        allOrders.value = [
          { id: '1008', table: '02', time: '18 mins', status: 'Cooking', items: [{name: 'Burger', qty: 2}, {name: 'Fries', qty: 1}] },
          { id: '1009', table: '05', time: '5 mins', status: 'Pending', items: [{name: 'Steak', qty: 1}, {name: 'Salad', qty: 1}] }
        ]
      }
      processOrdersForTable(allOrders.value)
      isLoading.value = false
    }

    onMounted(() => loadData())

    watch(allOrders, (newVal) => {
      localStorage.setItem('saas_live_orders', JSON.stringify(newVal))
      processOrdersForTable(newVal)
    }, { deep: true })

    const updateStatus = async (id, newStatus) => {
      const realId = id.replace('ORD-', '') // Safety check
      const index = allOrders.value.findIndex(o => o.id === id || o.id === realId)

      if (index !== -1) {
        allOrders.value[index].status = newStatus
        $q.notify({
          color: newStatus === 'Ready' ? 'positive' : 'orange',
          message: `Order #${id} is now ${newStatus}`,
          icon: 'update'
        })
      }
    }

    return { queueCols, queueRows, isLoading, loadData, updateStatus }
  }
}
</script>
