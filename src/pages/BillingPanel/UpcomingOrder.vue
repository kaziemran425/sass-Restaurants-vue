<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Upcoming / Live Orders</div>
    <div class="row q-col-gutter-md">
      <div v-for="order in orders" :key="order.id" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered>
          <q-card-section class="row items-center no-wrap bg-yellow-2">
            <div class="col">
              <div class="text-h6">Table: {{ order.table }}</div>
              <div class="text-caption">Order ID: {{ order.id }}</div>
            </div>
            <q-badge color="orange">{{ order.time }} min ago</q-badge>
          </q-card-section>

          <q-list dense separator>
            <q-item v-for="item in order.items" :key="item.name">
              <q-item-section>{{ item.name }}</q-item-section>
              <q-item-section side>x{{ item.qty }}</q-item-section>
            </q-item>
          </q-list>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat color="red" label="Cancel" />
            <q-btn color="primary" label="Mark as Ready" />
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
        id: '105', table: 'T-04', time: '5',
        items: [{ name: 'Pasta Basta', qty: 2 }, { name: 'Coke', qty: 2 }]
      },
      {
        id: '106', table: 'T-01', time: '2',
        items: [{ name: 'Family Pizza', qty: 1 }]
      }
    ])

    return { orders }
  }
}
</script>
