<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold text-dark">
        <q-icon name="room_service" class="q-mr-sm text-green-7" /> Ready to Serve
      </div>
      <div class="row q-gutter-sm items-center">
        <q-badge color="green-6" class="q-pa-sm text-subtitle2 shadow-1 text-weight-bold">
          Pending: {{ readyOrders.length }}
        </q-badge>
        <q-btn outline color="primary" icon="refresh" label="Refresh" @click="loadData" :loading="isLoading" class="bg-white" />
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-center" style="height: 40vh;">
      <q-spinner-dots color="green-6" size="4em" />
    </div>

    <div v-else-if="readyOrders.length === 0" class="flex flex-center column text-grey-6" style="height: 50vh;">
      <q-icon name="check_circle_outline" size="5em" class="opacity-50 q-mb-md" />
      <div class="text-h5 text-weight-medium">All caught up!</div>
      <div class="text-subtitle1 q-mt-sm">No orders are waiting to be served.</div>
    </div>

    <transition-group v-else name="list" tag="div" class="row q-col-gutter-md">
      <div v-for="order in readyOrders" :key="order.id" class="col-12 col-md-6 col-lg-4">
        <q-card flat bordered class="serve-card shadow-1 bg-green-1 border-green">

          <q-card-section class="row justify-between items-center q-pb-sm">
            <div class="row items-center no-wrap">
              <q-avatar color="green-6" text-color="white" icon="outdoor_grill" size="md" class="q-mr-sm shadow-1" />
              <div>
                <div class="text-h6 text-weight-bold text-dark" style="line-height: 1.2;">
                  Table #{{ order.table }}
                </div>
                <div class="text-caption text-green-9 text-weight-bold">
                  Order ID: {{ order.id }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <q-badge color="orange-8" class="q-px-sm text-weight-bold">
                <q-icon name="timer" class="q-mr-xs" /> {{ order.time || 'Ready now' }}
              </q-badge>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-list dense separator class="bg-white rounded-borders q-mt-sm" style="border: 1px solid #c8e6c9;">
              <q-item v-for="(item, index) in order.items" :key="index" class="q-py-sm">
                <q-item-section>
                  <q-item-label class="text-weight-bold text-dark">{{ item.name }}</q-item-label>
                  <q-item-label caption v-if="item.note" class="text-red-6 text-weight-medium">
                    * {{ item.note }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="grey-3" text-color="dark" class="text-weight-bolder text-subtitle2">
                    x{{ item.qty }}
                  </q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator color="green-2" />

          <q-card-actions align="right" class="q-pa-sm">
            <q-btn
              unelevated
              color="green-7"
              label="Mark as Served"
              icon="check_circle"
              class="full-width text-weight-bold"
              size="md"
              @click="markServed(order.id)"
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
    const isLoading = ref(false)
    const allOrders = ref([])

    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400)) // Simulated API Delay

      const savedOrders = localStorage.getItem('saas_live_orders')
      if (savedOrders) {
        allOrders.value = JSON.parse(savedOrders)
      } else {
        // Fallback dummy data mapped to your POS structure
        allOrders.value = [
          {
            id: 'ORD-1005', table: '04', time: '2 mins ago', status: 'Ready',
            items: [{ name: 'BBQ Wings', qty: 2, note: 'Extra spicy' }]
          },
          {
            id: 'ORD-1008', table: '02', time: '5 mins ago', status: 'Ready',
            items: [{ name: 'Iced Tea', qty: 3, note: '' }, { name: 'Classic Burger', qty: 1, note: '' }]
          }
        ]
        localStorage.setItem('saas_live_orders', JSON.stringify(allOrders.value))
      }

      isLoading.value = false
    }

    onMounted(() => loadData())

    // Auto-save changes back to LocalStorage (Syncs with POS and Kitchen)
    watch(allOrders, (newVal) => {
      localStorage.setItem('saas_live_orders', JSON.stringify(newVal))
    }, { deep: true })

    // Computed property to only show orders marked as 'Ready' by the Kitchen
    const readyOrders = computed(() => {
      return allOrders.value.filter(order => order.status === 'Ready')
    })

    const markServed = (id) => {
      const index = allOrders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        // Change status to 'Served' instead of deleting, preserving billing history
        allOrders.value[index].status = 'Served'

        $q.notify({
          color: 'positive',
          message: `Order #${id} has been served!`,
          icon: 'done_all',
          position: 'top-right'
        })
      }
    }

    // --- Explicit Return ---
    return {
      isLoading,
      readyOrders,
      loadData,
      markServed
    }
  }
}
</script>

<style scoped>
.serve-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.serve-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1) !important;
}
.border-green {
  border: 1px solid #81c784 !important;
}
.opacity-50 {
  opacity: 0.5;
}

/* Vue Transition Group Classes */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateX(30px);
}
.list-leave-active {
  position: absolute;
}
</style>
