<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-red-9">
        <q-icon name="payments" class="q-mr-sm" /> Expense Management
      </div>
      <q-btn color="red-9" icon="add" label="Record New Expense" @click="expenseDialog = true" />
    </div>

    <!-- Expense Stats -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6">
        <q-card flat bordered class="bg-red-1">
          <q-card-section>
            <div class="text-subtitle2">Total Expenses (This Month)</div>
            <div class="text-h4 text-red-9 text-weight-bold">৳ 45,200</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Expense Table -->
    <q-table
      :rows="expenses"
      :columns="columns"
      row-key="id"
      flat
      bordered
    >
      <template v-slot:body-cell-category="props">
        <q-td :props="props">
          <q-badge outline color="grey-8">{{ props.value }}</q-badge>
        </q-td>
      </template>
    </q-table>

    <!-- Entry Dialog -->
    <q-dialog v-model="expenseDialog">
      <q-card style="min-width: 400px">
        <q-card-section class="bg-red-9 text-white">
          <div class="text-h6">Log Daily Expense</div>
        </q-card-section>

        <q-card-section class="q-gutter-sm">
          <q-input filled v-model="form.date" label="Date" mask="date" dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.date" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-select
            filled
            v-model="form.category"
            :options="['Raw Materials', 'Utility Bill', 'Staff Food', 'Maintenance', 'Others']"
            label="Expense Category"
            dense
          />

          <q-input filled v-model.number="form.amount" type="number" label="Amount (৳)" dense />
          <q-input filled v-model="form.note" label="Description / Note" type="textarea" autogrow dense />
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md q-pr-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn unelevated label="Save Expense" color="red-9" @click="saveExpense" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const expenseDialog = ref(false)
    const form = reactive({ date: '', category: '', amount: 0, note: '' })

    const columns = [
      { name: 'date', label: 'Date', field: 'date', align: 'left' },
      { name: 'category', label: 'Category', field: 'category', align: 'left' },
      { name: 'note', label: 'Description', field: 'note', align: 'left' },
      { name: 'amount', label: 'Amount', field: 'amount', align: 'right', format: val => `৳ ${val}` }
    ]

    const expenses = ref([
      { id: 1, date: '2026-05-12', category: 'Raw Materials', note: 'Purchase Chicken & Spices', amount: 8500 },
      { id: 2, date: '2026-05-13', category: 'Utility Bill', note: 'Electricity Bill May', amount: 12000 }
    ])

    const saveExpense = () => {
      expenses.value.unshift({ id: Date.now(), ...form })
      expenseDialog.value = false
      $q.notify({ color: 'negative', message: 'Expense recorded', icon: 'remove_circle' })
    }

    return { expenseDialog, form, columns, expenses, saveExpense }
  }
}
</script>
