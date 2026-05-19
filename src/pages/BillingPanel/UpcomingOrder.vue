<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold text-dark">
        <q-icon name="room_service" class="q-mr-sm text-orange-8" />
        Upcoming / Live Orders
      </div>
      <q-btn
        outline
        color="primary"
        icon="refresh"
        label="Refresh Orders"
        @click="loadOrders"
        :loading="isLoading"
        class="bg-white"
      />
    </div>

    <div v-if="isLoading && orders.length === 0" class="flex flex-center" style="height: 50vh;">
      <q-spinner-dots color="orange" size="4em" />
    </div>

    <div v-else-if="orders.length === 0" class="flex flex-center column" style="height: 50vh;">
      <div class="text-center text-grey-6">
        <q-icon name="check_circle_outline" size="5em" color="grey-4" />
        <div class="text-h5 q-mt-md text-weight-medium">No pending orders</div>
        <div class="text-subtitle1">The kitchen is all caught up! Great job.</div>
      </div>
    </div>

    <transition-group v-else name="order-list" tag="div" class="row q-col-gutter-md">
      <div v-for="order in orders" :key="order.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card flat bordered class="order-card shadow-1 column full-height">

          <q-card-section
            class="row items-center no-wrap q-pa-sm"
            :class="order.isUrgent ? 'bg-red-1 border-bottom-red' : 'bg-orange-1 border-bottom-orange'"
          >
            <div class="col">
              <div class="text-h6 text-weight-bold text-dark" style="line-height: 1.2;">
                Table: {{ order.table }}
              </div>
              <div class="text-caption text-grey-8">ID: {{ order.id }}</div>
            </div>
            <q-badge
              :color="order.isUrgent ? 'red-6' : 'orange-8'"
              class="q-pa-sm text-weight-bold shadow-1"
            >
              <q-icon name="schedule" class="q-mr-xs" size="xs"/>
              {{ order.time }} min ago
            </q-badge>
          </q-card-section>

          <q-card-section class="col q-pa-none bg-white scroll" style="max-height: 250px;">
            <q-list dense separator class="q-pa-sm">
              <q-item v-for="item in order.items" :key="item.name" class="q-py-sm">
                <q-item-section class="text-weight-medium text-grey-9">
                  {{ item.name }}
                </q-item-section>
                <q-item-section side>
                  <div class="text-weight-bold text-dark bg-grey-2 q-px-sm q-py-xs" style="border-radius: 6px;">
                    x{{ item.qty }}
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator />

          <q-card-actions align="between" class="bg-grey-1 q-pa-sm">
            <q-btn
              flat
              color="negative"
              label="Cancel"
              icon="close"
              size="sm"
              @click="confirmCancel(order.id)"
            />
            <q-btn
              unelevated
              color="primary"
              label="Mark Ready"
              icon="done_all"
              class="text-weight-bold"
              @click="updateStatus(order.id, 'ready')"
            />
          </q-card-actions>
        </q-card>
      </div>
    </transition-group>
  </q-page>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()

    // --- State ---
    const orders = ref([])
    const isLoading = ref(false)

    // --- Methods ---
    const loadOrders = async () => {
      isLoading.value = true
      // Simulated API delay
      await new Promise(res => setTimeout(res, 500))

      const saved = localStorage.getItem('saas_live_orders')
      if (saved) {
        orders.value = JSON.parse(saved)
      } else {
        // Default Dummy Orders
        orders.value = [
          { id: 'ORD-105', table: 'T-04', time: '15', isUrgent: true, items: [{ name: 'Pasta Basta', qty: 2 }, { name: 'Coke', qty: 2 }] },
          { id: 'ORD-106', table: 'T-01', time: '2', isUrgent: false, items: [{ name: 'Family Pizza', qty: 1 }] },
          { id: 'ORD-107', table: 'T-08', time: '8', isUrgent: false, items: [{ name: 'Beef Burger', qty: 3 }, { name: 'Fries', qty: 1 }] }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadOrders())

    // Auto-save to localStorage
    watch(orders, (newVal) => {
      localStorage.setItem('saas_live_orders', JSON.stringify(newVal))
    }, { deep: true })

    // Safety check before cancelling
    const confirmCancel = (id) => {
      $q.dialog({
        title: 'Cancel Order?',
        message: 'Are you sure you want to cancel this order? This cannot be undone.',
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(() => {
        updateStatus(id, 'cancel')
      })
    }

    const updateStatus = async (id, action) => {
      // Show loading spinner
      $q.loading.show({
        message: action === 'ready' ? 'Completing order...' : 'Cancelling order...'
      })

      // Simulate API processing
      await new Promise(res => setTimeout(res, 400))

      // Remove the order from the array
      orders.value = orders.value.filter(o => o.id !== id)

      $q.loading.hide()

      // Notify the user
      if (action === 'ready') {
        $q.notify({ color: 'positive', message: `Order ${id} marked as ready!`, icon: 'check_circle', position: 'top-right' })
      } else {
        $q.notify({ color: 'negative', message: `Order ${id} was cancelled.`, icon: 'cancel', position: 'top-right' })
      }
    }

    // --- Explicit Return ---
    return {
      orders,
      isLoading,
      loadOrders,
      confirmCancel,
      updateStatus
    }
  }
}
</script>

<style scoped>
/* Card Styling & Hover Effects */
.order-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.1) !important;
}

/* Subtle border accents for urgency */
.border-bottom-red {
  border-bottom: 2px solid var(--q-negative);
}
.border-bottom-orange {
  border-bottom: 2px solid var(--q-warning);
}

/* Vue Transition Group Classes */
.order-list-enter-active,
.order-list-leave-active {
  transition: all 0.4s ease;
}
.order-list-enter-from,
.order-list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
.order-list-leave-active {
  position: absolute;
}
</style>
