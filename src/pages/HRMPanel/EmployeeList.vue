<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">Employee Management</div>
      <q-btn color="primary" icon="add" label="Add Employee" @click="addDialog = true" />
    </div>

    <q-table
      :rows="employees"
      :columns="columns"
      row-key="id"
      flat
      bordered
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round color="blue" icon="edit" size="sm" />
          <q-btn flat round color="red" icon="delete" size="sm" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="addDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">New Employee</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input v-model="form.name" label="Full Name" dense autofocus />
          <q-input v-model="form.position" label="Position (Chef/Waiter)" dense class="q-mt-sm" />
          <q-input v-model="form.salary" label="Base Salary" type="number" dense class="q-mt-sm" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="saveEmployee" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  setup() {
    const addDialog = ref(false)
    const form = reactive({ name: '', position: '', salary: '' })

    const columns = [
      { name: 'name', label: 'Name', field: 'name', align: 'left' },
      { name: 'position', label: 'Position', field: 'position', align: 'left' },
      { name: 'salary', label: 'Salary', field: 'salary' },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
    ]

    const employees = ref([
      { id: 1, name: 'Kazi Emran', position: 'Manager', salary: 45000 },
      { id: 2, name: 'John Doe', position: 'Head Chef', salary: 35000 }
    ])

    const saveEmployee = () => {
      employees.value.push({ id: Date.now(), ...form })
      addDialog.value = false
    }

    return { addDialog, form, columns, employees, saveEmployee }
  }
}
</script>
