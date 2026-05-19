<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-red-13 text-weight-bold">
        <q-icon name="event_note" class="q-mr-sm" /> Leave Requests
      </div>
      <div class="row q-gutter-sm items-center">
        <q-select
          outlined
          dense
          v-model="filterStatus"
          :options="['All', 'Pending', 'Approved', 'Rejected']"
          label="Filter Status"
          bg-color="white"
          style="width: 150px"
        />
        <q-btn
          unelevated
          color="teal-13"
          icon="add"
          label="New Request"
          @click="openNewDialog"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="leave in filteredLeaves" :key="leave.id" class="col-12 col-md-6 col-lg-4">
        <q-card flat bordered class="leave-card shadow-1 column full-height bg-white" style="border-radius: 12px;">

          <q-card-section class="row items-center justify-between no-wrap bg-grey-1 q-pa-sm border-bottom">
            <div class="row items-center no-wrap">
              <q-avatar size="40px" color="primary" text-color="white" class="q-mr-sm shadow-1">
                {{ leave.name.charAt(0).toUpperCase() }}
              </q-avatar>
              <div>
                <div class="text-subtitle1 text-weight-bold text-dark" style="line-height: 1.2;">{{ leave.name }}</div>
                <div class="text-caption text-grey-8">{{ leave.type }}</div>
              </div>
            </div>
            <q-badge :color="getStatusColor(leave.status)" class="q-pa-sm text-weight-bold shadow-1">
              {{ leave.status }}
            </q-badge>
          </q-card-section>

          <q-card-section class="col q-py-md">
            <div class="row items-center q-mb-sm text-grey-9">
              <q-icon name="calendar_today" size="xs" class="q-mr-xs text-primary" />
              <span class="text-weight-medium">Date:</span> <span class="q-ml-sm">{{ leave.date }}</span>
            </div>
            <div class="text-grey-9">
              <span class="text-weight-medium">Reason:</span>
              <span class="text-grey-7 q-ml-xs">{{ leave.reason || 'No specific reason provided.' }}</span>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="between" class="bg-grey-1 q-pa-sm">
            <q-btn
              flat
              round
              dense
              color="grey-6"
              icon="delete"
              size="sm"
              @click="deleteLeave(leave.id)"
            >
              <q-tooltip>Delete Record</q-tooltip>
            </q-btn>

            <div v-if="leave.status === 'Pending'" class="row q-gutter-sm">
              <q-btn
                flat
                color="negative"
                label="Reject"
                size="sm"
                @click="updateStatus(leave.id, 'Rejected')"
                :loading="isProcessing === leave.id"
              />
              <q-btn
                unelevated
                color="positive"
                label="Approve"
                icon="check"
                size="sm"
                @click="updateStatus(leave.id, 'Approved')"
                :loading="isProcessing === leave.id"
              />
            </div>
            <div v-else class="text-caption text-grey-6 q-pr-sm italic">
              Processed
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div v-if="filteredLeaves.length === 0" class="flex flex-center column q-mt-xl text-grey-6" style="height: 40vh;">
      <q-icon name="event_busy" size="5em" class="opacity-50 q-mb-md" />
      <div class="text-h6">No leave requests found.</div>
      <div class="text-caption">Change your filter or create a new request.</div>
    </div>

    <q-dialog v-model="newDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center justify-between q-pb-md">
          <div class="text-h6">Apply for Leave</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="submitLeave">
          <q-card-section class="q-pt-md q-gutter-sm">
            <q-select
              filled
              dense
              v-model="form.name"
              :options="employeeOptions"
              label="Select Employee *"
              :rules="[val => !!val || 'Employee is required']"
            />

            <q-select
              filled
              dense
              v-model="form.type"
              :options="['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity/Paternity']"
              label="Leave Type *"
              :rules="[val => !!val || 'Type is required']"
            />

            <q-input
              filled
              dense
              v-model="form.date"
              label="Date (or Date Range) *"
              :rules="[val => !!val || 'Date is required']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer text-primary">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.date" range mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              filled
              dense
              v-model="form.reason"
              type="textarea"
              label="Reason for leave"
              rows="3"
            />
          </q-card-section>

          <q-card-actions align="right" class="bg-grey-1 q-pa-md">
            <q-btn flat label="Cancel" color="grey-8" v-close-popup />
            <q-btn unelevated label="Submit Request" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()

    // --- State ---
    const leaves = ref([])
    const isProcessing = ref(null)
    const filterStatus = ref('All')

    // Dialog State
    const newDialog = ref(false)
    const employeeOptions = ref([])

    const getInitialForm = () => ({
      name: '',
      type: 'Casual Leave',
      date: '',
      reason: ''
    })
    const form = reactive(getInitialForm())

    // --- Core Logic ---
    onMounted(() => {
      // 1. Load Leaves
      const savedLeaves = localStorage.getItem('saas_leaves')
      if (savedLeaves) {
        leaves.value = JSON.parse(savedLeaves)
      } else {
        leaves.value = [
          { id: 1, name: 'Kazi Emran', type: 'Sick Leave', date: '2026-05-15', reason: 'Fever and cold.', status: 'Pending' },
          { id: 2, name: 'John Doe', type: 'Casual Leave', date: '2026-05-20', reason: 'Family event.', status: 'Pending' }
        ]
      }

      // 2. Load Employees for Dropdown
      const savedEmployees = localStorage.getItem('saas_employees')
      if (savedEmployees) {
        const parsed = JSON.parse(savedEmployees)
        employeeOptions.value = parsed.map(e => e.name)
      } else {
        employeeOptions.value = ['Kazi Emran', 'John Doe', 'Jane Smith'] // Fallback
      }
    })

    // Auto-save
    watch(leaves, (newVal) => {
      localStorage.setItem('saas_leaves', JSON.stringify(newVal))
    }, { deep: true })

    // --- Computed Filters ---
    const filteredLeaves = computed(() => {
      if (filterStatus.value === 'All') return leaves.value
      return leaves.value.filter(l => l.status === filterStatus.value)
    })

    // --- Methods ---
    const getStatusColor = (status) => {
      if (status === 'Approved') return 'green-6'
      if (status === 'Rejected') return 'red-6'
      return 'orange-8'
    }

    const updateStatus = async (id, status) => {
      isProcessing.value = id
      await new Promise(res => setTimeout(res, 600)) // Mock API Call

      const index = leaves.value.findIndex(l => l.id === id)
      if (index !== -1) {
        leaves.value[index].status = status
      }
      isProcessing.value = null

      $q.notify({
        color: status === 'Approved' ? 'positive' : 'negative',
        message: `Leave request ${status.toLowerCase()}`,
        icon: status === 'Approved' ? 'check_circle' : 'cancel',
        position: 'top-right'
      })
    }

    const deleteLeave = (id) => {
      $q.dialog({
        title: 'Delete Request',
        message: 'Are you sure you want to delete this leave record?',
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(() => {
        leaves.value = leaves.value.filter(l => l.id !== id)
        $q.notify({ color: 'info', message: 'Leave record deleted', position: 'top-right' })
      })
    }

    const openNewDialog = () => {
      Object.assign(form, getInitialForm())
      newDialog.value = true
    }

    const submitLeave = async () => {
      // Add new request to the top
      leaves.value.unshift({
        id: Date.now(),
        name: form.name,
        type: form.type,
        date: typeof form.date === 'object' ? `${form.date.from} to ${form.date.to}` : form.date, // Handle range formatting
        reason: form.reason,
        status: 'Pending'
      })

      newDialog.value = false
      $q.notify({
        color: 'positive',
        message: 'Leave request submitted successfully!',
        icon: 'check_circle',
        position: 'top-right'
      })
    }

    // --- Explicit Return ---
    return {
      leaves,
      isProcessing,
      filterStatus,
      filteredLeaves,
      newDialog,
      form,
      employeeOptions,
      getStatusColor,
      updateStatus,
      deleteLeave,
      openNewDialog,
      submitLeave
    }
  }
}
</script>

<style scoped>
.leave-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.leave-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1) !important;
}
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.opacity-50 {
  opacity: 0.5;
}
.italic {
  font-style: italic;
}
</style>
