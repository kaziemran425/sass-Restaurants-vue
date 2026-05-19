<template>
  <q-page padding class="bg-blue-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-red-13 text-weight-bold">
        <q-icon name="restaurant_menu" class="q-mr-sm" /> Live Kitchen Display
      </div>
      <div class="row q-gutter-md items-center">
        <q-badge color="negative" class="q-pa-sm text-subtitle1 text-weight-bold shadow-1">
          Live Tickets: {{ pendingOrders.length }}
        </q-badge>
        <q-btn
          outline
          color="primary"
          icon="refresh"
          label="Sync Orders"
          @click="loadOrders"
          :loading="isLoading"
          class="bg-white"
        />
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-center column" style="height: 50vh;">
      <q-spinner-pie color="primary" size="4em" />
      <div class="text-grey-6 q-mt-sm text-h6">Syncing with POS...</div>
    </div>

    <div v-else-if="pendingOrders.length === 0" class="flex flex-center column text-grey-6" style="height: 50vh;">
      <q-icon name="check_circle_outline" size="6em" class="opacity-50 q-mb-md" />
      <div class="text-h4 text-weight-medium">Kitchen is clear!</div>
      <div class="text-subtitle1 q-mt-sm">No pending orders at the moment.</div>
    </div>

    <transition-group v-else name="ticket-list" tag="div" class="row q-col-gutter-md">
      <div v-for="order in pendingOrders" :key="order.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card flat bordered class="ticket-card shadow-3 column full-height bg-white">

          <q-card-section
            :class="order.priority === 'High' ? 'bg-red-8 text-white' : 'bg-blue-grey-8 text-white'"
            class="q-pa-sm"
          >
            <div class="row justify-between items-center q-mb-xs">
              <div class="text-h6 text-weight-bold" style="line-height: 1.2;">Table #{{ order.table }}</div>
              <div class="text-caption bg-white text-dark text-weight-bold q-px-sm q-py-xs shadow-1" style="border-radius: 4px;">
                {{ order.id }}
              </div>
            </div>
            <div class="row justify-between items-center">
              <div class="text-caption text-weight-medium" style="opacity: 0.9;">
                <q-icon name="schedule" size="xs" class="q-mr-xs" /> {{ order.time || 'Just now' }}
              </div>
              <q-badge v-if="order.status === 'Cooking'" color="orange-5" text-color="black" class="text-weight-bold shadow-1">
                <q-icon name="local_fire_department" size="xs" class="q-mr-xs"/> COOKING
              </q-badge>
            </div>
          </q-card-section>

          <q-card-section class="col q-pa-none scroll" style="max-height: 300px;">
            <q-list separator>
              <q-item v-for="(item, index) in order.items" :key="index" class="q-py-md">
                <q-item-section>
                  <q-item-label class="text-weight-bold text-subtitle1 text-dark">{{ item.name }}</q-item-label>

                  <q-item-label
                    v-if="item.note"
                    caption
                    class="text-red-8 text-weight-bold bg-red-1 q-pa-xs q-mt-xs rounded-borders"
                    style="border: 1px dashed var(--q-negative);"
                  >
                    <q-icon name="warning" size="xs" /> NOTE: {{ item.note }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="bg-grey-2 text-dark text-h6 text-weight-bolder q-px-md q-py-xs rounded-borders border-grey">
                    x{{ item.qty }}
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator />

          <q-card-actions class="bg-grey-1 q-pa-sm row justify-between q-gutter-x-sm no-wrap">
            <q-btn
              v-if="order.status !== 'Cooking'"
              outline
              color="orange-9"
              label="Start Prep"
              icon="local_fire_department"
              class="col text-weight-bold"
              @click="changeStatus(order.id, 'Cooking')"
            />
            <q-btn
              unelevated
              color="positive"
              :label="order.status === 'Cooking' ? 'Ready to Serve' : 'Bump'"
              icon="room_service"
              class="col text-weight-bold"
              @click="changeStatus(order.id, 'Ready')"
            />
          </q-card-actions>
        </q-card>
      </div>
    </transition-group>
  </q-page>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()

    // --- State ---
    const isLoading = ref(false)
    const orders = ref([])

    // --- Core Logic ---
    const loadOrders = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 500)) // Simulated API Delay

      const saved = localStorage.getItem('saas_live_orders')
      if (saved) {
        orders.value = JSON.parse(saved)
      } else {
        // Mock data to ensure the KDS looks good out of the box
        orders.value = [
          {
            id: 'ORD-1005', table: '04', time: '8 mins', priority: 'High', status: 'Pending',
            items: [
              { name: 'BBQ Chicken Pizza', qty: 1, note: 'Extra spicy, no olives' },
              { name: 'Garlic Bread', qty: 2 }
            ]
          },
          {
            id: 'ORD-1006', table: '12', time: '3 mins', priority: 'Normal', status: 'Cooking',
            items: [
              { name: 'Pasta Alfredo', qty: 2 }
            ]
          },
          {
            id: 'ORD-1007', table: '02', time: '1 min', priority: 'Normal', status: 'Pending',
            items: [
              { name: 'Classic Beef Burger', qty: 3, note: 'One without cheese' },
              { name: 'French Fries', qty: 3 }
            ]
          }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadOrders())

    // Auto-sync changes back to LocalStorage (This updates the POS and Dashboard)
    watch(orders, (newVal) => {
      localStorage.setItem('saas_live_orders', JSON.stringify(newVal))
    }, { deep: true })

    // --- Computed ---
    // Only show Pending or Cooking orders in Kitchen Display.
    // "Ready" orders disappear from here and appear on the Waiter screen.
    const pendingOrders = computed(() => {
      return orders.value.filter(o => o.status === 'Pending' || o.status === 'Cooking')
    })

    // --- Methods ---
    const changeStatus = async (id, newStatus) => {
      const index = orders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orders.value[index].status = newStatus

        if (newStatus === 'Ready') {
          $q.notify({
            color: 'positive',
            message: `Ticket #${id} is ready for service!`,
            icon: 'room_service',
            position: 'top-right'
          })
        } else {
          $q.notify({
            color: 'orange-9',
            message: `Cooking started for Ticket #${id}`,
            icon: 'local_fire_department',
            position: 'top-right'
          })
        }
      }
    }

    // --- Explicit Return ---
    return {
      orders,
      pendingOrders,
      isLoading,
      loadOrders,
      changeStatus
    }
  }
}
</script>

<style scoped>
/* Card & UI Polish */
.ticket-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #cfd8dc;
}
.border-grey {
  border: 1px solid #e0e0e0;
}
.opacity-50 {
  opacity: 0.5;
}

/* Vue Transition Group Classes */
.ticket-list-enter-active,
.ticket-list-leave-active {
  transition: all 0.4s ease;
}
.ticket-list-enter-from,
.ticket-list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(30px);
}
.ticket-list-leave-active {
  position: absolute;
}
</style>
