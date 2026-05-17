<template>
  <q-page class="bg-grey-2 q-pa-sm">
    <div class="row q-col-gutter-md full-height">
      <!-- Left Side: Product Selection -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="column full-height" style="border-radius: 12px; min-height: 85vh;">
          <q-card-section class="row items-center q-pb-none bg-white">
            <q-input outlined dense v-model="search" placeholder="Search product..." class="col" bg-color="grey-1">
              <template v-slot:append><q-icon name="search" /></template>
            </q-input>
            <q-select
              outlined dense
              v-model="activeCategory"
              :options="categories"
              label="Category"
              class="q-ml-sm col-4"
              bg-color="grey-1"
            />
          </q-card-section>

          <q-card-section class="col scroll q-mt-sm bg-grey-1">
            <div v-if="isLoadingProducts" class="flex flex-center q-pa-xl">
              <q-spinner-dots color="primary" size="3em" />
            </div>
            <div v-else class="row q-col-gutter-sm">
              <div v-for="product in filteredProducts" :key="product.id" class="col-6 col-sm-4 col-md-3">
                <q-card v-ripple class="cursor-pointer product-card shadow-1" @click="addToCart(product)">
                  <q-img :src="product.image" :ratio="1" style="height: 120px;">
                    <div class="absolute-bottom text-subtitle2 text-center q-pa-xs bg-black-5 text-weight-bold">
                      ৳ {{ formatMoney(product.price) }}
                    </div>
                  </q-img>
                  <q-card-section class="q-pa-sm text-center bg-white">
                    <div class="text-subtitle2 text-weight-bold ellipsis" :title="product.name">{{ product.name }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Right Side: Cart & Billing -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="column full-height bg-white" style="border-radius: 12px; min-height: 85vh;">
          <q-card-section class="bg-primary text-white row justify-between items-center">
            <div class="text-h6"><q-icon name="shopping_cart" class="q-mr-sm"/>Current Order</div>
            <q-btn flat round icon="delete_sweep" color="white" @click="clearCart" size="sm">
              <q-tooltip>Clear Cart</q-tooltip>
            </q-btn>
          </q-card-section>

          <!-- Order Details (Table/Customer) -->
          <q-card-section class="q-pb-none bg-grey-1">
            <div class="row q-col-gutter-sm">
              <q-input outlined dense v-model="customerName" label="Customer Name" class="col-7" bg-color="white" />
              <q-input outlined dense v-model="tableNumber" label="Table #" class="col-5" bg-color="white" />
            </div>
          </q-card-section>

          <!-- Cart Items -->
          <q-card-section class="col scroll q-pa-none">
            <q-list separator v-if="cart.length > 0">
              <q-item v-for="(item, index) in cart" :key="index" class="q-py-md">
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ item.name }}</q-item-label>
                  <q-item-label caption>৳ {{ formatMoney(item.price) }} x {{ item.qty }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row items-center q-gutter-xs">
                    <q-btn size="xs" round color="grey-3" text-color="black" icon="remove" @click="updateQty(index, -1)" />
                    <span class="text-weight-bold q-px-sm">{{ item.qty }}</span>
                    <q-btn size="xs" round color="grey-3" text-color="black" icon="add" @click="updateQty(index, 1)" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="flex flex-center full-height text-grey-5 q-pa-xl">
              <div class="text-center">
                <q-icon name="add_shopping_cart" size="64px" style="opacity: 0.5" />
                <div class="text-h6 q-mt-sm">Cart is empty</div>
              </div>
            </div>
          </q-card-section>

          <q-separator inset />

          <!-- Bill Summary -->
          <q-card-section class="q-pa-md bg-grey-1">
            <div class="row justify-between q-mb-xs text-grey-8">
              <span>Subtotal</span>
              <span>৳ {{ formatMoney(subtotal) }}</span>
            </div>
            <div class="row justify-between q-mb-xs text-grey-8">
              <span>VAT (5%)</span>
              <span>৳ {{ formatMoney(vatAmount) }}</span>
            </div>
            <div class="row justify-between text-h5 text-weight-bold text-primary q-mt-sm">
              <span>Total</span>
              <span>৳ {{ formatMoney(grandTotal) }}</span>
            </div>
            <q-btn
              color="positive"
              label="Place Order & Print"
              icon="print"
              class="full-width q-mt-md"
              size="lg"
              :loading="isProcessing"
              :disabled="cart.length === 0"
              @click="checkout"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const search = ref('')
    const activeCategory = ref('All')
    const cart = ref([])
    const customerName = ref('Walk-in')
    const tableNumber = ref('T-00')
    const isLoadingProducts = ref(false)
    const isProcessing = ref(false)

    const categories = ['All', 'Fast Food', 'Drinks', 'Platter', 'Dessert']
    const products = ref([])

    // Load Products (Simulated API Call)
    onMounted(async () => {
      isLoadingProducts.value = true
      await new Promise(res => setTimeout(res, 400))
      products.value = [
        { id: 1, name: 'Beef Burger Combo', price: 350, category: 'Fast Food', image: 'https://cdn.quasar.dev/img/parallax2.jpg' },
        { id: 2, name: 'Chicken Cheese Pizza', price: 850, category: 'Fast Food', image: 'https://cdn.quasar.dev/img/parallax1.jpg' },
        { id: 3, name: 'Pasta Alfredo', price: 450, category: 'Platter', image: 'https://cdn.quasar.dev/img/mountains.jpg' },
        { id: 4, name: 'Cold Coffee', price: 180, category: 'Drinks', image: 'https://cdn.quasar.dev/img/parallax2.jpg' },
        { id: 5, name: 'Chocolate Brownie', price: 220, category: 'Dessert', image: 'https://cdn.quasar.dev/img/parallax1.jpg' },
        { id: 6, name: 'BBQ Wings (6pcs)', price: 290, category: 'Fast Food', image: 'https://cdn.quasar.dev/img/mountains.jpg' }
      ]
      isLoadingProducts.value = false
    })

    const filteredProducts = computed(() => {
      return products.value.filter(p => {
        const matchCat = activeCategory.value === 'All' || p.category === activeCategory.value
        const matchSearch = p.name.toLowerCase().includes(search.value.toLowerCase())
        return matchCat && matchSearch
      })
    })

    const formatMoney = (val) => Number(val || 0).toLocaleString('en-IN')

    const subtotal = computed(() => cart.value.reduce((acc, item) => acc + (item.price * item.qty), 0))
    const vatAmount = computed(() => subtotal.value * 0.05)
    const grandTotal = computed(() => subtotal.value + vatAmount.value)

    const addToCart = (product) => {
      const existing = cart.value.find(i => i.id === product.id)
      if (existing) existing.qty++
      else cart.value.push({ ...product, qty: 1 })
    }

    const updateQty = (index, val) => {
      cart.value[index].qty += val
      if (cart.value[index].qty < 1) cart.value.splice(index, 1)
    }

    const clearCart = () => { cart.value = []; customerName.value = 'Walk-in'; tableNumber.value = 'T-00' }

    const checkout = async () => {
      isProcessing.value = true
      await new Promise(res => setTimeout(res, 800)) // Fake API

      const orderId = `ORD-${Math.floor(Math.random() * 9000) + 1000}`
      const invoiceId = `INV-${Math.floor(Math.random() * 90000) + 10000}`
      const today = new Date().toISOString().split('T')[0]

      // 1. Save to Invoices
      const newInvoice = {
        id: invoiceId, date: today, customer: customerName.value,
        totalRaw: grandTotal.value, total: `৳ ${formatMoney(grandTotal.value)}`, status: 'Paid', items: [...cart.value]
      }
      const existingInvoices = JSON.parse(localStorage.getItem('saas_invoices') || '[]')
      existingInvoices.unshift(newInvoice)
      localStorage.setItem('saas_invoices', JSON.stringify(existingInvoices))

      // 2. Save to Live Orders (For Kitchen & Order Management)
      const newOrder = {
        id: orderId, table: tableNumber.value, status: 'Pending', time: 'Just now', priority: 'Normal', items: [...cart.value]
      }
      const existingOrders = JSON.parse(localStorage.getItem('saas_live_orders') || '[]')
      existingOrders.unshift(newOrder)
      localStorage.setItem('saas_live_orders', JSON.stringify(existingOrders))

      $q.notify({ color: 'positive', message: `Order ${orderId} Placed & Billed!`, icon: 'check_circle' })
      clearCart()
      isProcessing.value = false
    }

    return {
      search, activeCategory, categories, cart, customerName, tableNumber,
      filteredProducts, isLoadingProducts, isProcessing,
      subtotal, vatAmount, grandTotal, formatMoney,
      addToCart, updateQty, clearCart, checkout
    }
  }
}
</script>

<style scoped>
.product-card { border-radius: 12px; overflow: hidden; transition: transform 0.2s; border: 1px solid transparent; }
.product-card:hover { transform: translateY(-3px); border-color: var(--q-primary); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
.bg-black-5 { background: rgba(0, 0, 0, 0.5); color: white; }
</style>
