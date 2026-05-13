<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Leave Requests</div>
    <q-list bordered separator class="bg-white rounded-borders">
      <q-item v-for="leave in leaves" :key="leave.id">
        <q-item-section>
          <q-item-label class="text-weight-bold">{{ leave.name }}</q-item-label>
          <q-item-label caption>{{ leave.type }} - {{ leave.date }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row q-gutter-xs">
            <q-btn flat round color="green" icon="check" />
            <q-btn flat round color="red" icon="close" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const leaves = ref([
      { id: 1, name: 'Alice Smith', type: 'Sick Leave', date: '2026-05-15', status: 'Pending' },
      { id: 2, name: 'Bob Wilson', type: 'Casual Leave', date: '2026-05-20', status: 'Pending' }
    ])
    return { leaves }
  }
}
</script>
