<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold text-red-13">
        <q-icon name="calendar_month" class="q-mr-sm" /> Staff Shift Schedule
      </div>
      <q-btn
        outline
        color="teal-13"
        icon="edit_calendar"
        label="Manage Shifts"
        class="bg-white"
      />
    </div>

    <div class="row q-col-gutter-lg">
      <div v-for="(shift, index) in shifts" :key="index" class="col-12 col-md-6">
        <q-card flat bordered class="shadow-2 shift-card" style="border-radius: 12px; overflow: hidden;">

          <q-card-section class="text-white row justify-between items-center q-pa-md" :class="shift.color">
            <div>
              <div class="text-h5 text-weight-bold" style="line-height: 1.2;">{{ shift.name }}</div>
              <div class="text-subtitle2 q-mt-xs text-white" style="opacity: 0.9;">
                <q-icon name="schedule" class="q-mr-xs"/> {{ shift.time }}
              </div>
            </div>
            <q-icon :name="shift.icon" size="3.5em" style="opacity: 0.3" class="absolute-right q-mr-md" />
          </q-card-section>

          <q-list separator class="bg-white">
            <q-item v-for="(staff, sIndex) in shift.staffs" :key="sIndex" class="q-py-md">
              <q-item-section avatar>
                <q-avatar :color="shift.colorClass + '-1'" :text-color="shift.colorClass + '-8'" icon="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-dark">{{ staff.name }}</q-item-label>
                <q-item-label caption class="text-grey-7">{{ staff.role }}</q-item-label>
              </q-item-section>
              <q-item-section side class="row items-center no-wrap">
                <q-btn
                  flat
                  round
                  dense
                  color="red-5"
                  icon="person_remove"
                  size="sm"
                  @click="removeStaff(index, sIndex)"
                >
                  <q-tooltip>Remove from shift</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>

            <q-item v-if="shift.staffs.length === 0" class="q-py-xl">
              <q-item-section class="text-grey-6 text-center column flex-center">
                <q-icon name="group_off" size="2em" class="q-mb-sm opacity-50" />
                No staff currently assigned
              </q-item-section>
            </q-item>
          </q-list>

          <q-separator />

          <q-card-actions align="center" class="bg-grey-1 q-pa-sm">
            <q-btn
              unelevated
              outline
              color="primary"
              label="Assign Staff"
              icon="add"
              class="full-width text-weight-bold"
              @click="openAssignDialog(index)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="assignDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center justify-between q-pb-md">
          <div class="text-h6">Assign Staff to {{ selectedShiftName }}</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="saveAssignment">
          <q-card-section class="q-pt-md">
            <q-select
              filled
              v-model="selectedStaff"
              :options="availableStaff"
              label="Select Employee *"
              dense
              :rules="[val => !!val || 'Please select an employee']"
              hint="Pulls from active employee list"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.role }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>

          <q-card-actions align="right" class="bg-grey-1 q-pa-md">
            <q-btn flat label="Cancel" color="grey-8" v-close-popup />
            <q-btn unelevated label="Assign" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()

    // --- State Variables ---
    const shifts = ref([])
    const availableStaff = ref([])

    // Dialog State
    const assignDialog = ref(false)
    const selectedShiftIndex = ref(null)
    const selectedShiftName = ref('')
    const selectedStaff = ref(null)

    // --- Core Logic ---
    const loadData = () => {
      // 1. Load Shifts
      const savedShifts = localStorage.getItem('saas_shifts')
      if (savedShifts) {
        shifts.value = JSON.parse(savedShifts)
      } else {
        // Fallback Default Data
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

      // 2. Load Available Staff from HRM module (for the dropdown)
      const savedStaff = localStorage.getItem('saas_employees')
      if (savedStaff) {
        const parsedStaff = JSON.parse(savedStaff)
        availableStaff.value = parsedStaff.map(emp => ({
          label: `${emp.name} (${emp.position})`,
          name: emp.name,
          role: emp.position
        }))
      } else {
        // Fallback if no employees exist in DB yet
        availableStaff.value = [
          { label: 'Kazi Emran (Manager)', name: 'Kazi Emran', role: 'Manager' },
          { label: 'John Doe (Head Chef)', name: 'John Doe', role: 'Head Chef' }
        ]
      }
    }

    onMounted(() => loadData())

    // Auto-save shifts to LocalStorage
    watch(shifts, (newVal) => {
      localStorage.setItem('saas_shifts', JSON.stringify(newVal))
    }, { deep: true })

    // --- Methods ---
    const openAssignDialog = (index) => {
      selectedShiftIndex.value = index
      selectedShiftName.value = shifts.value[index].name
      selectedStaff.value = null // reset form
      assignDialog.value = true
    }

    const saveAssignment = () => {
      if (!selectedStaff.value) return

      const targetShift = shifts.value[selectedShiftIndex.value]

      // Prevent duplicate assignment in the same shift
      const alreadyAssigned = targetShift.staffs.find(s => s.name === selectedStaff.value.name)
      if (alreadyAssigned) {
        $q.notify({ color: 'warning', message: `${selectedStaff.value.name} is already assigned to this shift.`, icon: 'warning', position: 'top-right' })
        return
      }

      // Add to shift
      targetShift.staffs.push({
        name: selectedStaff.value.name,
        role: selectedStaff.value.role
      })

      $q.notify({ color: 'positive', message: 'Staff successfully assigned!', icon: 'check_circle', position: 'top-right' })
      assignDialog.value = false
    }

    const removeStaff = (shiftIndex, staffIndex) => {
      $q.dialog({
        title: 'Confirm Removal',
        message: 'Remove this staff member from the shift?',
        cancel: true,
        color: 'negative'
      }).onOk(() => {
        shifts.value[shiftIndex].staffs.splice(staffIndex, 1)
        $q.notify({ color: 'info', message: 'Staff removed from shift', position: 'top-right' })
      })
    }

    // --- Explicit Return ---
    return {
      shifts,
      availableStaff,
      assignDialog,
      selectedShiftName,
      selectedStaff,
      openAssignDialog,
      saveAssignment,
      removeStaff
    }
  }
}
</script>

<style scoped>
.shift-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.shift-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important;
}
.opacity-50 {
  opacity: 0.5;
}
</style>
