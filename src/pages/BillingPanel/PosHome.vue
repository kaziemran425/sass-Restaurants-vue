<template>
  <q-page class="bg-grey-2 q-pa-sm">
    <div class="row q-col-gutter-md full-height">

      <div class="col-12 col-md-8">
        <q-card flat bordered class="column full-height bg-white" style="border-radius: 12px; height: 88vh;">

          <q-card-section class="q-pb-sm">
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-h5 text-weight-bold text-dark">
                <q-icon name="point_of_sale" color="primary" class="q-mr-sm" />
                Point of Sale
              </div>
              <q-input outlined dense v-model="search" placeholder="Search product..." style="width: 280px" bg-color="grey-1" clearable>
                <template v-slot:append><q-icon name="search" /></template>
              </q-input>
            </div>

            <div class="row q-gutter-xs no-wrap overflow-auto hide-scrollbar q-pt-xs">
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
            <div v-if="filteredProducts.length === 0" class="flex flex-center full-height column text-grey-5">
              <q-icon name="search_off" size="4em" />
              <div class="text-h6 q-mt-sm">No products found</div>
            </div>

            <div v-else class="row q-col-gutter-md">
              <div v-for="product in filteredProducts" :key="product.id" class="col-6 col-sm-4 col-md-3">
                <q-card v-ripple class="cursor-pointer product-card text-center column full-height" @click="addToCart(product)">
                  <q-card-section class="col flex flex-center column q-pa-md">
                    <q-avatar size="70px" :color="product.color" text-color="white" class="q-mb-md shadow-2">
                      <q-icon :name="product.icon" />
                    </q-avatar>
                    <div class="text-subtitle2 text-weight-bold" style="line-height: 1.2;">{{ product.name }}</div>
                  </q-card-section>
                  <q-card-section class="bg-grey-2 q-pa-sm border-top">
                    <div class="text-primary text-weight-bolder text-subtitle1">৳ {{ formatMoney(product.price) }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="column full-height bg-white" style="border-radius: 12px; height: 88vh;">

          <q-card-section class="bg-teal-13 text-white row justify-between items-center q-py-sm">
            <div class="text-h6"><q-icon name="shopping_basket" class="q-mr-sm"/>Current Order</div>
            <q-btn flat round icon="delete_sweep" color="white" size="sm" @click="confirmClearCart" :disable="cart.length === 0">
              <q-tooltip>Clear Cart</q-tooltip>
            </q-btn>
          </q-card-section>

          <q-card-section class="bg-grey-1 q-pb-sm border-bottom">
            <div class="row q-col-gutter-sm">
              <q-input outlined dense v-model="customerName" label="Customer Name" class="col-7" bg-color="white" />
              <q-input outlined dense v-model="tableNumber" label="Table #" class="col-5" bg-color="white" />
            </div>
          </q-card-section>

          <q-card-section class="col scroll q-pa-none">
            <q-list separator v-if="cart.length > 0">
              <transition-group name="list">
                <q-item v-for="(item, index) in cart" :key="item.id" class="q-py-md">
                  <q-item-section>
                    <q-item-label class="text-weight-bold" lines="2">{{ item.name }}</q-item-label>
                    <q-item-label caption class="text-primary text-weight-medium">
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
              </transition-group>
            </q-list>

            <div v-else class="flex flex-center full-height text-grey-5 column q-pa-xl">
              <q-icon name="add_shopping_cart" size="64px" color="grey-4" />
              <div class="text-h6 q-mt-sm text-grey-6">Cart is empty</div>
              <div class="text-caption">Select products to start order</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="bg-grey-1">
            <div class="row justify-between q-mb-xs text-grey-8">
              <span>Subtotal</span>
              <span class="text-weight-medium">৳ {{ formatMoney(subtotal) }}</span>
            </div>
            <div class="row justify-between q-mb-xs text-grey-8">
              <span>VAT (5%)</span>
              <span class="text-weight-medium">৳ {{ formatMoney(vatAmount) }}</span>
            </div>
            <q-separator class="q-my-sm" />
            <div class="row justify-between q-mb-md text-h5 text-weight-bolder text-teal-10">
              <span>Total:</span>
              <span>৳ {{ formatMoney(grandTotal) }}</span>
            </div>

            <q-btn
              color="teal-13"
              label="Checkout & Print"
              icon="receipt_long"
              class="full-width text-weight-bold"
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
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()

    // --- State ---
    const search = ref('')
    const activeCategory = ref('All')
    const cart = ref([])
    const isCheckingOut = ref(false)
    const customerName = ref('Walk-in')
    const tableNumber = ref('T-01')

    const categories = ['All', 'Fast Food', 'Pizza', 'Drinks', 'Dessert']

    const products = ref([
      { id: 1, name: 'Beef Burger Combo', price: 450, category: 'Fast Food', icon: 'lunch_dining', color: 'orange-6' },
      { id: 2, name: 'Chicken Pasta Alfredo', price: 350, category: 'Fast Food', icon: 'ramen_dining', color: 'amber-6' },
      { id: 3, name: 'BBQ Chicken Pizza (L)', price: 850, category: 'Pizza', icon: 'local_pizza', color: 'deep-orange-5' },
      { id: 4, name: 'Cold Coffee', price: 180, category: 'Drinks', icon: 'local_cafe', color: 'brown-5' },
      { id: 5, name: 'French Fries', price: 120, category: 'Fast Food', icon: 'fastfood', color: 'yellow-8' },
      { id: 6, name: 'Chocolate Brownie', price: 220, category: 'Dessert', icon: 'cake', color: 'purple-5' },
      { id: 7, name: 'Mango Shake', price: 150, category: 'Drinks', icon: 'local_drink', color: 'green-5' }
    ])

    // --- Computed ---
    const filteredProducts = computed(() => {
      return products.value.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.value.toLowerCase())
        const matchesCategory = activeCategory.value === 'All' || p.category === activeCategory.value
        return matchesSearch && matchesCategory
      })
    })

    const subtotal = computed(() => cart.value.reduce((sum, item) => sum + (item.price * item.qty), 0))
    const vatAmount = computed(() => Math.round(subtotal.value * 0.05)) // 5% VAT
    const grandTotal = computed(() => subtotal.value + vatAmount.value)

    // --- Methods ---
    const formatMoney = (val) => Number(val).toLocaleString('en-IN')

    const addToCart = (product) => {
      const existing = cart.value.find(i => i.id === product.id)
      if (existing) {
        existing.qty++
      } else {
        cart.value.unshift({ ...product, qty: 1 })
      }
    }

    const updateQty = (index, val) => {
      cart.value[index].qty += val
      if (cart.value[index].qty < 1) cart.value.splice(index, 1)
    }

    const clearCartData = () => {
      cart.value = []
      customerName.value = 'Walk-in'
      tableNumber.value = 'T-01'
    }

    const confirmClearCart = () => {
      $q.dialog({
        title: 'Clear Order',
        message: 'Are you sure you want to remove all items from this order?',
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(() => {
        clearCartData()
      })
    }

    // --- Print POS Receipt Logic (Hidden Iframe) ---
    const printReceipt = (invoice) => {
      let itemsHtml = invoice.items.map(item => `
        <tr>
          <td class="text-left" style="padding: 4px 0;">${item.name}</td>
          <td class="text-center" style="padding: 4px 0;">${item.qty}</td>
          <td class="text-right" style="padding: 4px 0;">৳ ${formatMoney(item.price * item.qty)}</td>
        </tr>
      `).join('')

      const oldIframe = document.getElementById('pos-print-iframe')
      if (oldIframe) oldIframe.remove()

      const iframe = document.createElement('iframe')
      iframe.id = 'pos-print-iframe'
      iframe.style.position = 'absolute'
      iframe.style.width = '0'
      iframe.style.height = '0'
      iframe.style.border = 'none'

      document.body.appendChild(iframe)

      const doc = iframe.contentWindow.document
      doc.open()
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt_${invoice.id}</title>
            <style>
              body {
                font-family: 'Courier New', Courier, monospace;
                color: #000; width: 72mm; margin: 0 auto; font-size: 13px;
              }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .text-left { text-align: left; }
              .font-bold { font-weight: bold; }
              .divider { border-bottom: 1px dashed #000; margin: 8px 0; }
              table { width: 100%; border-collapse: collapse; }
              @media print {
                @page { size: 80mm auto; margin: 0; }
                body { margin: 0; padding: 4mm; }
                html, body { height: auto; }
              }
            </style>
          </head>
          <body>
            <div class="text-center font-bold" style="font-size: 18px; margin-bottom: 5px;">YOUR RESTAURANT</div>
            <div class="text-center">123 Main Street, Dhaka</div>
            <div class="text-center">Phone: +880 123 456 789</div>
            <div class="divider"></div>
            <div><span class="font-bold">Date:</span> ${invoice.date}</div>
            <div><span class="font-bold">Invoice:</span> ${invoice.id}</div>
            <div><span class="font-bold">Customer:</span> ${invoice.customer}</div>
            <div><span class="font-bold">Table:</span> ${invoice.table}</div>
            <div class="divider"></div>
            <table>
              <thead>
                <tr>
                  <th class="text-left font-bold" style="border-bottom: 1px solid #000;">Item</th>
                  <th class="text-center font-bold" style="border-bottom: 1px solid #000;">Qty</th>
                  <th class="text-right font-bold" style="border-bottom: 1px solid #000;">Total</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <div class="divider"></div>
            <div class="row" style="display:flex; justify-content:space-between; margin-bottom:2px;">
              <span>Subtotal:</span><span>৳ ${formatMoney(subtotal.value)}</span>
            </div>
            <div class="row" style="display:flex; justify-content:space-between; margin-bottom:2px;">
              <span>VAT (5%):</span><span>৳ ${formatMoney(vatAmount.value)}</span>
            </div>
            <table>
              <tr>
                <td class="text-left font-bold" style="font-size: 16px; padding-top:5px;">Net Total:</td>
                <td class="text-right font-bold" style="font-size: 16px; padding-top:5px;">${invoice.total}</td>
              </tr>
            </table>
            <div class="divider"></div>
            <div class="text-center" style="margin-top: 15px;">Thank you for your visit!</div>
            <div class="text-center" style="font-size: 11px; margin-top: 5px;">Powered by SaaS POS</div>
          </body>
        </html>
      `)
      doc.close()

      setTimeout(() => {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
      }, 500)
    }

    // --- Core Checkout Logic ---
    const checkout = async () => {
      isCheckingOut.value = true
      // Simulate API Processing
      await new Promise(resolve => setTimeout(resolve, 800))

      const dateStr = new Date().toISOString().split('T')[0]
      const uniqueIdNum = Math.floor(Math.random() * 90000) + 10000

      // 1. Prepare Invoice Object
      const newInvoice = {
        id: `INV-${uniqueIdNum}`,
        date: dateStr,
        customer: customerName.value || 'Walk-in',
        table: tableNumber.value,
        totalRaw: grandTotal.value,
        total: `৳ ${formatMoney(grandTotal.value)}`,
        status: 'Paid',
        items: [...cart.value]
      }

      // 2. Prepare Live Order Object (For Kitchen)
      const newOrder = {
        id: `ORD-${String(uniqueIdNum).substring(0,4)}`,
        table: tableNumber.value || 'T-00',
        status: 'Pending',
        time: 'Just now', // Could be calculated dynamically in a real app
        isUrgent: false,
        items: [...cart.value]
      }

      // 3. Save to Local Storage (Invoices)
      const existingInvoices = JSON.parse(localStorage.getItem('saas_invoices') || '[]')
      existingInvoices.unshift(newInvoice)
      localStorage.setItem('saas_invoices', JSON.stringify(existingInvoices))

      // 4. Save to Local Storage (Live Orders)
      const existingOrders = JSON.parse(localStorage.getItem('saas_live_orders') || '[]')
      existingOrders.unshift(newOrder)
      localStorage.setItem('saas_live_orders', JSON.stringify(existingOrders))

      // 5. Success Flow
      $q.notify({ color: 'positive', message: 'Order Processed & Sent to Kitchen!', icon: 'check_circle', position: 'top-right' })

      // Auto Print
      printReceipt(newInvoice)

      // Clear Cart
      isCheckingOut.value = false
      clearCartData()
    }

    // --- Explicit Return ---
    return {
      search,
      activeCategory,
      categories,
      products,
      filteredProducts,
      cart,
      customerName,
      tableNumber,
      subtotal,
      vatAmount,
      grandTotal,
      isCheckingOut,
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
/* Scrollbar hiding for category chips */
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Product Card Styling */
.product-card {
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}
.product-card:hover {
  transform: translateY(-4px);
  border-color: var(--q-primary);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important;
}
.border-top { border-top: 1px solid #f0f0f0; }
.border-bottom { border-bottom: 1px solid #e0e0e0; }

/* Vue Transition Group Classes */
.list-enter-active,
.list-leave-active { transition: all 0.3s ease; }
.list-enter-from,
.list-leave-to { opacity: 0; transform: translateX(-30px); }
</style>
