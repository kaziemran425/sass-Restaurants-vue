<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">Daily Attendance</div>
      <q-btn outline color="primary" label="Mark Attendance" icon="how_to_reg" @click="logDialog = true" />
    </div>

    <q-card flat bordered style="border-radius: 12px;">
      <q-card-section class="row q-gutter-md items-center bg-grey-1">
        <q-input outlined v-model="searchDate" label="Select Date" mask="date" dense style="width: 200px" bg-color="white">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="searchDate" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-btn color="secondary" label="Filter" icon="search" unelevated @click="loadData" :loading="isLoading" />
      </q-card-section>

      <q-table :rows="filteredAttendance" :columns="attColumns" flat :loading="isLoading">
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'Present' ? 'green' : (props.value === 'Late' ? 'orange' : 'red')" class="q-px-sm q-py-xs">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Log Attendance Dialog (Stub for integration) -->
    <q-dialog v-model="logDialog">
      <q-card style="min-width: 350px">
        <q-card-section class="bg-primary text-white"><div class="text-h6">Log Today's Attendance</div></q-card-section>
        <q-card-section class="q-pa-md text-center">
          <p>Scan employee ID or enter manually to mark In/Out time.</p>
          <q-btn color="primary" label="Scanner Ready" icon="qr_code_scanner" class="full-width q-mb-sm" />
        </q-card-section>
        <q-card-actions align="right"><q-btn flat label="Close" color="primary" v-close-popup /></q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'

export default {
  setup() {
    const searchDate = ref(new Date().toISOString().split('T')[0])
    const isLoading = ref(false)
    const logDialog = ref(false)

    const attColumns = [
      { name: 'staff', label: 'Staff Name', field: 'staff', align: 'left' },
      { name: 'date', label: 'Date', field: 'date', align: 'left' },
      { name: 'in', label: 'Check In', field: 'in', align: 'left' },
      { name: 'out', label: 'Check Out', field: 'out', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' }
    ]

    const allAttendance = ref([])

    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 500))
      const saved = localStorage.getItem('saas_attendance')
      if (saved) allAttendance.value = JSON.parse(saved)
      else {
        const today = new Date().toISOString().split('T')[0]
        allAttendance.value = [
          { id: 1, staff: 'Kazi Emran', date: today, in: '09:00 AM', out: '06:00 PM', status: 'Present' },
          { id: 2, staff: 'John Doe', date: today, in: '10:15 AM', out: '---', status: 'Late' }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadData())

    watch(allAttendance, (newVal) => {
      localStorage.setItem('saas_attendance', JSON.stringify(newVal))
    }, { deep: true })

    const filteredAttendance = computed(() => {
      return allAttendance.value.filter(a => a.date === searchDate.value)
    })

    return { searchDate, attColumns, allAttendance, filteredAttendance, isLoading, logDialog, loadData }
  }
}
</script>
