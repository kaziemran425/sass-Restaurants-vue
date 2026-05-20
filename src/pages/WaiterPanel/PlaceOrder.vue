<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-red-13">
        <q-icon name="room_service" class="q-mr-sm text-red-13" /> Take New Order
      </div>
      <q-btn flat round icon="history" color="primary" to="/waiter/tables">
        <q-tooltip>Table View</q-tooltip>
      </q-btn>
    </div>

    <div class="row q-col-gutter-sm q-mb-md">
      <q-select
        outlined
        dense
        v-model="selectedTable"
        :options="tableOptions"
        label="Select Table Number *"
        class="col-12 col-md-4"
        bg-color="white"
      />
      <q-input
        outlined
        dense
        v-model="search"
        placeholder="Search dish..."
        class="col-12 col-md-8"
        bg-color="white"
        clearable
      >
        <template v-slot:append><q-icon name="search" /></template>
      </q-input>
    </div>

    <q-card flat bordered style="border-radius: 12px; height: 60vh;" class="bg-white">
      <q-scroll-area class="full-height">
        <q-list separator>
          <q-item v-for="item in filteredMenu" :key="item.id" class="q-py-md">
            <q-item-section>
              <q-item-label class="text-weight-bold text-subtitle1 text-dark">{{ item.name }}</q-item-label>
              <q-item-label caption class="text-primary text-weight-medium">৳ {{ formatMoney(item.price) }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn color="primary" icon="add" round size="sm" unelevated @click="addToCart(item)" />
            </q-item-section>
          </q-item>

          <q-item v-if="filteredMenu.length === 0" class="flex flex-center text-grey-6 q-pa-xl column">
             <q-icon size="4em" name="restaurant_menu" class="q-mb-md opacity-50" />
            <q-item-section class="text-h6 text-center">No menu items found</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-card>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        color="secondary"
        icon="shopping_cart"
        class="shadow-10"
        @click="reviewOrder = true"
      >
        <q-badge color="red" floating v-if="cart.length > 0">{{ cart.length }}</q-badge>
      </q-btn>
    </q-page-sticky>

    <q-dialog v-model="reviewOrder" persistent>
      <q-card style="min-width: 450px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row justify-between items-center q-pb-md">
          <div class="text-h6">Table #{{ selectedTable }} Summary</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-none">
          <q-list separator v-if="cart.length > 0">
            <q-item v-for="(c, i) in cart" :key="i" class="q-py-sm">
              <q-item-section>
                <q-item-label class="text-weight-bold text-dark">{{ c.name }}</q-item-label>
                <q-input v-model="c.note" dense placeholder="Add note (e.g. no onions)..." class="q-mt-xs" />
              </q-item-section>
              <q-item-section side>
                <div class="row items-center q-gutter-sm bg-grey-2 rounded-borders q-pa-xs">
                  <q-btn size="xs" round flat color="negative" icon="remove" @click="updateQty(i, -1)" />
                  <span class="text-weight-bold text-dark q-px-sm">{{ c.qty }}</span>
                  <q-btn size="xs" round flat color="positive" icon="add" @click="updateQty(i, 1)" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="q-pa-xl text-center text-grey-6 flex flex-center column">
            <q-icon name="remove_shopping_cart" size="3em" class="q-mb-sm opacity-50" />
            No items selected
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="bg-grey-1 text-h6 text-weight-bold row justify-between items-center q-py-md">
          <span>Total:</span>
          <span class="text-primary">৳ {{ formatMoney(cartTotal) }}</span>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-2">
          <q-btn flat label="Cancel" color="grey-8" v-close-popup />
          <q-btn
            color="primary"
            label="Send to Kitchen"
            icon="send"
            unelevated
            @click="confirmOrder"
            :disable="cart.length === 0"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()

    // --- State Variables ---
    const selectedTable = ref('T-01')
    const search = ref('')
    const reviewOrder = ref(false)
    const cart = ref([])
    const menuItems = ref([])

    const tableOptions = ['T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06', 'T-07', 'T-08']

    // --- Core Logic ---
    onMounted(() => {
      // Load menu from LocalStorage (Syncs with Kitchen Panel)
      const savedMenu = localStorage.getItem('saas_menu_items')
      if (savedMenu) {
        // Only load items that the kitchen has marked as available
        menuItems.value = JSON.parse(savedMenu).filter(i => i.isAvailable)
      } else {
        // Fallback default menu
        menuItems.value = [
          { id: 1, name: 'Beef Burger Combo', price: 450 },
          { id: 2, name: 'Chicken Pasta Alfredo', price: 350 },
          { id: 3, name: 'BBQ Chicken Pizza (L)', price: 850 },
          { id: 4, name: 'Cold Coffee', price: 180 },
          { id: 5, name: 'French Fries', price: 120 }
        ]
      }
    })

    // --- Computed ---
    const filteredMenu = computed(() => {
      if (!search.value) return menuItems.value

      const lowerSearch = search.value.toLowerCase()
      return menuItems.value.filter(item =>
        item.name.toLowerCase().includes(lowerSearch)
      )
    })

    const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + (item.price * item.qty), 0))

    // --- Methods ---
    const formatMoney = (val) => Number(val || 0).toLocaleString('en-IN')

    const addToCart = (item) => {
      const existing = cart.value.find(i => i.id === item.id)
      if (existing) {
        existing.qty++
      } else {
        cart.value.push({ ...item, qty: 1, note: '' })
      }

      $q.notify({
        type: 'positive',
        message: `${item.name} added to cart`,
        timeout: 500,
        position: 'top-right'
      })
    }

    const updateQty = (index, val) => {
      cart.value[index].qty += val
      if (cart.value[index].qty < 1) {
        cart.value.splice(index, 1)
      }
    }

    const confirmOrder = () => {
      // 1. Prepare Order Object
      const newOrder = {
        id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        table: selectedTable.value.replace('T-', ''), // Standardize table numbers
        time: 'Just now',
        priority: 'Normal', // Default priority for waiter app
        status: 'Pending',
        items: [...cart.value]
      }

      // 2. Save to Live Orders (Syncs with Kitchen Queue Manager)
      const existingOrders = JSON.parse(localStorage.getItem('saas_live_orders') || '[]')
      existingOrders.unshift(newOrder) // Push to top of queue
      localStorage.setItem('saas_live_orders', JSON.stringify(existingOrders))

      // 3. Cleanup
      $q.notify({
        color: 'positive',
        message: 'Order successfully sent to kitchen!',
        icon: 'check_circle',
        position: 'top-right'
      })

      cart.value = []
      reviewOrder.value = false
    }

    // --- Explicit Return ---
    return {
      selectedTable,
      search,
      reviewOrder,
      cart,
      tableOptions,
      menuItems,
      filteredMenu,
      formatMoney,
      cartTotal,
      addToCart,
      updateQty,
      confirmOrder
    }
  }
}
</script>

<style scoped>
.opacity-50 {
  opacity: 0.5;
}
</style>
