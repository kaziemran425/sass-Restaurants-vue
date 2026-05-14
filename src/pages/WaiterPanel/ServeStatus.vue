<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">Pending Serving</div>

    <div class="row q-col-gutter-sm">
      <div v-for="item in readyItems" :key="item.id" class="col-12">
        <q-card flat bordered class="bg-green-1">
          <q-item>
            <q-item-section avatar>
              <q-icon name="check_circle" color="green" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Table #{{ item.table }} - {{ item.dish }}</q-item-label>
              <q-item-label caption>Ready for {{ item.wait }} mins</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn color="primary" label="Served" dense @click="markServed(item.id)" />
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const readyItems = ref([
      { id: 1, table: '04', dish: 'BBQ Wings', wait: 2 },
      { id: 2, table: '02', dish: 'Iced Tea', wait: 5 }
    ])

    const markServed = (id) => {
      readyItems.value = readyItems.value.filter(i => i.id !== id)
    }

    return { readyItems, markServed }
  }
}
</script>
