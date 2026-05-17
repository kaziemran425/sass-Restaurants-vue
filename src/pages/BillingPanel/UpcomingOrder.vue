<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">
        <q-icon name="room_service" class="q-mr-sm text-orange" /> Upcoming / Live Orders
      </div>
      <q-btn outline color="primary" icon="refresh" label="Refresh" @click="loadOrders" :loading="isLoading" />
    </div>

    <div class="row q-col-gutter-md" v-if="orders.length > 0">
      <div v-for="order in orders" :key="order.id" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="order-card shadow-2">
          <q-card-section class="row items-center no-wrap" :class="order.isUrgent ? 'bg-red-1' : 'bg-yellow-1'">
            <div class="col">
              <div class="text-h6 text-weight-bold">Table: {{ order.table }}</div>
              <div class="text-caption text-grey-7">Order ID: {{ order.id }}</div>
            </div>
            <q-badge :color="order.isUrgent ? 'red' : 'orange'" class="q-pa-sm text-weight-bold">
              <q-icon name="schedule" class="q-mr-xs"/> {{ order.time }} min ago
            </q-badge>
          </q-card-section>

          <q-list dense separator class="q-pa-sm">
            <q-item v-for="item in order.items" :key="item.name">
              <q-item-section>{{ item.name }}</q-item-section>
              <q-item-section side class="text-weight-bold text-black">x{{ item.qty }}</q-item-section>
            </q-item>
          </q-list>

          <q-separator />

          <q-card-actions align="right" class="bg-grey-1">
            <q-btn flat color="negative" label="Cancel" @click="updateStatus(order.id, 'cancel')" />
            <q-btn unelevated color="primary" label="Mark as Ready" icon="done" @click="updateStatus(order.id, 'ready')" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div v-else class="flex flex-center" style="height: 50vh;">
      <div class="text-center text-grey">
        <q-icon name="check_circle_outline" size="4em" />
        <div class="text-h6 q-mt-sm">No pending orders. Great job!</div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const orders = ref([])
    const isLoading = ref(false)

    const loadOrders = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400))
      const saved = localStorage.getItem('saas_live_orders')
      if (saved) {
        orders.value = JSON.parse(saved)
      } else {
        // Default Dummy Orders
        orders.value = [
          { id: 'ORD-105', table: 'T-04', time: '15', isUrgent: true, items: [{ name: 'Pasta Basta', qty: 2 }, { name: 'Coke', qty: 2 }] },
          { id: 'ORD-106', table: 'T-01', time: '2', isUrgent: false, items: [{ name: 'Family Pizza', qty: 1 }] }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadOrders())

    watch(orders, (newVal) => {
      localStorage.setItem('saas_live_orders', JSON.stringify(newVal))
    }, { deep: true })

    const updateStatus = async (id, action) => {
      // Simulate API processing
      $q.loading.show()
      await new Promise(res => setTimeout(res, 500))

      orders.value = orders.value.filter(o => o.id !== id)

      $q.loading.hide()
      if (action === 'ready') {
        $q.notify({ color: 'positive', message: 'Order marked as ready!', icon: 'check' })
      } else {
        $q.notify({ color: 'negative', message: 'Order cancelled.', icon: 'cancel' })
      }
    }

    return { orders, isLoading, loadOrders, updateStatus }
  }
}
</script>

<style scoped>
.order-card { border-radius: 12px; overflow: hidden; }
</style>
