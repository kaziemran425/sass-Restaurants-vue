<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-dark">
        <q-icon name="format_list_numbered" class="q-mr-sm text-primary" /> Kitchen Queue Manager
      </div>
      <div class="row q-gutter-sm items-center">
        <q-input
          outlined
          dense
          v-model="filter"
          placeholder="Search Table or ID..."
          bg-color="white"
          style="width: 250px"
          clearable
        >
          <template v-slot:append><q-icon name="search" /></template>
        </q-input>
        <q-btn outline color="primary" icon="refresh" label="Refresh" @click="loadData" :loading="isLoading" class="bg-white" />
        <q-btn color="primary" icon="add" label="New Order" @click="openAddDialog" />
      </div>
    </div>

    <q-card flat bordered style="border-radius: 12px;" class="bg-white">
      <q-table
        :rows="queueRows"
        :columns="queueCols"
        row-key="id"
        flat
        :filter="filter"
        :loading="isLoading"
        :pagination="{ rowsPerPage: 15 }"
        class="text-grey-9"
      >
        <template v-slot:body-cell-priority="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'High' ? 'red-6' : 'grey-6'" class="text-weight-bold q-px-sm shadow-1">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'Cooking' ? 'orange-8' : 'blue-grey-6'" class="q-px-sm q-py-xs text-weight-bold">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-wait="props">
          <q-td :props="props">
            <q-chip
              :color="props.value > 15 ? 'red-6' : (props.value > 10 ? 'orange-8' : 'green-6')"
              text-color="white"
              size="sm"
              class="text-weight-bold shadow-1"
            >
              {{ props.value }} mins
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn
              v-if="props.row.status === 'Pending'"
              flat dense round
              icon="local_fire_department"
              color="orange-8"
              class="q-mr-xs"
              @click="updateStatus(props.row.id, 'Cooking')"
            >
              <q-tooltip>Start Cooking</q-tooltip>
            </q-btn>

            <q-btn
              flat dense round
              icon="done_all"
              color="positive"
              class="q-mr-xs"
              @click="updateStatus(props.row.id, 'Ready')"
            >
              <q-tooltip>Mark as Ready</q-tooltip>
            </q-btn>

            <q-btn
              v-if="props.row.status === 'Pending'"
              flat dense round
              icon="cancel"
              color="negative"
              @click="cancelOrder(props.row.id)"
            >
              <q-tooltip>Cancel Order</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center flex-col text-grey-6 q-pa-xl column">
            <q-icon size="4em" name="assignment_turned_in" class="q-mb-md opacity-50" />
            <div class="text-h6">Kitchen queue is empty.</div>
            <div class="text-caption">No pending or cooking orders at the moment.</div>
          </div>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="addDialog" persistent>
      <q-card style="min-width: 450px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center justify-between q-pb-md">
          <div class="text-h6">Manual Kitchen Ticket</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="saveOrder">
          <q-card-section class="q-gutter-md q-pt-md">
            <div class="row q-col-gutter-sm">
              <q-input
                filled
                v-model="form.table"
                label="Table Number *"
                class="col-6"
                dense
                :rules="[val => !!val || 'Required']"
              />
              <q-select
                filled
                v-model="form.priority"
                :options="['Normal', 'High']"
                label="Priority *"
                class="col-6"
                dense
              />
            </div>

            <q-separator class="q-my-sm" />
            <div class="text-subtitle2 text-weight-bold text-dark">Add Items to Ticket</div>

            <div class="row q-col-gutter-sm items-center">
              <q-select
                filled
                v-model="currentItem"
                :options="menuOptions"
                option-label="name"
                label="Select Item"
                class="col-7"
                dense
              />
              <q-input
                filled
                v-model.number="currentQty"
                type="number"
                label="Qty"
                class="col-3"
                dense
                min="1"
              />
              <div class="col-2 text-right">
                <q-btn
                  color="teal"
                  icon="add"
                  round
                  dense
                  unelevated
                  @click="addItemToTicket"
                  :disable="!currentItem || currentQty < 1"
                />
              </div>
            </div>

            <q-list bordered separator class="rounded-borders q-mt-sm bg-grey-1" v-if="formItems.length > 0">
              <q-item v-for="(item, index) in formItems" :key="index" dense class="q-py-sm">
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ item.name }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row items-center no-wrap">
                    <q-badge color="grey-3" text-color="dark" class="q-mr-sm text-weight-bold">x{{ item.qty }}</q-badge>
                    <q-btn flat round dense color="negative" icon="close" size="xs" @click="removeItemFromTicket(index)" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-center text-grey-6 q-pa-sm bg-grey-2 rounded-borders">
              No items added to ticket yet.
            </div>

          </q-card-section>

          <q-card-actions align="right" class="q-pa-md bg-grey-1">
            <q-btn flat label="Cancel" color="grey-8" v-close-popup />
            <q-btn
              unelevated
              label="Push to Kitchen"
              type="submit"
              color="primary"
              :loading="isSaving"
              :disable="formItems.length === 0"
            />
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

    // --- State ---
    const filter = ref('')
    const isLoading = ref(false)
    const isSaving = ref(false)
    const addDialog = ref(false)
    const allOrders = ref([])
    const queueRows = ref([])
    const menuOptions = ref([])

    // Manual Entry Form State
    const getInitialForm = () => ({ table: '', priority: 'Normal' })
    const form = reactive(getInitialForm())
    const formItems = ref([])
    const currentItem = ref(null)
    const currentQty = ref(1)

    // --- Columns ---
    const queueCols = [
      { name: 'id', label: 'Order ID', field: 'id', align: 'left', sortable: true },
      { name: 'table', label: 'Table', field: 'table', align: 'left', sortable: true },
      { name: 'priority', label: 'Priority', field: 'priority', align: 'left', sortable: true },
      { name: 'items', label: 'Items Summary', field: 'itemsSummary', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' },
      { name: 'wait', label: 'Wait Time', field: 'wait', sortable: true, align: 'center' },
      { name: 'actions', label: 'Action', field: 'actions', align: 'right' }
    ]

    // --- Core Logic ---
    const processOrdersForTable = (ordersData) => {
      // Filter out Ready/Served orders and format for table
      queueRows.value = ordersData
        .filter(o => o.status === 'Pending' || o.status === 'Cooking')
        .map(o => {
          // Extract numbers from string like "8 mins" or use default
          const waitTimeStr = o.time || '0';
          let waitTime = 0;
          if (waitTimeStr !== 'Just now') {
            waitTime = parseInt(waitTimeStr.replace(/\D/g, '')) || Math.floor(Math.random() * 20) + 1;
          }

          const itemsSummary = o.items ? o.items.map(i => `${i.name} x${i.qty}`).join(', ') : 'No items';

          return {
            id: o.id,
            table: o.table.includes('T-') ? o.table : `T-${o.table}`,
            priority: o.priority || 'Normal',
            itemsSummary: itemsSummary,
            status: o.status || 'Pending',
            wait: waitTime
          }
        })
    }

    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400))

      // 1. Load Live Orders
      const savedOrders = localStorage.getItem('saas_live_orders')
      if (savedOrders) {
        allOrders.value = JSON.parse(savedOrders)
      } else {
        // Fallback dummy data
        allOrders.value = [
          { id: 'ORD-1008', table: '02', priority: 'High', time: '18 mins', status: 'Cooking', items: [{name: 'Classic Beef Burger', qty: 2}, {name: 'French Fries', qty: 1}] },
          { id: 'ORD-1009', table: '05', priority: 'Normal', time: '5 mins', status: 'Pending', items: [{name: 'Chicken Pasta Alfredo', qty: 1}] }
        ]
        localStorage.setItem('saas_live_orders', JSON.stringify(allOrders.value))
      }

      // 2. Load Menu Items (For the add dialog dropdown)
      const savedMenu = localStorage.getItem('saas_menu_items')
      if (savedMenu) {
        menuOptions.value = JSON.parse(savedMenu)
      } else {
        menuOptions.value = [
          { name: 'Classic Beef Burger' }, { name: 'Chicken Pasta Alfredo' }, { name: 'French Fries' }, { name: 'Cold Coffee' }
        ]
      }

      processOrdersForTable(allOrders.value)
      isLoading.value = false
    }

    onMounted(() => loadData())

    // Auto-save changes
    watch(allOrders, (newVal) => {
      localStorage.setItem('saas_live_orders', JSON.stringify(newVal))
      processOrdersForTable(newVal)
    }, { deep: true })

    // --- Methods ---
    const updateStatus = async (id, newStatus) => {
      const index = allOrders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        allOrders.value[index].status = newStatus
        $q.notify({
          color: newStatus === 'Ready' ? 'positive' : 'orange-9',
          message: `Order #${id} is now ${newStatus}`,
          icon: newStatus === 'Ready' ? 'room_service' : 'local_fire_department',
          position: 'top-right'
        })
      }
    }

    const cancelOrder = (id) => {
      $q.dialog({
        title: 'Cancel Order',
        message: 'Are you sure you want to cancel this order? It will be removed from the queue.',
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(() => {
        allOrders.value = allOrders.value.filter(o => o.id !== id)
        $q.notify({ color: 'negative', message: `Order #${id} cancelled`, icon: 'cancel', position: 'top-right' })
      })
    }

    // Add Dialog Handlers
    const openAddDialog = () => {
      Object.assign(form, getInitialForm())
      formItems.value = []
      currentItem.value = null
      currentQty.value = 1
      addDialog.value = true
    }

    const addItemToTicket = () => {
      if (!currentItem.value) return

      // Check if item already exists in the ticket, if so add to qty
      const existing = formItems.value.find(i => i.name === currentItem.value.name)
      if (existing) {
        existing.qty += currentQty.value
      } else {
        formItems.value.push({
          name: currentItem.value.name,
          qty: currentQty.value
        })
      }

      // Reset inputs
      currentItem.value = null
      currentQty.value = 1
    }

    const removeItemFromTicket = (index) => {
      formItems.value.splice(index, 1)
    }

    const saveOrder = async () => {
      isSaving.value = true
      await new Promise(res => setTimeout(res, 500))

      const newId = `ORD-${Math.floor(Math.random() * 9000) + 1000}`

      allOrders.value.unshift({
        id: newId,
        table: form.table,
        priority: form.priority,
        time: 'Just now',
        status: 'Pending',
        items: [...formItems.value]
      })

      isSaving.value = false
      addDialog.value = false
      $q.notify({ color: 'positive', message: `Ticket ${newId} pushed to queue!`, icon: 'check_circle', position: 'top-right' })
    }

    // --- Explicit Return ---
    return {
      filter,
      queueCols,
      queueRows,
      isLoading,
      isSaving,
      addDialog,
      form,
      formItems,
      currentItem,
      currentQty,
      menuOptions,
      loadData,
      updateStatus,
      cancelOrder,
      openAddDialog,
      addItemToTicket,
      removeItemFromTicket,
      saveOrder
    }
  }
}
</script>

<style scoped>
.opacity-50 {
  opacity: 0.5;
}
</style>
