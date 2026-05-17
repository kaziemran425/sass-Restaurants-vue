<template>
  <q-page class="bg-grey-1">
    <!-- Sticky Header -->
    <q-header elevated class="bg-white text-primary">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" to="/menu" />
        <q-toolbar-title class="text-weight-bold text-capitalize">
          {{ formattedCategoryName }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-center q-mt-xl">
      <q-spinner-dots color="primary" size="3em" />
    </div>

    <!-- Product List -->
    <div v-else class="q-pa-md q-mt-sm">
      <q-list separator class="bg-white shadow-1" style="border-radius: 12px; overflow: hidden;">
        <q-item v-for="product in products" :key="product.id" class="q-py-md product-item">
          <q-item-section avatar>
            <q-img
              :src="product.image"
              style="width: 85px; height: 85px; border-radius: 12px"
              class="shadow-2"
            />
          </q-item-section>

          <q-item-section class="q-pl-sm">
            <q-item-label class="text-subtitle1 text-weight-bold">{{ product.name }}</q-item-label>
            <q-item-label caption lines="2" class="text-grey-7">{{ product.description }}</q-item-label>
            <q-item-label class="text-primary text-weight-bold q-mt-sm text-subtitle1">
              ৳ {{ formatMoney(product.price) }}
            </q-item-label>
          </q-item-section>

          <q-item-section side class="justify-end">
            <!-- Add Button or Qty Controls -->
            <q-btn v-if="getCartQty(product.id) === 0"
              unelevated rounded color="primary" icon="add" size="sm" class="q-px-sm"
              @click="updateCart(product, 1)"
            />
            <div v-else class="row items-center bg-grey-2 q-pa-xs rounded-borders" style="border-radius: 20px;">
              <q-btn flat round dense color="negative" icon="remove" size="sm" @click="updateCart(product, -1)" />
              <span class="text-weight-bold q-px-sm text-subtitle2">{{ getCartQty(product.id) }}</span>
              <q-btn flat round dense color="positive" icon="add" size="sm" @click="updateCart(product, 1)" />
            </div>
          </q-item-section>
        </q-item>

        <q-item v-if="products.length === 0">
          <q-item-section class="text-center text-grey q-py-xl">
            No items available in this category.
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Floating Cart Badge -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="cartTotalQty > 0">
      <q-btn fab icon="shopping_basket" color="negative" @click="cartDialog = true" class="shadow-5">
        <q-badge color="white" text-color="negative" floating rounded class="text-weight-bold">
          {{ cartTotalQty }}
        </q-badge>
      </q-btn>
    </q-page-sticky>

    <!-- Bottom Sheet Cart Dialog -->
    <q-dialog v-model="cartDialog" position="bottom">
      <q-card style="width: 100%; border-top-left-radius: 20px; border-top-right-radius: 20px;">
        <q-card-section class="row items-center justify-between q-pb-sm">
          <div class="text-h6 text-weight-bold">Your Order</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="scroll q-pt-none" style="max-height: 50vh;">
          <q-list separator>
            <q-item v-for="item in cart" :key="item.id" class="q-px-none">
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ item.name }}</q-item-label>
                <q-item-label caption>৳ {{ formatMoney(item.price) }} x {{ item.qty }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row items-center bg-grey-2 q-pa-xs rounded-borders" style="border-radius: 20px;">
                  <q-btn flat round dense color="negative" icon="remove" size="xs" @click="updateCart(item, -1)" />
                  <span class="text-weight-bold q-px-sm">{{ item.qty }}</span>
                  <q-btn flat round dense color="positive" icon="add" size="xs" @click="updateCart(item, 1)" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-section class="bg-grey-1">
          <div class="row justify-between text-h6 text-weight-bold q-mb-md">
            <span>Total Bill:</span>
            <span class="text-primary">৳ {{ formatMoney(cartTotalPrice) }}</span>
          </div>
          <q-btn
            unelevated
            color="positive"
            label="Send Order to Kitchen"
            class="full-width q-py-sm text-subtitle1 text-weight-bold rounded-borders"
            icon="room_service"
            :loading="isPlacingOrder"
            @click="placeOrder"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default {
  name: 'QrMenuCategory',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()
    const categoryId = ref(route.params.id || 'Category')

    const isLoading = ref(false)
    const isPlacingOrder = ref(false)
    const cartDialog = ref(false)

    const products = ref([])
    const cart = ref([])

    const formattedCategoryName = computed(() => {
      return categoryId.value.replace('-', ' ')
    })

    const formatMoney = (val) => Number(val).toLocaleString('en-IN')

    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 500)) // Fetch delay

      // Filter dummy data based on category (Simulation)
      if(categoryId.value === 'drinks') {
        products.value = [
          { id: 4, name: 'Cold Coffee', description: 'Chilled coffee with vanilla ice cream.', price: 180, image: 'https://cdn.quasar.dev/img/parallax2.jpg' },
          { id: 5, name: 'Lemon Mint Mojito', description: 'Refreshing summer drink.', price: 150, image: 'https://cdn.quasar.dev/img/mountains.jpg' }
        ]
      } else {
        products.value = [
          { id: 1, name: 'Classic Beef Burger', description: 'Juicy beef patty with special sauce and fresh lettuce.', price: 350, image: 'https://cdn.quasar.dev/img/parallax2.jpg' },
          { id: 2, name: 'Crispy Chicken Burger', description: 'Deep fried chicken breast with mayo and pickles.', price: 280, image: 'https://cdn.quasar.dev/img/mountains.jpg' },
          { id: 3, name: 'Cheese Blast Burger', description: 'Extra cheese with double patty and caramelized onions.', price: 450, image: 'https://cdn.quasar.dev/img/parallax1.jpg' }
        ]
      }

      // Load cart from local storage
      const savedCart = localStorage.getItem('saas_qr_cart')
      if(savedCart) cart.value = JSON.parse(savedCart)

      isLoading.value = false
    }

    onMounted(() => loadData())

    // Save cart to local storage whenever it changes
    watch(cart, (newVal) => {
      localStorage.setItem('saas_qr_cart', JSON.stringify(newVal))
      if (newVal.length === 0) cartDialog.value = false // Close dialog if empty
    }, { deep: true })

    // Cart Computed Properties
    const cartTotalQty = computed(() => cart.value.reduce((sum, item) => sum + item.qty, 0))
    const cartTotalPrice = computed(() => cart.value.reduce((sum, item) => sum + (item.price * item.qty), 0))

    const getCartQty = (id) => {
      const item = cart.value.find(i => i.id === id)
      return item ? item.qty : 0
    }

    const updateCart = (product, change) => {
      const index = cart.value.findIndex(i => i.id === product.id)
      if (index !== -1) {
        cart.value[index].qty += change
        if (cart.value[index].qty <= 0) cart.value.splice(index, 1)
      } else if (change > 0) {
        cart.value.push({ id: product.id, name: product.name, price: product.price, qty: 1 })
      }
    }

    // Connect QR Order Directly to Kitchen & POS!
    const placeOrder = async () => {
      isPlacingOrder.value = true
      await new Promise(res => setTimeout(res, 1000)) // Simulated API Call

      const tableNumber = localStorage.getItem('saas_qr_table') || 'T-04'
      const newOrder = {
        id: `QR-${Math.floor(Math.random() * 9000) + 1000}`,
        table: tableNumber,
        status: 'Pending',
        time: 'Just now',
        priority: 'Normal',
        items: [...cart.value]
      }

      // Push to Central SaaS Live Orders
      const existingOrders = JSON.parse(localStorage.getItem('saas_live_orders') || '[]')
      existingOrders.unshift(newOrder)
      localStorage.setItem('saas_live_orders', JSON.stringify(existingOrders))

      // Clear Customer Cart
      cart.value = []
      isPlacingOrder.value = false
      cartDialog.value = false

      $q.notify({
        color: 'positive',
        message: 'Order sent to Kitchen successfully!',
        icon: 'room_service',
        position: 'top',
        timeout: 3000
      })

      router.push('/menu') // Go back to home
    }

    return {
      categoryId, formattedCategoryName, products, cart, cartDialog,
      isLoading, isPlacingOrder, cartTotalQty, cartTotalPrice,
      formatMoney, getCartQty, updateCart, placeOrder
    }
  }
}
</script>

<style scoped>
.product-item {
  transition: background 0.3s ease;
}
.product-item:active {
  background: #f0f0f0;
}
</style>
