<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">Staff Shift Schedule</div>
      <q-btn outline color="teal" icon="edit_calendar" label="Manage Shifts" />
    </div>

    <div class="row q-col-gutter-lg">
      <div v-for="(shift, index) in shifts" :key="index" class="col-12 col-md-6">
        <q-card flat bordered class="shadow-1" style="border-radius: 12px; overflow: hidden;">
          <q-card-section class="text-white row justify-between items-center" :class="shift.color">
            <div>
              <div class="text-h6 text-weight-bold">{{ shift.name }}</div>
              <div class="text-caption"><q-icon name="schedule" class="q-mr-xs"/> {{ shift.time }}</div>
            </div>
            <q-icon :name="shift.icon" size="2.5em" style="opacity: 0.8" />
          </q-card-section>

          <q-list separator class="bg-white">
            <q-item v-for="(staff, sIndex) in shift.staffs" :key="sIndex" class="q-py-md">
              <q-item-section avatar>
                <q-avatar color="grey-2" text-color="grey-8" icon="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ staff.name }}</q-item-label>
                <q-item-label caption>{{ staff.role }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge outline :color="shift.colorClass" label="Assigned" />
              </q-item-section>
            </q-item>
            <!-- Empty State -->
            <q-item v-if="shift.staffs.length === 0">
              <q-item-section class="text-grey text-center">No staff assigned</q-item-section>
            </q-item>
          </q-list>

          <q-separator />
          <q-card-actions align="center" class="bg-grey-1">
            <q-btn flat color="primary" label="Assign Staff" icon="add" size="sm" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, watch } from 'vue'

export default {
  setup() {
    const shifts = ref([])

    onMounted(() => {
      const saved = localStorage.getItem('saas_shifts')
      if (saved) shifts.value = JSON.parse(saved)
      else {
        shifts.value = [
          {
            name: 'Morning Shift', time: '8:00 AM - 4:00 PM', color: 'bg-teal-7', colorClass: 'teal', icon: 'wb_sunny',
            staffs: [{ name: 'John Doe', role: 'Head Chef' }, { name: 'Alice', role: 'Waiter' }]
          },
          {
            name: 'Evening Shift', time: '4:00 PM - 12:00 AM', color: 'bg-indigo-7', colorClass: 'indigo', icon: 'nights_stay',
            staffs: [{ name: 'Mike', role: 'Chef' }, { name: 'Bob', role: 'Cashier' }]
          }
        ]
      }
    })

    watch(shifts, (newVal) => localStorage.setItem('saas_shifts', JSON.stringify(newVal)), { deep: true })

    return { shifts }
  }
}
</script>
