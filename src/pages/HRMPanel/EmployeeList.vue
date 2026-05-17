<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-primary">
        <q-icon name="people" class="q-mr-sm" /> Employee Management
      </div>
      <q-btn color="primary" icon="person_add" label="Add Employee" @click="openDialog" />
    </div>

    <q-card flat bordered style="border-radius: 12px;">
      <q-table
        :rows="employees"
        :columns="columns"
        row-key="id"
        flat
        :loading="isLoading"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-salary="props">
          <q-td :props="props" class="text-weight-bold text-green-7">
            ৳ {{ formatMoney(props.value) }}
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round color="blue" icon="edit" size="sm" />
            <q-btn flat round color="red" icon="delete" size="sm" @click="deleteEmployee(props.row.id)" />
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey q-pa-md">
            <span>No employees found. Please add a new employee.</span>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Add Employee Dialog -->
    <q-dialog v-model="addDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center justify-between">
          <div class="text-h6">New Employee</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="saveEmployee">
          <q-card-section class="q-pt-md q-gutter-sm">
            <q-input filled v-model="form.name" label="Full Name *" dense autofocus :rules="[val => !!val || 'Name is required']" />
            <q-select filled v-model="form.position" :options="['Manager', 'Head Chef', 'Chef', 'Waiter', 'Cashier', 'Cleaner']" label="Position *" dense :rules="[val => !!val || 'Position is required']" />
            <q-input filled v-model.number="form.salary" label="Base Salary (৳) *" type="number" dense :rules="[val => val > 0 || 'Salary must be valid']" />
          </q-card-section>
          <q-card-actions align="right" class="bg-grey-1 q-pa-md">
            <q-btn flat label="Cancel" color="grey" v-close-popup />
            <q-btn unelevated label="Save Employee" color="primary" type="submit" :loading="isSaving" />
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
    const addDialog = ref(false)
    const isLoading = ref(false)
    const isSaving = ref(false)
    const employees = ref([])

    const getInitialForm = () => ({ name: '', position: '', salary: null })
    const form = reactive(getInitialForm())

    const columns = [
      { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
      { name: 'position', label: 'Position', field: 'position', align: 'left', sortable: true },
      { name: 'salary', label: 'Base Salary', field: 'salary', align: 'left', sortable: true },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
    ]

    const formatMoney = (val) => Number(val || 0).toLocaleString('en-IN')

    onMounted(async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400)) // Mock API
      const saved = localStorage.getItem('saas_employees')
      if (saved) employees.value = JSON.parse(saved)
      else {
        employees.value = [
          { id: 1, name: 'Kazi Emran', position: 'Manager', salary: 45000 },
          { id: 2, name: 'John Doe', position: 'Head Chef', salary: 35000 }
        ]
      }
      isLoading.value = false
    })

    watch(employees, (newVal) => {
      localStorage.setItem('saas_employees', JSON.stringify(newVal))
    }, { deep: true })

    const openDialog = () => {
      Object.assign(form, getInitialForm())
      addDialog.value = true
    }

    const saveEmployee = async () => {
      isSaving.value = true
      await new Promise(res => setTimeout(res, 500))
      employees.value.push({ id: Date.now(), ...form })
      isSaving.value = false
      addDialog.value = false
      $q.notify({ color: 'positive', message: 'Employee added successfully', icon: 'check' })
    }

    const deleteEmployee = (id) => {
      $q.dialog({ title: 'Confirm', message: 'Delete this employee?', cancel: true }).onOk(() => {
        employees.value = employees.value.filter(e => e.id !== id)
        $q.notify({ color: 'negative', message: 'Employee deleted', icon: 'delete' })
      })
    }

    return { addDialog, form, columns, employees, isLoading, isSaving, formatMoney, openDialog, saveEmployee, deleteEmployee }
  }
}
</script> 
