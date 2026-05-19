<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">
        <q-icon name="list_alt" class="q-mr-sm text-primary" /> Live Orders Management
      </div>
      <q-btn outline color="primary" icon="refresh" label="Sync Orders" @click="loadOrders" :loading="isLoading" />
    </div>

    <div v-if="isLoading" class="flex flex-center" style="height: 40vh;">
      <q-spinner-dots color="primary" size="3em" />
    </div>

    <div v-else-if="liveOrders.length === 0" class="flex flex-center column text-grey q-pa-xl" style="height: 50vh;">
      <q-icon name="done_all" size="5em" color="grey-4" />
      <div class="text-h5 q-mt-md text-grey-8">All caught up!</div>
      <div class="text-subtitle1">No live orders at the moment.</div>
    </div>

    <transition-group v-else name="order-list" tag="div" class="row q-col-gutter-md">
      <div v-for="order in liveOrders" :key="order.id" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="order-card shadow-1 column full-height" style="border-radius: 12px; overflow: hidden;">

          <q-card-section class="row justify-between items-center q-pa-sm" :class="getStatusClass(order.status)">
            <div>
              <div class="text-h6 text-weight-bold" style="line-height: 1.2;">Table: {{ order.table }}</div>
              <div class="text-caption text-grey-9">ID: {{ order.id }}</div>
            </div>
            <q-badge :color="getStatusBadgeColor(order.status)" class="q-pa-sm text-subtitle2 shadow-1 text-weight-bold">
              {{ order.status }}
            </q-badge>
          </q-card-section>

          <q-card-section class="col q-pa-none bg-white scroll" style="max-height: 250px;">
            <q-list dense separator>
              <q-item v-for="item in order.items" :key="item.name" class="q-py-sm">
                <q-item-section class="text-weight-medium text-grey-9">{{ item.name }}</q-item-section>
                <q-item-section side>
                  <div class="text-weight-bold text-dark bg-grey-3 q-px-sm q-py-xs" style="border-radius: 6px;">
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
              size="sm"
              icon="cancel"
              @click="confirmCancel(order.id)"
            />

            <q-btn
              v-if="order.status === 'Pending'"
              unelevated
              color="deep-orange"
              label="Start Cooking"
              icon="local_fire_department"
              size="sm"
              class="text-weight-bold"
              @click="updateOrderStatus(order.id, 'Cooking')"
            />

            <q-btn
              v-else-if="order.status === 'Cooking'"
              unelevated
              color="green-6"
              label="Mark Ready"
              icon="room_service"
              size="sm"
              class="text-weight-bold"
              @click="updateOrderStatus(order.id, 'Ready')"
            />

            <q-btn
              v-else-if="order.status === 'Ready'"
              unelevated
              color="primary"
              label="Complete Order"
              icon="done_all"
              size="sm"
              class="text-weight-bold"
              @click="updateOrderStatus(order.id, 'Completed')"
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
    const isLoading = ref(false)
    const liveOrders = ref([])

    const loadOrders = async () => {
      isLoading.value = true
      // Simulated API delay
      await new Promise(res => setTimeout(res, 500))

      const saved = localStorage.getItem('saas_live_orders')
      if (saved) {
        liveOrders.value = JSON.parse(saved)
      } else {
        // Dummy data if empty
        liveOrders.value = [
          { id: 'ORD-101', table: 'T-05', status: 'Cooking', items: [{ name: 'Chicken Pizza', qty: 1 }, { name: 'Coke', qty: 2 }] },
          { id: 'ORD-102', table: 'T-02', status: 'Pending', items: [{ name: 'Pasta Alfredo', qty: 1 }] },
          { id: 'ORD-103', table: 'T-08', status: 'Ready', items: [{ name: 'Beef Burger Combo', qty: 2 }] }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadOrders())

    // Auto save to localStorage when orders change
    watch(liveOrders, (newVal) => {
      localStorage.setItem('saas_live_orders', JSON.stringify(newVal))
    }, { deep: true })

    const confirmCancel = (id) => {
      $q.dialog({
        title: 'Cancel Order',
        message: 'Are you sure you want to cancel this order?',
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(() => {
        updateOrderStatus(id, 'Cancelled')
      })
    }

    const updateOrderStatus = async (id, newStatus) => {
      // Find the order index safely
      const index = liveOrders.value.findIndex(o => o.id === id)
      if (index === -1) return

      if (newStatus === 'Cancelled' || newStatus === 'Completed') {
        // Remove from the live orders array
        liveOrders.value.splice(index, 1)

        $q.notify({
          color: newStatus === 'Completed' ? 'positive' : 'negative',
          message: `Order ${id} marked as ${newStatus}`,
          icon: newStatus === 'Completed' ? 'check_circle' : 'cancel',
          position: 'top-right'
        })
      } else {
        // Progress to next status
        liveOrders.value[index].status = newStatus

        $q.notify({
          color: 'info',
          message: `Order ${id} is now ${newStatus}`,
          icon: 'info',
          position: 'top-right'
        })
      }
    }

    const getStatusClass = (status) => {
      if (status === 'Pending') return 'bg-amber-2 text-amber-10'
      if (status === 'Cooking') return 'bg-orange-2 text-orange-10'
      if (status === 'Ready') return 'bg-green-2 text-green-10'
      return 'bg-grey-3 text-grey-9'
    }

    const getStatusBadgeColor = (status) => {
      if (status === 'Pending') return 'amber-9'
      if (status === 'Cooking') return 'deep-orange-6'
      if (status === 'Ready') return 'green-7'
      return 'grey-8'
    }

    // Explicitly return everything needed in the template
    return {
      liveOrders,
      isLoading,
      loadOrders,
      confirmCancel,
      updateOrderStatus,
      getStatusClass,
      getStatusBadgeColor
    }
  }
}
</script>

<style scoped>
.order-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
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
