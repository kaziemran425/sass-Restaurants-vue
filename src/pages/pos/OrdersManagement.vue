<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">
        <q-icon name="list_alt" class="q-mr-sm text-primary" /> Live Orders Management
      </div>
      <q-btn outline color="primary" icon="refresh" label="Sync Orders" @click="loadOrders" :loading="isLoading" />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-center" style="height: 40vh;">
      <q-spinner-dots color="primary" size="3em" />
    </div>

    <div v-else class="row q-col-gutter-md">
      <div v-for="order in liveOrders" :key="order.id" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="order-card shadow-1" style="border-radius: 12px; overflow: hidden;">
          <q-card-section class="row justify-between items-center" :class="getStatusClass(order.status)">
            <div>
              <div class="text-h6 text-weight-bold">Table: {{ order.table }}</div>
              <div class="text-caption">ID: {{ order.id }}</div>
            </div>
            <q-badge :color="getStatusBadgeColor(order.status)" class="q-pa-sm text-subtitle2 shadow-1">
              {{ order.status }}
            </q-badge>
          </q-card-section>

          <q-list dense separator class="bg-white q-pa-sm">
            <q-item v-for="item in order.items" :key="item.name">
              <q-item-section class="text-weight-medium">{{ item.name }}</q-item-section>
              <q-item-section side class="text-weight-bold text-black bg-grey-2 q-px-sm" style="border-radius: 4px;">
                x{{ item.qty }}
              </q-item-section>
            </q-item>
          </q-list>

          <q-separator />

          <q-card-actions align="between" class="bg-grey-1 q-pa-sm">
            <q-btn flat color="negative" label="Cancel" size="sm" icon="cancel" @click="updateOrderStatus(order.id, 'Cancelled')" />
            <q-btn
              v-if="order.status !== 'Completed'"
              unelevated
              color="primary"
              label="Mark Completed"
              icon="done_all"
              size="sm"
              @click="updateOrderStatus(order.id, 'Completed')"
            />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Empty State -->
      <div v-if="liveOrders.length === 0" class="col-12 text-center text-grey q-pa-xl">
        <q-icon name="done_all" size="5em" />
        <div class="text-h5 q-mt-md">All caught up!</div>
        <div class="text-subtitle1">No live orders at the moment.</div>
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
    const isLoading = ref(false)
    const liveOrders = ref([])

    const loadOrders = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 500))

      const saved = localStorage.getItem('saas_live_orders')
      if (saved) {
        liveOrders.value = JSON.parse(saved)
      } else {
        liveOrders.value = [
          { id: 'ORD-99', table: 'T-05', status: 'Cooking', items: [{ name: 'Chicken Pizza', qty: 1 }, { name: 'Coke', qty: 2 }] },
          { id: 'ORD-100', table: 'T-02', status: 'Pending', items: [{ name: 'Pasta Alfredo', qty: 1 }] }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadOrders())

    // Auto save on change
    watch(liveOrders, (newVal) => {
      localStorage.setItem('saas_live_orders', JSON.stringify(newVal))
    }, { deep: true })

    const updateOrderStatus = async (id, newStatus) => {
      // API processing simulation
      $q.loading.show()
      await new Promise(res => setTimeout(res, 400))

      if (newStatus === 'Cancelled' || newStatus === 'Completed') {
        // Remove from live screen
        liveOrders.value = liveOrders.value.filter(o => o.id !== id)
      } else {
        const index = liveOrders.value.findIndex(o => o.id === id)
        if(index !== -1) liveOrders.value[index].status = newStatus
      }

      $q.loading.hide()
      $q.notify({
        color: newStatus === 'Completed' ? 'positive' : 'negative',
        message: `Order ${id} marked as ${newStatus}`,
        icon: newStatus === 'Completed' ? 'check_circle' : 'cancel'
      })
    }

    const getStatusClass = (status) => {
      if (status === 'Pending') return 'bg-yellow-2'
      if (status === 'Cooking') return 'bg-orange-2'
      if (status === 'Ready') return 'bg-green-2'
      return 'bg-grey-3'
    }

    const getStatusBadgeColor = (status) => {
      if (status === 'Pending') return 'orange-8'
      if (status === 'Cooking') return 'deep-orange'
      if (status === 'Ready') return 'green-8'
      return 'grey-8'
    }

    return { liveOrders, isLoading, loadOrders, updateOrderStatus, getStatusClass, getStatusBadgeColor }
  }
}
</script>

<style scoped>
.order-card { transition: all 0.3s ease; }
</style>
