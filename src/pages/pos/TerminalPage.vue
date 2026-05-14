<template>
  <q-page class="bg-grey-2 q-pa-sm">
    <div class="row q-col-gutter-sm full-height">
      <!-- Left Side: Product Selection -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="column full-height">
          <q-card-section class="row items-center q-pb-none">
            <q-input outlined dense v-model="search" placeholder="Search product..." class="col">
              <template v-slot:append><q-icon name="search" /></template>
            </q-input>
            <q-select
              outlined dense
              v-model="activeCategory"
              :options="categories"
              label="Category"
              class="q-ml-sm col-4"
            />
          </q-card-section>

          <q-card-section class="col scroll q-mt-sm">
            <div class="row q-col-gutter-sm">
              <div v-for="n in 12" :key="n" class="col-6 col-sm-4 col-md-3">
                <q-card v-ripple class="cursor-pointer product-card" @click="addToCart(n)">
                  <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" :ratio="1" />
                  <q-card-section class="q-pa-xs text-center">
                    <div class="text-subtitle2 text-weight-bold">Beef Burger #{{ n }}</div>
                    <div class="text-primary">৳ 280</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Right Side: Cart & Billing -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="column full-height bg-white">
          <q-card-section class="bg-primary text-white row justify-between items-center">
            <div class="text-h6">Current Order</div>
            <q-btn flat round icon="delete_sweep" color="white" @click="cart = []" />
          </q-card-section>

          <q-card-section class="col scroll q-pa-none">
            <q-list separator v-if="cart.length > 0">
              <q-item v-for="(item, index) in cart" :key="index">
                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption>৳ {{ item.price }} x {{ item.qty }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row items-center q-gutter-xs">
                    <q-btn size="xs" round color="grey-3" text-color="black" icon="remove" @click="updateQty(index, -1)" />
                    <span class="text-weight-bold">{{ item.qty }}</span>
                    <q-btn size="xs" round color="grey-3" text-color="black" icon="add" @click="updateQty(index, 1)" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="flex flex-center full-height text-grey-5">
              <div class="text-center">
                <q-icon name="shopping_basket" size="64px" />
                <div>Cart is empty</div>
              </div>
            </div>
          </q-card-section>

          <q-separator inset />

          <q-card-section class="q-pa-md">
            <div class="row justify-between q-mb-xs">
              <span>Subtotal</span>
              <span>৳ {{ subtotal }}</span>
            </div>
            <div class="row justify-between q-mb-xs">
              <span>VAT (5%)</span>
              <span>৳ {{ (subtotal * 0.05).toFixed(2) }}</span>
            </div>
            <div class="row justify-between text-h5 text-weight-bold text-primary q-mt-sm">
              <span>Total</span>
              <span>৳ {{ (subtotal * 1.05).toFixed(0) }}</span>
            </div>
            <q-btn
              color="positive"
              label="Place Order & Print"
              icon="print"
              class="full-width q-mt-md"
              size="lg"
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
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const search = ref('')
    const activeCategory = ref('All')
    const cart = ref([])

    const categories = ['All', 'Fast Food', 'Drinks', 'Platter', 'Dessert']

    const addToCart = (n) => {
      const name = 'Beef Burger #' + n
      const existing = cart.value.find(i => i.name === name)
      if (existing) {
        existing.qty++
      } else {
        cart.value.push({ name, price: 280, qty: 1 })
      }
    }

    const updateQty = (index, val) => {
      cart.value[index].qty += val
      if (cart.value[index].qty < 1) cart.value.splice(index, 1)
    }

    const subtotal = computed(() => {
      return cart.value.reduce((acc, item) => acc + (item.price * item.qty), 0)
    })

    const checkout = () => {
      $q.notify({ color: 'positive', message: 'Order Placed Successfully!', icon: 'check' })
      cart.value = []
    }

    return {
      search, activeCategory, categories, cart,
      addToCart, updateQty, subtotal, checkout
    }
  }
}
</script>

<style scoped>
.product-card { border-radius: 8px; overflow: hidden; }
.product-card:hover { border: 1px solid var(--q-primary); }
</style>
