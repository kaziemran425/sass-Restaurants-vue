<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">Active Tables</div>

    <div class="row q-col-gutter-md">
      <div v-for="table in tables" :key="table.name" class="col-6 col-sm-4">
        <q-card
          flat
          bordered
          :class="table.active ? 'bg-orange-1 border-orange' : 'bg-white'"
          class="text-center q-pa-md"
        >
          <q-icon name="table_restaurant" size="30px" :color="table.active ? 'orange' : 'grey'" />
          <div class="text-subtitle1 text-weight-bold">{{ table.name }}</div>
          <div :class="table.active ? 'text-orange' : 'text-grey'">
            {{ table.active ? 'Occupied' : 'Empty' }}
          </div>
          <q-btn
            v-if="table.active"
            flat
            color="primary"
            label="View Order"
            size="sm"
            class="q-mt-sm"
          />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const tables = ref([
      { name: 'T-01', active: true },
      { name: 'T-02', active: false },
      { name: 'T-03', active: true },
      { name: 'T-04', active: true },
      { name: 'T-05', active: false },
      { name: 'T-06', active: false }
    ])

    return { tables }
  }
}
</script>

<style scoped>
.border-orange {
  border: 1px solid orange !important;
}
</style>
