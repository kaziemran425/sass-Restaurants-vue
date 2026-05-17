<template>
  <q-page class="bg-grey-2">
    <!-- Premium Restaurant Header -->
    <div class="header-section bg-primary text-white q-pa-xl text-center relative-position shadow-3">
      <q-avatar size="110px" class="bg-white shadow-5 q-mb-md border-white">
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
      </q-avatar>
      <div class="text-h5 text-weight-bolder letter-spacing">RestoSaaS Dine</div>
      <div class="text-subtitle2 q-mt-xs" style="opacity: 0.9">Select a category to explore our menu</div>
    </div>

    <!-- Category Grid -->
    <div class="q-pa-md q-mt-sm">
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6 text-weight-bold">Explore Menu</div>
        <q-btn flat round dense icon="refresh" color="primary" @click="loadCategories" :loading="isLoading" />
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="row justify-center q-pa-xl">
        <q-spinner-tail color="primary" size="3em" />
      </div>

      <div v-else class="row q-col-gutter-md">
        <div v-for="cat in categories" :key="cat.id" class="col-6 col-sm-4 col-md-3">
          <q-card
            v-ripple
            class="cursor-pointer category-card text-center q-pa-md shadow-1"
            @click="goToCategory(cat.id)"
          >
            <q-avatar :color="cat.color" text-color="white" size="60px" class="q-mb-sm shadow-2">
              <q-icon :name="cat.icon" size="30px" />
            </q-avatar>
            <div class="text-subtitle1 text-weight-bold">{{ cat.name }}</div>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Footer Info -->
    <div class="text-center q-pa-lg text-grey-6 text-weight-medium">
      <q-icon name="room_service" size="sm" class="q-mr-xs" />
      Ordering for Table <span class="text-primary text-weight-bold">#{{ tableNumber }}</span>
    </div>

    <!-- Floating Cart Badge -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="cartCount > 0">
      <q-btn fab icon="shopping_basket" color="negative" @click="openCartDialog">
        <q-badge color="white" text-color="negative" floating rounded class="text-weight-bold">
          {{ cartCount }}
        </q-badge>
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default {
  name: 'QrMenuHome',
  setup() {
    const router = useRouter()
    const $q = useQuasar()
    const isLoading = ref(false)
    const cartCount = ref(0)
    const tableNumber = ref('T-04') // In reality, fetch from URL query ?table=04

    const categories = ref([])

    const loadCategories = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400)) // Fake API delay
      categories.value = [
        { id: 'fast-food', name: 'Fast Food', icon: 'lunch_dining', color: 'orange' },
        { id: 'drinks', name: 'Beverages', icon: 'local_bar', color: 'blue' },
        { id: 'desserts', name: 'Desserts', icon: 'icecream', color: 'pink' },
        { id: 'pizza', name: 'Pizza', icon: 'local_pizza', color: 'red' }
      ]

      // Load cart count from local storage
      const cart = JSON.parse(localStorage.getItem('saas_qr_cart') || '[]')
      cartCount.value = cart.reduce((sum, item) => sum + item.qty, 0)

      // Save table context
      localStorage.setItem('saas_qr_table', tableNumber.value)

      isLoading.value = false
    }

    onMounted(() => loadCategories())

    const goToCategory = (id) => {
      router.push(`/menu/category/${id}`)
    }

    const openCartDialog = () => {
      $q.notify({ message: 'Navigate to any category to checkout!', color: 'primary', icon: 'info' })
    }

    return { categories, isLoading, cartCount, tableNumber, loadCategories, goToCategory, openCartDialog }
  }
}
</script>

<style scoped>
.header-section {
  border-bottom-left-radius: 35px;
  border-bottom-right-radius: 35px;
  background: linear-gradient(135deg, var(--q-primary) 0%, #1565C0 100%);
}
.border-white { border: 4px solid white; }
.letter-spacing { letter-spacing: 1px; }
.category-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  background-color: white;
}
.category-card:active { transform: scale(0.95); }
.category-card:hover { border-color: var(--q-primary); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
</style>
