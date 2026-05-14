<template>
  <q-page padding class="bg-blue-grey-1">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-blue-grey-10">
        <q-icon name="restaurant_menu" class="q-mr-sm" />
        Live Kitchen Display
      </div>
      <q-badge color="negative" class="q-pa-sm">Live Orders: {{ orders.length }}</q-badge>
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="order in orders" :key="order.id" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="order-card">
          <q-card-section :class="order.priority === 'High' ? 'bg-red-1' : 'bg-green-1'">
            <div class="row justify-between items-center">
              <div class="text-h6">Table #{{ order.table }}</div>
              <div class="text-caption text-weight-bold">#{{ order.id }}</div>
            </div>
            <div class="text-caption">Ordered: {{ order.time }} ago</div>
          </q-card-section>

          <q-separator />

          <q-list dense>
            <q-item v-for="item in order.items" :key="item.name">
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
                <q-item-label caption v-if="order.note">{{ order.note }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="blue-grey" outline>x{{ item.qty }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              unelevated
              color="positive"
              label="Mark as Cooked"
              icon="done_all"
              class="full-width"
              @click="completeOrder(order.id)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const orders = ref([
      {
        id: '1005', table: '04', time: '8 mins', priority: 'High',
        items: [{ name: 'BBQ Chicken Pizza', qty: 1 }, { name: 'Garlic Bread', qty: 2 }],
        note: 'Extra spicy'
      },
      {
        id: '1006', table: '12', time: '3 mins', priority: 'Normal',
        items: [{ name: 'Pasta Alfredo', qty: 2 }]
      }
    ])

    const completeOrder = (id) => {
      orders.value = orders.value.filter(o => o.id !== id)
    }

    return { orders, completeOrder }
  }
}
</script>

<style scoped>
.order-card {
  border-radius: 12px;
  transition: transform 0.2s;
}
.order-card:hover {
  transform: translateY(-5px);
}
</style>
