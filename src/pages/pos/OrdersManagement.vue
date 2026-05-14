<template>
  <q-page padding>
    <div class="text-h5 q-mb-md text-weight-bold">Live Orders Management</div>

    <div class="row q-col-gutter-md">
      <div v-for="order in liveOrders" :key="order.id" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered>
          <q-card-section class="bg-orange-1 row justify-between items-center">
            <div>
              <div class="text-h6">Table #{{ order.table }}</div>
              <div class="text-caption">ID: {{ order.id }}</div>
            </div>
            <q-badge color="orange-9" class="q-pa-xs">{{ order.status }}</q-badge>
          </q-card-section>

          <q-list dense separator>
            <q-item v-for="item in order.items" :key="item.name">
              <q-item-section>{{ item.name }}</q-item-section>
              <q-item-section side class="text-weight-bold">x{{ item.qty }}</q-item-section>
            </q-item>
          </q-list>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat color="red" label="Cancel" size="sm" />
            <q-btn color="primary" label="Complete & Bill" size="sm" />
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
    const liveOrders = ref([
      {
        id: 'ORD-99', table: '05', status: 'Cooking',
        items: [{ name: 'Chicken Pizza', qty: 1 }, { name: 'Coke', qty: 2 }]
      },
      {
        id: 'ORD-100', table: '02', status: 'Pending',
        items: [{ name: 'Pasta Alfredo', qty: 1 }]
      }
    ])

    return { liveOrders }
  }
}
</script>
