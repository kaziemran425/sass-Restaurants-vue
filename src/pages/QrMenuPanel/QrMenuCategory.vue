<template>
  <q-page class="bg-white">
    <!-- Sticky Header -->
    <q-header elevated class="bg-white text-primary">
      <q-toolbar>
        <q-btn flat round icon="arrow_back" to="/menu" />
        <q-toolbar-title class="text-weight-bold">
          {{ categoryId.toUpperCase() }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Product List -->
    <div class="q-pa-md q-mt-sm">
      <q-list separator>
        <q-item v-for="product in products" :key="product.id" class="q-py-md">
          <q-item-section avatar>
            <q-img
              :src="product.image"
              style="width: 80px; height: 80px; border-radius: 10px"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle1 text-weight-bold">{{ product.name }}</q-item-label>
            <q-item-label caption lines="2">{{ product.description }}</q-item-label>
            <q-item-label class="text-primary text-weight-bold q-mt-sm text-h6">
              ৳ {{ product.price }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn round color="primary" icon="add" size="sm" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Floating Cart Badge (Optional UI) -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="shopping_basket" color="primary">
        <q-badge color="red" floating>2</q-badge>
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'QrMenuCategory',
  setup() {
    const route = useRoute()
    const categoryId = ref(route.params.id || 'Category')

    const products = ref([
      {
        id: 1,
        name: 'Classic Beef Burger',
        description: 'Juicy beef patty with special sauce and fresh lettuce.',
        price: 350,
        image: 'https://cdn.quasar.dev/img/parallax2.jpg'
      },
      {
        id: 2,
        name: 'Crispy Chicken Burger',
        description: 'Deep fried chicken breast with mayo and pickles.',
        price: 280,
        image: 'https://cdn.quasar.dev/img/mountains.jpg'
      },
      {
        id: 3,
        name: 'Cheese Blast Burger',
        description: 'Extra cheese with double patty and caramelized onions.',
        price: 450,
        image: 'https://cdn.quasar.dev/img/chicken-salad.jpg'
      }
    ])

    return {
      categoryId,
      products
    }
  }
}
</script>

<style scoped>
.q-item {
  transition: background 0.3s;
}
.q-item:hover {
  background: #f5f5f5;
}
</style>
