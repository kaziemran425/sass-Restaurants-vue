<template>
  <q-page padding>
    <div class="text-h5 q-mb-md text-weight-bold">Kitchen Queue Manager</div>

    <q-table
      :rows="queueRows"
      :columns="queueCols"
      row-key="id"
      flat
      bordered
    >
      <template v-slot:body-cell-wait="props">
        <q-td :props="props">
          <q-chip :color="props.value > 15 ? 'red' : 'orange'" text-color="white" size="sm">
            {{ props.value }} mins
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense round icon="play_arrow" color="blue" />
          <q-btn flat dense round icon="check" color="green" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const queueCols = [
      { name: 'id', label: 'Order ID', field: 'id', align: 'left' },
      { name: 'table', label: 'Table', field: 'table' },
      { name: 'items', label: 'Items Summary', field: 'items', align: 'left' },
      { name: 'wait', label: 'Wait Time', field: 'wait', sortable: true },
      { name: 'actions', label: 'Action', field: 'actions' }
    ]

    const queueRows = ref([
      { id: '1008', table: 'T-02', items: 'Burger x2, Fries x1', wait: 18 },
      { id: '1009', table: 'T-05', items: 'Steak x1, Salad x1', wait: 5 }
    ])

    return { queueCols, queueRows }
  }
}
</script>
