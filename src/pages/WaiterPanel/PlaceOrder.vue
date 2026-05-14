<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-weight-bold">Take New Order</div>
      <q-btn flat round icon="history" color="primary" to="/waiter/tables" />
    </div>

    <!-- Table Selection -->
    <q-select
      filled
      v-model="selectedTable"
      :options="tableOptions"
      label="Select Table Number"
      class="q-mb-md"
    />

    <!-- Quick Item Search -->
    <q-input filled v-model="search" placeholder="Search dish..." dense class="q-mb-md">
      <template v-slot:append><q-icon name="search" /></template>
    </q-input>

    <!-- Item List -->
    <q-scroll-area style="height: 400px">
      <q-list bordered separator class="bg-white rounded-borders">
        <q-item v-for="item in menuItems" :key="item.id">
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
            <q-item-label caption>৳ {{ item.price }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn color="primary" icon="add" round size="sm" @click="addToCart(item)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>

    <!-- Order Summary Floating Button -->
    <q-page-sticky position="bottom" :offset="[0, 18]">
      <q-btn
        color="secondary"
        label="Review Order"
        icon="shopping_cart"
        class="q-px-xl shadow-10"
        @click="reviewOrder = true"
      />
    </q-page-sticky>

    <!-- Review Dialog -->
    <q-dialog v-model="reviewOrder">
      <q-card style="min-width: 350px">
        <q-card-section class="text-h6">Table #{{ selectedTable }} Summary</q-card-section>
        <q-card-section v-if="cart.length === 0">No items selected</q-card-section>
        <q-list v-else separator>
          <q-item v-for="(c, i) in cart" :key="i">
            <q-item-section>{{ c.name }}</q-item-section>
            <q-item-section side>x{{ c.qty }}</q-item-section>
          </q-item>
        </q-list>
        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
          <q-btn color="primary" label="Send to Kitchen" @click="confirmOrder" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const selectedTable = ref('T-01')
    const search = ref('')
    const reviewOrder = ref(false)
    const cart = ref([])

    const tableOptions = ['T-01', 'T-02', 'T-03', 'T-04', 'T-05']
    const menuItems = ref([
      { id: 1, name: 'Classic Burger', price: 250 },
      { id: 2, name: 'Cheese Pizza', price: 650 },
      { id: 3, name: 'Cold Coffee', price: 180 }
    ])

    const addToCart = (item) => {
      cart.value.push({ ...item, qty: 1 })
    }

    const confirmOrder = () => {
      $q.notify({ color: 'positive', message: 'Order sent to kitchen!', icon: 'restaurant' })
      cart.value = []
      reviewOrder.value = false
    }

    return { selectedTable, search, reviewOrder, cart, tableOptions, menuItems, addToCart, confirmOrder }
  }
}
</script>
