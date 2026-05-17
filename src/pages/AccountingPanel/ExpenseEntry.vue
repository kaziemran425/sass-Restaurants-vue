<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-red-9">
        <q-icon name="payments" class="q-mr-sm" /> Expense Management
      </div>
      <q-btn color="red-9" icon="add" label="Record New Expense" @click="openDialog" />
    </div>

    <!-- Expense Stats (Dynamic Calculation) -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="bg-red-1 shadow-1">
          <q-card-section>
            <div class="text-subtitle2 text-grey-8">Total Expenses (Recorded)</div>
            <div class="text-h4 text-red-9 text-weight-bold">৳ {{ formatMoney(totalExpenses) }}</div>
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
      :pagination="{ rowsPerPage: 10 }"
    >
      <template v-slot:body-cell-category="props">
        <q-td :props="props">
          <q-badge outline color="grey-8">{{ props.value }}</q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-right">
          <q-btn flat round dense color="negative" icon="delete" size="sm" @click="deleteExpense(props.row.id)" />
        </q-td>
      </template>
      <!-- Empty State -->
      <template v-slot:no-data>
        <div class="full-width row flex-center text-grey q-pa-md">
          <q-icon size="2em" name="receipt_long" class="q-mr-sm" />
          <span>No expenses recorded yet.</span>
        </div>
      </template>
    </q-table>

    <!-- Entry Dialog with Validation -->
    <q-dialog v-model="expenseDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-red-9 text-white row items-center justify-between">
          <div class="text-h6">Log Daily Expense</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="saveExpense">
          <q-card-section class="q-gutter-sm">
            <q-input
              filled
              v-model="form.date"
              label="Date *"
              mask="date"
              dense
              :rules="[val => !!val || 'Date is required']"
            >
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
              label="Expense Category *"
              dense
              :rules="[val => !!val || 'Category is required']"
            />

            <q-input
              filled
              v-model.number="form.amount"
              type="number"
              label="Amount (৳) *"
              dense
              :rules="[val => val > 0 || 'Amount must be greater than 0']"
            />
            <q-input
              filled
              v-model="form.note"
              label="Description / Note"
              type="textarea"
              autogrow
              dense
            />
          </q-card-section>

          <q-card-actions align="right" class="q-pb-md q-pr-md bg-grey-1">
            <q-btn flat label="Cancel" color="grey" v-close-popup />
            <q-btn unelevated type="submit" label="Save Expense" color="red-9" :loading="isSaving" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const expenseDialog = ref(false)
    const isSaving = ref(false)

    // Initial Form State
    const getInitialForm = () => ({ date: '', category: '', amount: null, note: '' })
    const form = reactive(getInitialForm())

    const columns = [
      { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
      { name: 'category', label: 'Category', field: 'category', align: 'left' },
      { name: 'note', label: 'Description', field: 'note', align: 'left' },
      { name: 'amount', label: 'Amount', field: 'amount', align: 'right', format: val => `৳ ${Number(val).toLocaleString('en-IN')}`, sortable: true },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
    ]

    const expenses = ref([])

    // Load Data from Local Storage on mount
    onMounted(() => {
      const savedExpenses = localStorage.getItem('saas_expenses')
      if (savedExpenses) {
        expenses.value = JSON.parse(savedExpenses)
      } else {
        // Fallback dummy data
        expenses.value = [
          { id: 1, date: '2026-05-12', category: 'Raw Materials', note: 'Purchase Chicken & Spices', amount: 8500 },
          { id: 2, date: '2026-05-13', category: 'Utility Bill', note: 'Electricity Bill May', amount: 12000 }
        ]
      }
    })

    // Watcher: Save to Local Storage automatically whenever expenses change
    watch(expenses, (newVal) => {
      localStorage.setItem('saas_expenses', JSON.stringify(newVal))
    }, { deep: true })

    // Dynamic Calculation
    const totalExpenses = computed(() => {
      return expenses.value.reduce((acc, curr) => acc + Number(curr.amount), 0)
    })

    // Helper: Format Money
    const formatMoney = (amount) => {
      return Number(amount).toLocaleString('en-IN')
    }

    const openDialog = () => {
      Object.assign(form, getInitialForm()) // Reset form
      expenseDialog.value = true
    }

    // Save Logic (Ready for API Integration)
    const saveExpense = async () => {
      isSaving.value = true

      // Simulate API Delay
      await new Promise(resolve => setTimeout(resolve, 600))

      expenses.value.unshift({
        id: Date.now(),
        ...form
      })

      expenseDialog.value = false
      isSaving.value = false
      $q.notify({ color: 'positive', message: 'Expense recorded successfully!', icon: 'check_circle' })
    }

    // Delete Logic
    const deleteExpense = (id) => {
      $q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to delete this expense?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        expenses.value = expenses.value.filter(exp => exp.id !== id)
        $q.notify({ color: 'negative', message: 'Expense deleted', icon: 'delete' })
      })
    }

    return {
      expenseDialog, form, columns, expenses,
      saveExpense, deleteExpense, openDialog,
      totalExpenses, formatMoney, isSaving
    }
  }
}
</script>
