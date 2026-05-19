<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-red-13 text-weight-bold">
        <q-icon name="event_available" class="q-mr-sm" /> Daily Attendance
      </div>
      <q-btn
        unelevated
        color="teal-13"
        label="Log Attendance"
        icon="how_to_reg"
        @click="openLogDialog"
      />
    </div>

    <q-card flat bordered style="border-radius: 12px" class="bg-white">
      <q-card-section class="row q-gutter-md items-center bg-grey-1 border-bottom">
        <q-input
          outlined
          v-model="searchDate"
          label="Select Date"
          dense
          style="width: 220px"
          bg-color="white"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer text-primary">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="searchDate" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-btn
          color="primary"
          outline
          label="Refresh"
          icon="refresh"
          @click="loadData"
          :loading="isLoading"
        />
      </q-card-section>

      <q-table
        :rows="filteredAttendance"
        :columns="attColumns"
        row-key="id"
        flat
        :loading="isLoading"
        :pagination="{ rowsPerPage: 15 }"
        class="text-grey-9"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props" class="text-center">
            <q-badge
              :color="getStatusColor(props.value)"
              class="q-px-sm q-py-xs text-weight-bold"
            >
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round dense color="red" icon="delete" size="sm" @click="deleteRecord(props.row.id)">
              <q-tooltip>Delete Log</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center flex-col text-grey-6 q-pa-xl column">
            <q-icon size="4em" name="event_busy" class="q-mb-md opacity-50" />
            <div class="text-h6">No attendance records found</div>
            <div class="text-caption">No logs for {{ searchDate }}.</div>
          </div>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="logDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center justify-between">
          <div class="text-h6">Manual Attendance Entry</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="saveLog">
          <q-card-section class="q-pt-md q-gutter-sm">
            <q-input
              filled
              v-model="logForm.date"
              label="Date *"
              readonly
              dense
              hint="Logging for currently selected date"
            />

            <q-select
              filled
              v-model="logForm.staff"
              :options="employeeOptions"
              label="Select Employee *"
              dense
              :rules="[val => !!val || 'Employee is required']"
            />

            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input filled v-model="logForm.in" label="Check In Time" dense placeholder="e.g. 09:00 AM" />
              </div>
              <div class="col-6">
                <q-input filled v-model="logForm.out" label="Check Out Time" dense placeholder="e.g. 06:00 PM" />
              </div>
            </div>

            <q-select
              filled
              v-model="logForm.status"
              :options="['Present', 'Late', 'Half-Day', 'Absent']"
              label="Status *"
              dense
              class="q-mt-sm"
              :rules="[val => !!val || 'Status is required']"
            />
          </q-card-section>

          <q-card-actions align="right" class="bg-grey-1 q-pa-md">
            <q-btn flat label="Cancel" color="grey-8" v-close-popup />
            <q-btn unelevated label="Save Log" color="primary" type="submit" :loading="isSaving" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed, reactive, onMounted, watch } from "vue";
import { useQuasar } from "quasar";

export default {
  setup() {
    const $q = useQuasar();

    // --- State Variables ---
    // Ensure format is exactly YYYY-MM-DD
    const todayStr = new Date().toISOString().split("T")[0];
    const searchDate = ref(todayStr);

    const isLoading = ref(false);
    const isSaving = ref(false);
    const logDialog = ref(false);

    const allAttendance = ref([]);
    const employeeOptions = ref([]);

    // --- Form State ---
    const getInitialForm = () => ({
      staff: null,
      date: searchDate.value,
      in: '',
      out: '',
      status: 'Present'
    });
    const logForm = reactive(getInitialForm());

    // --- Table Configuration ---
    const attColumns = [
      { name: "staff", label: "Staff Name", field: "staff", align: "left", sortable: true },
      { name: "date", label: "Date", field: "date", align: "left", sortable: true },
      { name: "in", label: "Check In", field: "in", align: "left" },
      { name: "out", label: "Check Out", field: "out", align: "left" },
      { name: "status", label: "Status", field: "status", align: "center" },
      { name: "actions", label: "Actions", field: "actions", align: "right" }
    ];

    // --- Core Logic ---
    const loadData = async () => {
      isLoading.value = true;
      await new Promise((res) => setTimeout(res, 400)); // Mock API Delay

      // 1. Load Employees for Dropdown
      const savedEmployees = localStorage.getItem("saas_employees");
      if (savedEmployees) {
        const parsed = JSON.parse(savedEmployees);
        employeeOptions.value = parsed.map(e => e.name);
      } else {
        employeeOptions.value = ["Kazi Emran", "John Doe", "Jane Smith"]; // Fallback
      }

      // 2. Load Attendance Data
      const savedAtt = localStorage.getItem("saas_attendance");
      if (savedAtt) {
        allAttendance.value = JSON.parse(savedAtt);
      } else {
        // Fallback dummy data mapped to today
        allAttendance.value = [
          { id: 1, staff: "Kazi Emran", date: todayStr, in: "09:00 AM", out: "06:00 PM", status: "Present" },
          { id: 2, staff: "John Doe", date: todayStr, in: "10:15 AM", out: "---", status: "Late" }
        ];
      }

      isLoading.value = false;
    };

    onMounted(() => loadData());

    // Auto-save to LocalStorage
    watch(
      allAttendance,
      (newVal) => {
        localStorage.setItem("saas_attendance", JSON.stringify(newVal));
      },
      { deep: true }
    );

    // Filter attendance by selected date
    const filteredAttendance = computed(() => {
      return allAttendance.value.filter((a) => a.date === searchDate.value);
    });

    // --- Methods ---
    const getStatusColor = (status) => {
      switch(status) {
        case 'Present': return 'green-6';
        case 'Late': return 'orange-8';
        case 'Half-Day': return 'blue-6';
        case 'Absent': return 'red-6';
        default: return 'grey-6';
      }
    };

    const openLogDialog = () => {
      // Reset form and set the date to the currently selected searchDate
      Object.assign(logForm, getInitialForm());
      logForm.date = searchDate.value;
      logDialog.value = true;
    };

    const saveLog = async () => {
      isSaving.value = true;
      await new Promise(res => setTimeout(res, 400));

      // Add new record to the top of the array
      allAttendance.value.unshift({
        id: Date.now(),
        staff: logForm.staff,
        date: logForm.date,
        in: logForm.in || '---',
        out: logForm.out || '---',
        status: logForm.status
      });

      isSaving.value = false;
      logDialog.value = false;
      $q.notify({ color: 'positive', message: 'Attendance logged successfully', icon: 'check_circle', position: 'top-right' });
    };

    const deleteRecord = (id) => {
      $q.dialog({
        title: 'Confirm Deletion',
        message: 'Remove this attendance log?',
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(() => {
        allAttendance.value = allAttendance.value.filter(a => a.id !== id);
        $q.notify({ color: 'negative', message: 'Record deleted', icon: 'delete', position: 'top-right' });
      });
    };

    // --- Explicit Return ---
    return {
      searchDate,
      attColumns,
      allAttendance,
      filteredAttendance,
      employeeOptions,
      logForm,
      isLoading,
      isSaving,
      logDialog,
      loadData,
      openLogDialog,
      saveLog,
      deleteRecord,
      getStatusColor
    };
  },
};
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.opacity-50 {
  opacity: 0.5;
}
</style>
