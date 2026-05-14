<template>
  <q-page padding class="bg-grey-2">
    <!-- Welcome Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold">Welcome back, {{ adminName }}!</div>
        <div class="text-caption text-grey-7">Here is what's happening with your restaurant today.</div>
      </div>
      <q-btn outline color="primary" icon="refresh" label="Refresh Data" @click="refreshStats" />
    </div>

    <!-- Quick Stats Cards -->
    <div class="row q-col-gutter-md">
      <div v-for="stat in quickStats" :key="stat.title" class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-avatar :icon="stat.icon" :color="stat.color" text-color="white" size="48px" />
            <div class="q-ml-md">
              <div class="text-h6 text-weight-bolder">{{ stat.value }}</div>
              <div class="text-caption text-grey-8">{{ stat.title }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Charts & Table Section -->
    <div class="row q-col-gutter-md q-mt-md">
      <!-- Sales Overview Chart Placeholder -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <div class="text-h6">Sales Overview</div>
            <q-btn-dropdown flat label="This Week" size="sm" color="grey-7">
              <q-list>
                <q-item clickable v-close-popup><q-item-section>Today</q-item-section></q-item>
                <q-item clickable v-close-popup><q-item-section>This Month</q-item-section></q-item>
              </q-list>
            </q-btn-dropdown>
          </q-card-section>

          <q-card-section class="flex flex-center" style="height: 300px">
            <div class="text-grey-5 text-center">
              <q-icon name="show_chart" size="64px" /><br>
              [ Sales Analytics Graph will be integrated here ]
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Top Selling Items -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-h6">Top Selling Items</div>
          </q-card-section>
          <q-list separator>
            <q-item v-for="item in topItems" :key="item.name">
              <q-item-section avatar>
                <q-avatar rounded>
                  <img :src="item.img">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ item.name }}</q-item-label>
                <q-item-label caption>{{ item.sales }} orders</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="text-primary text-weight-bold">৳ {{ item.price }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- Recent Activity Table -->
    <q-card flat bordered class="q-mt-lg">
      <q-card-section>
        <div class="text-h6">Recent Transactions</div>
      </q-card-section>
      <q-table
        :rows="recentSales"
        :columns="columns"
        flat
        hide-bottom
        :pagination="{ rowsPerPage: 5 }"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'Paid' ? 'green' : 'orange'">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'IndexPage',
  setup() {
    const $q = useQuasar()
    const adminName = ref('Emran')

    const quickStats = ref([
      { title: 'Today Sales', value: '৳ 15,400', icon: 'trending_up', color: 'green' },
      { title: 'New Orders', value: '24', icon: 'shopping_basket', color: 'blue' },
      { title: 'Available Tables', value: '08/20', icon: 'table_restaurant', color: 'orange' },
      { title: 'Net Profit', value: '৳ 6,200', icon: 'account_balance_wallet', color: 'purple' }
    ])

    const topItems = ref([
      { name: 'Classic Beef Burger', sales: 45, price: 350, img: 'https://cdn.quasar.dev/img/parallax2.jpg' },
      { name: 'Cheese Pizza', sales: 32, price: 650, img: 'https://cdn.quasar.dev/img/mountains.jpg' },
      { name: 'Iced Coffee', sales: 28, price: 180, img: 'https://cdn.quasar.dev/img/chicken-salad.jpg' }
    ])

    const columns = [
      { name: 'id', label: 'Order ID', field: 'id', align: 'left' },
      { name: 'customer', label: 'Customer', field: 'customer', align: 'left' },
      { name: 'amount', label: 'Amount', field: 'amount' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' }
    ]

    const recentSales = ref([
      { id: '#1025', customer: 'Walking Customer', amount: '৳ 1,250', status: 'Paid' },
      { id: '#1024', customer: 'Kazi Emran', amount: '৳ 450', status: 'Paid' },
      { id: '#1023', customer: 'John Doe', amount: '৳ 2,100', status: 'Pending' }
    ])

    const refreshStats = () => {
      $q.loading.show()
      setTimeout(() => {
        $q.loading.hide()
        $q.notify({ message: 'Dashboard updated!', color: 'positive', icon: 'done' })
      }, 1000)
    }

    return {
      adminName,
      quickStats,
      topItems,
      columns,
      recentSales,
      refreshStats
    }
  }
}
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
  transition: transform 0.3s;
}
.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
}
</style>
