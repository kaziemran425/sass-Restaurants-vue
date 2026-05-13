<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Daily Attendance</div>
    <q-card flat bordered>
      <q-card-section class="row q-gutter-md items-center">
        <q-input filled v-model="searchDate" label="Select Date" mask="date" dense>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="searchDate" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-btn color="secondary" label="Filter" icon="search" />
      </q-card-section>

      <q-table :rows="attendanceRows" :columns="attColumns" flat />
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const searchDate = ref(new Date().toISOString().split('T')[0])
    const attColumns = [
      { name: 'staff', label: 'Staff Name', field: 'staff', align: 'left' },
      { name: 'in', label: 'Check In', field: 'in' },
      { name: 'out', label: 'Check Out', field: 'out' },
      { name: 'status', label: 'Status', field: 'status' }
    ]
    const attendanceRows = ref([
      { staff: 'Kazi Emran', in: '09:00 AM', out: '06:00 PM', status: 'Present' },
      { staff: 'John Doe', in: '10:15 AM', out: '---', status: 'Late' }
    ])

    return { searchDate, attColumns, attendanceRows }
  }
}
</script>
