<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">
        <q-icon name="assessment" class="q-mr-sm text-primary" /> Inventory Reports
      </div>
      <q-btn outline color="primary" icon="refresh" label="Refresh Data" @click="loadData" :loading="isLoading" />
    </div>

    <!-- Smart Stats -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="bg-indigo-9 text-white shadow-2" style="border-radius: 12px;">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle2 text-indigo-2">Total Items Tracked</div>
              <div class="text-h4 text-weight-bold">{{ totalItems }}</div>
            </div>
            <q-icon name="category" size="3em" style="opacity: 0.5" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="bg-red-9 text-white shadow-2" style="border-radius: 12px;">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle2 text-red-2">Low Stock Alert</div>
              <div class="text-h4 text-weight-bold">{{ lowStockCount }}</div>
            </div>
            <q-icon name="warning" size="3em" style="opacity: 0.5" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Report Table -->
    <q-card flat bordered style="border-radius: 12px;">
      <q-table
        :rows="reportRows"
        :columns="reportCols"
        row-key="name"
        flat
        :loading="isLoading"
        :pagination="{ rowsPerPage: 15 }"
      >
        <template v-slot:body-cell-stock="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <div class="col-8">
                <q-linear-progress
                  rounded
                  size="8px"
                  :value="props.row.progress"
                  :color="props.row.progress < 0.3 ? 'negative' : (props.row.progress < 0.6 ? 'warning' : 'positive')"
                />
              </div>
              <div class="col-4 q-pl-sm text-caption text-weight-bold">
                {{ props.row.stock }} {{ props.row.unit }}
              </div>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'

export default {
  setup() {
    const isLoading = ref(false)
    const reportRows = ref([])

    const reportCols = [
      { name: 'name', label: 'Item Name', field: 'name', align: 'left', sortable: true },
      { name: 'category', label: 'Category', field: 'category', align: 'left', sortable: true },
      { name: 'unit', label: 'Measurement Unit', field: 'unit', align: 'left' },
      { name: 'stock', label: 'Current Stock Level', field: 'stock', align: 'left', sortable: true }
    ]

    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 500))
      const saved = localStorage.getItem('saas_inventory_items')
      if (saved) {
        reportRows.value = JSON.parse(saved)
      } else {
        reportRows.value = [
          { name: 'Soybean Oil', category: 'Liquid', stock: 5, unit: 'Liters', progress: 0.15 },
          { name: 'Chicken Breast', category: 'Meat', stock: 25, unit: 'KG', progress: 0.8 },
          { name: 'Salt', category: 'Spices', stock: 12, unit: 'KG', progress: 0.6 },
          { name: 'Basmati Rice', category: 'Grains', stock: 8, unit: 'KG', progress: 0.25 }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadData())

    watch(reportRows, (newVal) => {
      localStorage.setItem('saas_inventory_items', JSON.stringify(newVal))
    }, { deep: true })

    const totalItems = computed(() => reportRows.value.length)
    const lowStockCount = computed(() => reportRows.value.filter(item => item.progress < 0.3).length)

    return { reportCols, reportRows, isLoading, loadData, totalItems, lowStockCount }
  }
}
</script>
