<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-red-13 text-weight-bold">
        <q-icon name="assessment" class="q-mr-sm" /> Inventory Reports
      </div>
      <div class="row q-gutter-sm items-center">
        <q-input
          outlined
          dense
          v-model="filter"
          placeholder="Search items..."
          bg-color="white"
          style="width: 250px"
          clearable
        >
          <template v-slot:append><q-icon name="search" /></template>
        </q-input>
        <q-btn outline color="primary" icon="refresh" @click="loadData" :loading="isLoading">
          <q-tooltip>Refresh Data</q-tooltip>
        </q-btn>
        <q-btn
          unelevated
          color="teal-13"
          icon="download"
          label="Export Report"
          @click="exportCSV"
          :disable="reportRows.length === 0"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4">
        <q-card class="bg-indigo-9 text-white shadow-2 stat-card" style="border-radius: 12px;">
          <q-card-section class="row items-center justify-between q-pa-lg">
            <div>
              <div class="text-subtitle1 text-indigo-2 text-weight-medium">Total Items Tracked</div>
              <div class="text-h4 text-weight-bolder q-mt-sm">{{ totalItems }}</div>
            </div>
            <q-icon name="category" size="4em" class="opacity-40" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card class="bg-red-9 text-white shadow-2 stat-card" style="border-radius: 12px;">
          <q-card-section class="row items-center justify-between q-pa-lg">
            <div>
              <div class="text-subtitle1 text-red-2 text-weight-medium">Low Stock Alert</div>
              <div class="text-h4 text-weight-bolder q-mt-sm">{{ lowStockCount }}</div>
            </div>
            <q-icon name="warning" size="4em" class="opacity-40" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card class="bg-green-9 text-white shadow-2 stat-card" style="border-radius: 12px;">
          <q-card-section class="row items-center justify-between q-pa-lg">
            <div>
              <div class="text-subtitle1 text-green-2 text-weight-medium">Healthy Stock</div>
              <div class="text-h4 text-weight-bolder q-mt-sm">{{ healthyStockCount }}</div>
            </div>
            <q-icon name="check_circle" size="4em" class="opacity-40" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered style="border-radius: 12px;" class="bg-white">
      <q-table
        :rows="reportRows"
        :columns="reportCols"
        row-key="name"
        flat
        :filter="filter"
        :loading="isLoading"
        :pagination="{ rowsPerPage: 15 }"
        class="text-grey-9"
      >
        <template v-slot:body-cell-category="props">
          <q-td :props="props">
            <q-badge color="grey-3" text-color="grey-9" class="text-weight-bold">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-stock="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <div class="col-8">
                <q-linear-progress
                  rounded
                  size="10px"
                  :value="getProgress(props.row)"
                  :color="isLowStock(props.row) ? 'negative' : (getProgress(props.row) < 0.5 ? 'warning' : 'positive')"
                  track-color="grey-3"
                />
              </div>
              <div class="col-4 q-pl-sm text-subtitle2 text-weight-bold" :class="isLowStock(props.row) ? 'text-red-6' : 'text-dark'">
                {{ props.row.stock }} {{ props.row.unit }}
              </div>
            </div>
            <div v-if="isLowStock(props.row)" class="text-caption text-red-6 q-mt-xs text-weight-medium flex items-center">
              <q-icon name="error" size="xs" class="q-mr-xs"/> Below minimum ({{ props.row.minStock }})
            </div>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center flex-col text-grey-6 q-pa-xl column">
            <q-icon size="4em" name="inventory" class="q-mb-md opacity-50" />
            <div class="text-h6">No inventory items found.</div>
            <div class="text-caption">Add items via the Stock Entry module.</div>
          </div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const isLoading = ref(false)
    const filter = ref('')
    const reportRows = ref([])

    const reportCols = [
      { name: 'name', label: 'Item Name', field: 'name', align: 'left', sortable: true },
      { name: 'category', label: 'Category', field: 'category', align: 'left', sortable: true },
      { name: 'unit', label: 'Measurement Unit', field: 'unit', align: 'left' },
      { name: 'stock', label: 'Current Stock Level', field: 'stock', align: 'left', sortable: true }
    ]

    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 500)) // Fake API Delay

      const saved = localStorage.getItem('saas_inventory_items')
      if (saved) {
        const rawData = JSON.parse(saved)
        // Data Enrichment: Ensure items added from other modules have the necessary fields for this report
        reportRows.value = rawData.map(item => ({
          ...item,
          stock: item.stock !== undefined ? item.stock : Math.floor(Math.random() * 50) + 5, // fallback stock
          minStock: item.minStock || 10,
          maxStock: item.maxStock || 100,
          category: item.category || 'Uncategorized'
        }))
      } else {
        // Fallback default data
        reportRows.value = [
          { id: 101, name: 'Soybean Oil', category: 'Liquid', stock: 5, minStock: 10, maxStock: 50, unit: 'Liters' },
          { id: 102, name: 'Chicken Breast', category: 'Meat', stock: 45, minStock: 15, maxStock: 100, unit: 'KG' },
          { id: 103, name: 'Salt', category: 'Spices', stock: 12, minStock: 5, maxStock: 50, unit: 'KG' },
          { id: 104, name: 'Basmati Rice', category: 'Grains', stock: 8, minStock: 20, maxStock: 100, unit: 'KG' }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadData())

    // Deep watch to save enriched/modified data back to local storage
    watch(reportRows, (newVal) => {
      localStorage.setItem('saas_inventory_items', JSON.stringify(newVal))
    }, { deep: true })

    // --- Computed Stats & Methods ---
    const getProgress = (row) => {
      // Calculate percentage based on max stock. Cap at 1 (100%).
      const max = row.maxStock || 100
      return Math.min(row.stock / max, 1)
    }

    const isLowStock = (row) => {
      return row.stock <= (row.minStock || 10)
    }

    const totalItems = computed(() => reportRows.value.length)
    const lowStockCount = computed(() => reportRows.value.filter(item => isLowStock(item)).length)
    const healthyStockCount = computed(() => totalItems.value - lowStockCount.value)

    const exportCSV = () => {
      if (reportRows.value.length === 0) return

      const headers = ['Item Name', 'Category', 'Current Stock', 'Unit', 'Minimum Stock Required', 'Status']

      const csvContent = [
        headers.join(','),
        ...reportRows.value.map(item => {
          const status = isLowStock(item) ? 'Low Stock' : 'Healthy'
          return `"${item.name}","${item.category}","${item.stock}","${item.unit}","${item.minStock}","${status}"`
        })
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `inventory_report_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      $q.notify({ color: 'positive', message: 'Report exported successfully', icon: 'check_circle', position: 'top-right' })
    }

    // --- Explicit Return ---
    return {
      filter,
      reportCols,
      reportRows,
      isLoading,
      totalItems,
      lowStockCount,
      healthyStockCount,
      loadData,
      getProgress,
      isLowStock,
      exportCSV
    }
  }
}
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.2) !important;
}
.opacity-40 {
  opacity: 0.4;
}
.opacity-50 {
  opacity: 0.5;
}
</style>
