<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-red-13">
        <q-icon name="people" class="q-mr-sm" /> Employee Management
      </div>
      <div class="row q-gutter-sm items-center">
        <q-input
          outlined
          dense
          v-model="filter"
          placeholder="Search Employees..."
          bg-color="white"
          style="width: 250px"
          clearable
        >
          <template v-slot:append><q-icon name="search" /></template>
        </q-input>
        <q-btn color="teal-13" icon="person_add" label="Add Employee" @click="openDialog()" />
      </div>
    </div>

    <q-card flat bordered style="border-radius: 12px;" class="bg-white">
      <q-table
        :rows="employees"
        :columns="columns"
        row-key="id"
        flat
        :filter="filter"
        :loading="isLoading"
        :pagination="{ rowsPerPage: 10 }"
        class="text-grey-9"
      >
        <template v-slot:body-cell-salary="props">
          <q-td :props="props" class="text-weight-bold text-green-7">
            ৳ {{ formatMoney(props.value) }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round dense color="blue" icon="edit" size="sm" class="q-mr-xs" @click="openDialog(props.row)">
              <q-tooltip>Edit Employee</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="red" icon="delete" size="sm" @click="deleteEmployee(props.row.id)">
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center flex-col text-grey-6 q-pa-xl column">
            <q-icon size="4em" name="group_off" class="q-mb-md opacity-50" />
            <div class="text-h6">No employees found</div>
            <div class="text-caption">Click "Add Employee" to onboard your first staff member.</div>
          </div>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="employeeDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center justify-between q-pb-md">
          <div class="text-h6">{{ isEditMode ? 'Edit Employee' : 'New Employee' }}</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="saveEmployee">
          <q-card-section class="q-pt-md q-gutter-md">
            <q-input
              filled
              v-model="form.name"
              label="Full Name *"
              dense
              autofocus
              :rules="[val => !!val || 'Name is required']"
            />

            <q-select
              filled
              v-model="form.position"
              :options="['Manager', 'Head Chef', 'Chef', 'Waiter', 'Cashier', 'Cleaner']"
              label="Position *"
              dense
              :rules="[val => !!val || 'Position is required']"
            />

            <q-input
              filled
              v-model.number="form.salary"
              label="Base Salary (৳) *"
              type="number"
              dense
              :rules="[val => val > 0 || 'Salary must be a valid amount greater than 0']"
            />
          </q-card-section>

          <q-card-actions align="right" class="bg-grey-1 q-pa-md">
            <q-btn flat label="Cancel" color="grey-8" v-close-popup />
            <q-btn
              unelevated
              :label="isEditMode ? 'Update Employee' : 'Save Employee'"
              color="primary"
              type="submit"
              :loading="isSaving"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()

    // --- State ---
    const filter = ref('')
    const employeeDialog = ref(false)
    const isLoading = ref(false)
    const isSaving = ref(false)
    const employees = ref([])

    // Edit tracking
    const isEditMode = ref(false)
    const editId = ref(null)

    // Form Initialization
    const getInitialForm = () => ({ name: '', position: '', salary: null })
    const form = reactive(getInitialForm())

    // Table Columns
    const columns = [
      { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
      { name: 'position', label: 'Position', field: 'position', align: 'left', sortable: true },
      { name: 'salary', label: 'Base Salary', field: 'salary', align: 'left', sortable: true },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
    ]

    // --- Core Logic ---
    const formatMoney = (val) => Number(val || 0).toLocaleString('en-IN')

    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400)) // Mock API

      const saved = localStorage.getItem('saas_employees')
      if (saved) {
        employees.value = JSON.parse(saved)
      } else {
        // Dummy data if empty
        employees.value = [
          { id: 1, name: 'Kazi Emran', position: 'Manager', salary: 45000 },
          { id: 2, name: 'John Doe', position: 'Head Chef', salary: 35000 }
        ]
        localStorage.setItem('saas_employees', JSON.stringify(employees.value))
      }
      isLoading.value = false
    }

    onMounted(() => loadData())

    // Auto-save to LocalStorage on any change
    watch(employees, (newVal) => {
      localStorage.setItem('saas_employees', JSON.stringify(newVal))
    }, { deep: true })

    // Unified Dialog Handler (Handles both Create & Edit)
    const openDialog = (employee = null) => {
      if (employee) {
        // Edit Mode
        isEditMode.value = true
        editId.value = employee.id
        Object.assign(form, {
          name: employee.name,
          position: employee.position,
          salary: employee.salary
        })
      } else {
        // Create Mode
        isEditMode.value = false
        editId.value = null
        Object.assign(form, getInitialForm())
      }
      employeeDialog.value = true
    }

    const saveEmployee = async () => {
      isSaving.value = true
      await new Promise(res => setTimeout(res, 500))

      if (isEditMode.value) {
        // Update existing record
        const index = employees.value.findIndex(e => e.id === editId.value)
        if (index !== -1) {
          employees.value[index] = { ...employees.value[index], ...form }
          $q.notify({ color: 'positive', message: 'Employee updated successfully', icon: 'check_circle', position: 'top-right' })
        }
      } else {
        // Create new record (unshift pushes to the top of the array)
        employees.value.unshift({ id: Date.now(), ...form })
        $q.notify({ color: 'positive', message: 'Employee added successfully', icon: 'check_circle', position: 'top-right' })
      }

      isSaving.value = false
      employeeDialog.value = false
    }

    const deleteEmployee = (id) => {
      $q.dialog({
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this employee? This action cannot be undone.',
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(() => {
        employees.value = employees.value.filter(e => e.id !== id)
        $q.notify({ color: 'negative', message: 'Employee deleted', icon: 'delete', position: 'top-right' })
      })
    }

    // --- Explicit Return ---
    return {
      filter,
      employeeDialog,
      isEditMode,
      form,
      columns,
      employees,
      isLoading,
      isSaving,
      formatMoney,
      openDialog,
      saveEmployee,
      deleteEmployee
    }
  }
}
</script>

<style scoped>
.opacity-50 {
  opacity: 0.5;
}
</style>
