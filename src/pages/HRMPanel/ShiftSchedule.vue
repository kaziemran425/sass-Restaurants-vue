<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Staff Shift Schedule</div>
    <div class="row q-col-gutter-md">
      <div v-for="shift in shifts" :key="shift.name" class="col-12 col-sm-6">
        <q-card flat bordered>
          <q-card-section class="bg-teal text-white">
            <div class="text-h6">{{ shift.name }} ({{ shift.time }})</div>
          </q-card-section>
          <q-list separator>
            <q-item v-for="staff in shift.staffs" :key="staff">
              <q-item-section>{{ staff }}</q-item-section>
              <q-item-section side><q-badge label="On Duty" color="green" /></q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const shifts = ref([
      { name: 'Morning Shift', time: '8:00 AM - 4:00 PM', staffs: ['Chef John', 'Waiter Alice'] },
      { name: 'Evening Shift', time: '4:00 PM - 12:00 AM', staffs: ['Chef Mike', 'Waiter Bob'] }
    ])
    return { shifts }
  }
}
</script>
