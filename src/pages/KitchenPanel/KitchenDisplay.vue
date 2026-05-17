<template>
  <q-page padding class="bg-blue-grey-1">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-blue-grey-10">
        <q-icon name="restaurant_menu" class="q-mr-sm" /> Live Kitchen Display
      </div>
      <div class="row q-gutter-sm">
        <q-btn outline color="primary" icon="refresh" label="Sync" @click="loadOrders" :loading="isLoading" />
        <q-badge color="negative" class="q-pa-sm text-subtitle2">Live Tickets: {{ pendingOrders.length }}</q-badge>
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-center" style="height: 50vh;">
      <q-spinner-pie color="primary" size="4em" />
    </div>

    <div v-else class="row q-col-gutter-md">
      <div v-for="order in pendingOrders" :key="order.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card flat bordered class="order-card shadow-3" style="border-radius: 12px; overflow: hidden;">
          <q-card-section :class="order.priority === 'High' ? 'bg-red-8 text-white' : 'bg-blue-grey-8 text-white'">
            <div class="row justify-between items-center">
              <div class="text-h6 text-weight-bold">Table #{{ order.table }}</div>
              <div class="text-caption bg-white text-black q-px-sm" style="border-radius: 4px;">#{{ order.id }}</div>
            </div>
            <div class="row justify-between items-center q-mt-xs">
              <div class="text-caption"><q-icon name="schedule" /> {{ order.time || 'Just now' }}</div>
              <q-badge v-if="order.status === 'Cooking'" color="orange" text-color="black">Cooking</q-badge>
            </div>
          </q-card-section>

          <q-list dense separator class="bg-white q-pa-sm">
            <q-item v-for="item in order.items" :key="item.name">
              <q-item-section>
                <q-item-label class="text-weight-bold text-subtitle1">{{ item.name }}</q-item-label>
                <q-item-label caption class="text-red-6 text-weight-bold" v-if="item.note">* {{ item.note }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="grey-3" text-color="black" class="text-h6 q-pa-sm">x{{ item.qty }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>

          <q-separator />

          <q-card-actions class="bg-grey-2 q-pa-sm row justify-between">
            <q-btn v-if="order.status !== 'Cooking'" outline color="orange-9" label="Start Prep" icon="local_fire_department" class="col q-mr-xs" @click="changeStatus(order.id, 'Cooking')" />
            <q-btn unelevated color="positive" label="Ready to Serve" icon="done_all" class="col" @click="changeStatus(order.id, 'Ready')" />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Empty State -->
      <div v-if="pendingOrders.length === 0" class="col-12 flex flex-center" style="height: 50vh;">
        <div class="text-center text-grey">
          <q-icon name="check_circle_outline" size="5em" />
          <div class="text-h5 q-mt-md">Kitchen is clear!</div>
          <div class="text-subtitle1">No pending orders at the moment.</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const isLoading = ref(false)
    const orders = ref([])

    const loadOrders = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 500))
      const saved = localStorage.getItem('saas_live_orders')
      if (saved) {
        orders.value = JSON.parse(saved)
      } else {
        // Mock data
        orders.value = [
          {
            id: 'ORD-1005', table: '04', time: '8 mins', priority: 'High', status: 'Pending',
            items: [{ name: 'BBQ Chicken Pizza', qty: 1, note: 'Extra spicy' }, { name: 'Garlic Bread', qty: 2 }]
          },
          {
            id: 'ORD-1006', table: '12', time: '3 mins', priority: 'Normal', status: 'Cooking',
            items: [{ name: 'Pasta Alfredo', qty: 2 }]
          }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadOrders())

    watch(orders, (newVal) => {
      localStorage.setItem('saas_live_orders', JSON.stringify(newVal))
    }, { deep: true })

    // Only show Pending or Cooking orders in Kitchen Display
    const pendingOrders = computed(() => {
      return orders.value.filter(o => o.status !== 'Ready' && o.status !== 'Served')
    })

    const changeStatus = async (id, newStatus) => {
      const index = orders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orders.value[index].status = newStatus
        if (newStatus === 'Ready') {
          $q.notify({ color: 'positive', message: `Order #${id} is ready for Waiter!`, icon: 'room_service' })
        } else {
          $q.notify({ color: 'orange-9', message: `Cooking started for Order #${id}`, icon: 'local_fire_department' })
        }
      }
    }

    return { orders, pendingOrders, isLoading, loadOrders, changeStatus }
  }
}
</script>
