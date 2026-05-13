<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Inventory Reports</div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card class="bg-indigo text-white text-center">
          <q-card-section>
            <div class="text-subtitle2">Total Items</div>
            <div class="text-h4">45</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="bg-red-8 text-white text-center">
          <q-card-section>
            <div class="text-subtitle2">Low Stock Alert</div>
            <div class="text-h4">03</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-table
      :rows="reportRows"
      :columns="reportCols"
      flat
      bordered
    >
      <template v-slot:body-cell-stock="props">
        <q-td :props="props">
          <q-linear-progress :value="props.row.progress" :color="props.row.progress < 0.3 ? 'red' : 'green'" class="q-mt-sm" />
          <div class="text-caption">{{ props.value }} left</div>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const reportCols = [
      { name: 'name', label: 'Item Name', field: 'name', align: 'left' },
      { name: 'category', label: 'Category', field: 'category' },
      { name: 'stock', label: 'Current Stock', field: 'stock', align: 'center' },
      { name: 'unit', label: 'Unit', field: 'unit' }
    ]

    const reportRows = ref([
      { name: 'Soybean Oil', category: 'Liquid', stock: '5 Liters', unit: 'Bottle', progress: 0.15 },
      { name: 'Chicken', category: 'Meat', stock: '25 KG', unit: 'KG', progress: 0.8 },
      { name: 'Salt', category: 'Spices', stock: '12 KG', unit: 'Packet', progress: 0.6 }
    ])

    return { reportCols, reportRows }
  }
}
</script>
