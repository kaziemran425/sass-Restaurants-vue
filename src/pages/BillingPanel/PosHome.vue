<template>
  <q-page padding class="bg-grey-2">
    <div class="row q-col-gutter-md full-height">
      <!-- Product Grid (Left) -->
      <div class="col-12 col-md-8">
        <q-card flat bordered style="border-radius: 12px; min-height: 80vh;">
          <q-card-section class="row items-center justify-between q-pb-none">
            <div class="text-h6 text-weight-bold">Point of Sale</div>
            <q-input outlined dense v-model="search" placeholder="Search product..." style="width: 250px">
              <template v-slot:append><q-icon name="search" /></template>
            </q-input>
          </q-card-section>

          <q-card-section class="row q-col-gutter-sm">
            <div v-for="product in filteredProducts" :key="product.id" class="col-6 col-sm-4 col-md-3">
              <q-card v-ripple class="cursor-pointer product-card text-center q-pa-sm" @click="addToCart(product)">
                <q-avatar size="60px" color="blue-1" text-color="primary" class="q-mb-sm">
                  <q-icon name="fastfood" />
                </q-avatar>
                <div class="text-subtitle2 text-weight-bold ellipsis">{{ product.name }}</div>
                <div class="text-primary text-weight-bold">৳ {{ product.price }}</div>
              </q-card>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Cart Section (Right) -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="column justify-between bg-white" style="border-radius: 12px; min-height: 80vh;">
          <q-card-section class="bg-primary text-white row justify-between items-center">
            <div class="text-h6">Current Order</div>
            <q-btn flat round icon="delete_sweep" color="white" size="sm" @click="cart = []" />
          </q-card-section>

          <q-card-section class="col scroll q-pa-none" style="max-height: 40vh;">
            <q-list separator v-if="cart.length > 0">
              <q-item v-for="(item, index) in cart" :key="index">
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ item.name }}</q-item-label>
                  <q-item-label caption>৳ {{ item.price }} x {{ item.qty }}</q-item-label>
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
                <q-icon name="shopping_basket" size="48px" />
                <div>Cart is empty</div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="bg-grey-1">
            <div class="row justify-between q-mb-sm text-h6 text-weight-bold">
              <span>Total:</span>
              <span class="text-primary">৳ {{ formatMoney(cartTotal) }}</span>
            </div>
            <q-btn
              color="positive"
              label="Checkout & Print"
              icon="point_of_sale"
              class="full-width"
              size="lg"
              :loading="isCheckingOut"
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
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const search = ref('')
    const cart = ref([])
    const isCheckingOut = ref(false)

    const products = ref([
      { id: 1, name: 'Burger Combo', price: 450 },
      { id: 2, name: 'Pasta Alfredo', price: 350 },
      { id: 3, name: 'BBQ Pizza (L)', price: 850 },
      { id: 4, name: 'Cold Coffee', price: 180 },
      { id: 5, name: 'French Fries', price: 120 }
    ])

    const filteredProducts = computed(() => {
      return products.value.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
    })

    const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + (item.price * item.qty), 0))
    const formatMoney = (val) => Number(val).toLocaleString('en-IN')

    const addToCart = (product) => {
      const existing = cart.value.find(i => i.id === product.id)
      if (existing) existing.qty++
      else cart.value.push({ ...product, qty: 1 })
    }

    const updateQty = (index, val) => {
      cart.value[index].qty += val
      if (cart.value[index].qty < 1) cart.value.splice(index, 1)
    }

    const checkout = async () => {
      isCheckingOut.value = true
      await new Promise(resolve => setTimeout(resolve, 800)) // API Delay

      const newInvoice = {
        id: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
        date: new Date().toISOString().split('T')[0],
        totalRaw: cartTotal.value,
        total: `৳ ${formatMoney(cartTotal.value)}`,
        status: 'Paid',
        items: [...cart.value]
      }

      // Save to Local Storage
      const existingInvoices = JSON.parse(localStorage.getItem('saas_invoices') || '[]')
      existingInvoices.unshift(newInvoice)
      localStorage.setItem('saas_invoices', JSON.stringify(existingInvoices))

      isCheckingOut.value = false
      cart.value = []
      $q.notify({ color: 'positive', message: 'Order Completed & Invoice Generated!', icon: 'check_circle' })
    }

    return { search, products, filteredProducts, cart, cartTotal, isCheckingOut, formatMoney, addToCart, updateQty, checkout }
  }
}
</script>

<style scoped>
.product-card { transition: transform 0.2s; border: 1px solid #eee; }
.product-card:hover { transform: translateY(-3px); border-color: var(--q-primary); }
</style>
