<template>
  <q-page class="bg-grey-2 q-pa-sm">
    <div class="row q-col-gutter-md full-height">

      <div class="col-12 col-md-8">
        <q-card flat bordered class="column full-height" style="border-radius: 12px; height: 88vh;">
          <q-card-section class="bg-white q-pb-sm">
            <div class="row items-center q-gutter-sm">
              <q-input
                outlined
                dense
                v-model="search"
                placeholder="Search product..."
                class="col"
                bg-color="grey-1"
                clearable
              >
                <template v-slot:prepend><q-icon name="search" /></template>
              </q-input>
            </div>

            <div class="row q-gutter-xs q-mt-sm no-wrap overflow-auto hide-scrollbar">
              <q-chip
                v-for="cat in categories"
                :key="cat"
                clickable
                :outline="activeCategory !== cat"
                :color="activeCategory === cat ? 'primary' : 'grey-7'"
                :text-color="activeCategory === cat ? 'white' : 'grey-9'"
                @click="activeCategory = cat"
                class="text-weight-bold"
              >
                {{ cat }}
              </q-chip>
            </div>
          </q-card-section>

          <q-card-section class="col scroll bg-grey-1 q-pt-md">
            <div v-if="isLoadingProducts" class="flex flex-center full-height">
              <q-spinner-dots color="primary" size="3em" />
            </div>

            <div v-else-if="filteredProducts.length === 0" class="flex flex-center full-height text-grey-5 column">
              <q-icon name="search_off" size="4em" />
              <div class="text-h6 q-mt-sm">No products found</div>
            </div>

            <div v-else class="row q-col-gutter-sm">
              <div v-for="product in filteredProducts" :key="product.id" class="col-6 col-sm-4 col-md-3">
                <q-card v-ripple class="cursor-pointer product-card shadow-1 column full-height" @click="addToCart(product)">
                  <q-img :src="product.image" :ratio="1" style="height: 120px;">
                    <div class="absolute-bottom text-subtitle2 text-center q-pa-xs bg-black-5 text-weight-bold">
                      ৳ {{ formatMoney(product.price) }}
                    </div>
                  </q-img>
                  <q-card-section class="q-pa-sm text-center bg-white col flex flex-center">
                    <div class="text-subtitle2 text-weight-bold" style="line-height: 1.2;">{{ product.name }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="column full-height bg-white" style="border-radius: 12px; height: 88vh;">
          <q-card-section class="bg-teal-14 text-white row justify-between items-center q-py-sm">
            <div class="text-h6"><q-icon name="shopping_cart" class="q-mr-sm"/>Current Order</div>
            <q-btn flat round icon="delete_sweep" color="white" @click="confirmClearCart" size="sm" :disable="cart.length === 0">
              <q-tooltip>Clear Cart</q-tooltip>
            </q-btn>
          </q-card-section>

          <q-card-section class="bg-grey-1 q-pb-sm">
            <div class="row q-col-gutter-sm">
              <q-input outlined dense v-model="customerName" label="Customer Name" class="col-7" bg-color="white" />
              <q-input outlined dense v-model="tableNumber" label="Table #" class="col-5" bg-color="white" />
            </div>
          </q-card-section>

          <q-card-section class="col scroll q-pa-none">
            <q-list separator v-if="cart.length > 0">
              <q-item v-for="(item, index) in cart" :key="index" class="q-py-md">
                <q-item-section>
                  <q-item-label class="text-weight-bold" lines="2">{{ item.name }}</q-item-label>
                  <q-item-label caption class="text-teal-14 text-weight-medium">
                    ৳ {{ formatMoney(item.price) }} x {{ item.qty }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="row items-center q-gutter-xs bg-grey-2 rounded-borders q-pa-xs">
                    <q-btn size="xs" round flat color="negative" icon="remove" @click="updateQty(index, -1)" />
                    <span class="text-weight-bold q-px-sm text-dark">{{ item.qty }}</span>
                    <q-btn size="xs" round flat color="positive" icon="add" @click="updateQty(index, 1)" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>

            <div v-else class="flex flex-center full-height text-grey-5 column q-pa-xl">
              <q-icon name="add_shopping_cart" size="64px" color="grey-4" />
              <div class="text-h6 q-mt-sm text-grey-6">Cart is empty</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-md bg-grey-1">
            <div class="row justify-between q-mb-xs text-grey-8">
              <span>Subtotal</span>
              <span class="text-weight-medium">৳ {{ formatMoney(subtotal) }}</span>
            </div>
            <div class="row justify-between q-mb-xs text-grey-8">
              <span>VAT (5%)</span>
              <span class="text-weight-medium">৳ {{ formatMoney(vatAmount) }}</span>
            </div>

            <q-separator class="q-my-sm" />

            <div class="row justify-between text-h5 text-weight-bold text-teal-14 q-mb-md">
              <span>Total</span>
              <span>৳ {{ formatMoney(grandTotal) }}</span>
            </div>

            <q-btn
              color="teal-14"
              label="Place Order & Print"
              icon="print"
              class="full-width text-weight-bold"
              size="lg"
              :loading="isProcessing"
              :disable="cart.length === 0"
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
      if (existing) {
        existing.qty++
      } else {
        cart.value.unshift({ ...product, qty: 1 }) // Unshift adds to the top of the list, better for POS visibility
      }
    }

    const updateQty = (index, val) => {
      cart.value[index].qty += val
      if (cart.value[index].qty < 1) {
        cart.value.splice(index, 1)
      }
    }

    const clearCartData = () => {
      cart.value = []
      customerName.value = 'Walk-in'
      tableNumber.value = 'T-00'
    }

    const confirmClearCart = () => {
      $q.dialog({
        title: 'Clear Cart',
        message: 'Are you sure you want to remove all items from this order?',
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(() => {
        clearCartData()
      })
    }

    const checkout = async () => {
      isProcessing.value = true
      await new Promise(res => setTimeout(res, 800)) // Fake API

      const orderId = `ORD-${Math.floor(Math.random() * 9000) + 1000}`
      const invoiceId = `INV-${Math.floor(Math.random() * 90000) + 10000}`
      const today = new Date().toISOString().split('T')[0]

      // 1. Save to Invoices
      const newInvoice = {
        id: invoiceId,
        date: today,
        customer: customerName.value,
        totalRaw: grandTotal.value,
        total: `৳ ${formatMoney(grandTotal.value)}`,
        status: 'Paid',
        items: [...cart.value]
      }
      const existingInvoices = JSON.parse(localStorage.getItem('saas_invoices') || '[]')
      existingInvoices.unshift(newInvoice)
      localStorage.setItem('saas_invoices', JSON.stringify(existingInvoices))

      // 2. Save to Live Orders
      const newOrder = {
        id: orderId,
        table: tableNumber.value,
        status: 'Pending',
        time: 'Just now',
        priority: 'Normal',
        items: [...cart.value]
      }
      const existingOrders = JSON.parse(localStorage.getItem('saas_live_orders') || '[]')
      existingOrders.unshift(newOrder)
      localStorage.setItem('saas_live_orders', JSON.stringify(existingOrders))

      $q.notify({
        color: 'positive',
        message: `Order ${orderId} Placed successfully!`,
        icon: 'check_circle',
        position: 'top-right'
      })

      clearCartData()
      isProcessing.value = false
    }

    return {
      search,
      activeCategory,
      categories,
      cart,
      customerName,
      tableNumber,
      filteredProducts,
      isLoadingProducts,
      isProcessing,
      subtotal,
      vatAmount,
      grandTotal,
      formatMoney,
      addToCart,
      updateQty,
      confirmClearCart,
      checkout
    }
  }
}
</script>

<style scoped>
.product-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  border: 2px solid transparent;
}
.product-card:hover {
  transform: translateY(-3px);
  border-color: var(--q-primary);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
}
.bg-black-5 {
  background: rgba(0, 0, 0, 0.6);
  color: white;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
