<template>
  <q-page class="bg-grey-1">
    <!-- Restaurant Header -->
    <div class="header-section bg-primary text-white q-pa-xl text-center">
      <q-avatar size="100px" class="bg-white q-mb-md">
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
      </q-avatar>
      <div class="text-h5 text-weight-bold">Welcome to Our Restaurant</div>
      <div class="text-subtitle2">Select a category to see our delicious menu</div>
    </div>

    <!-- Category Grid -->
    <div class="q-pa-md">
      <div class="text-h6 q-mb-md">Explore Menu</div>
      <div class="row q-col-gutter-md">
        <div v-for="cat in categories" :key="cat.id" class="col-6">
          <q-card
            v-ripple
            class="cursor-pointer category-card text-center q-pa-md shadow-2"
            @click="goToCategory(cat.id)"
          >
            <q-icon :name="cat.icon" size="40px" color="primary" />
            <div class="text-subtitle1 text-weight-bold q-mt-sm">{{ cat.name }}</div>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Footer Info -->
    <div class="text-center q-pa-lg text-grey-6">
      <q-icon name="info" /> Scanned from Table #04
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'QrMenuHome',
  setup() {
    const router = useRouter()
    const categories = ref([
      { id: 'fast-food', name: 'Fast Food', icon: 'lunch_dining' },
      { id: 'drinks', name: 'Beverages', icon: 'local_bar' },
      { id: 'desserts', name: 'Desserts', icon: 'icecream' },
      { id: 'pizza', name: 'Pizza', icon: 'local_pizza' }
    ])

    const goToCategory = (id) => {
      router.push(`/menu/category/${id}`)
    }

    return {
      categories,
      goToCategory
    }
  }
}
</script>

<style scoped>
.header-section {
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
}
.category-card {
  border-radius: 15px;
  transition: transform 0.2s;
}
.category-card:active {
  transform: scale(0.95);
}
</style>
