<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Food Availability Status</div>

    <div class="row q-col-gutter-md">
      <div v-for="food in menuItems" :key="food.name" class="col-12 col-sm-4 col-md-3">
        <q-card flat bordered>
          <q-card-section class="row items-center justify-between">
            <div class="text-weight-bold">{{ food.name }}</div>
            <q-toggle
              v-model="food.isAvailable"
              :color="food.isAvailable ? 'positive' : 'negative'"
            />
          </q-card-section>

          <q-card-section class="q-pt-none text-caption">
            Status:
            <q-badge :color="food.isAvailable ? 'green' : 'red'">
              {{ food.isAvailable ? 'In Stock' : 'Out of Stock' }}
            </q-badge>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const menuItems = ref([
      { name: 'Classic Burger', isAvailable: true },
      { name: 'Cheese Pizza', isAvailable: true },
      { name: 'Grilled Chicken', isAvailable: false },
      { name: 'French Fries', isAvailable: true },
      { name: 'Vanilla Shake', isAvailable: true }
    ])

    return { menuItems }
  }
}
</script>
