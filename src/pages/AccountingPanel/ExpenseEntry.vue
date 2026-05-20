<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-red-9">
        <q-icon name="payments" class="q-mr-sm" /> Expense Management
      </div>
      <div class="row q-gutter-sm items-center">
        <q-input
          outlined
          dense
          v-model="search"
          placeholder="Search expenses..."
          bg-color="white"
          style="width: 250px"
          clearable
        >
          <template v-slot:append><q-icon name="search" /></template>
        </q-input>
        <q-btn color="red-9" icon="add" label="Record Expense" @click="openDialog" />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6">
        <q-card flat bordered class="bg-white shadow-1 stat-card" style="border-radius: 12px;">
          <q-card-section class="row items-center no-wrap">
            <q-avatar color="red-1" text-color="red-9" icon="account_balance_wallet" size="lg" class="q-mr-md" />
            <div>
              <div class="text-subtitle2 text-grey-8">Total Expenses (All-Time)</div>
              <div class="text-h4 text-red-9 text-weight-bold">৳ {{ formatMoney(totalExpenses) }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6">
        <q-card flat bordered class="bg-white shadow-1 stat-card" style="border-radius: 12px;">
          <q-card-section class="row items-center no-wrap">
            <q-avatar color="orange-1" text-color="orange-9" icon="date_range" size="lg" class="q-mr-md" />
            <div>
              <div class="text-subtitle2 text-grey-8">Expenses (This Month)</div>
              <div class="text-h4 text-orange-9 text-weight-bold">৳ {{ formatMoney(thisMonthExpenses) }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered style="border-radius: 12px;" class="bg-white">
      <q-table
        :rows="expenses"
        :columns="columns"
        row-key="id"
        flat
        :filter="search"
        :pagination="{ rowsPerPage: 15 }"
        class="text-grey-9"
      >
        <template v-slot:body-cell-category="props">
          <q-td :props="props">
            <q-badge outline color="primary" class="q-px-sm q-py-xs text-weight-bold">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-amount="props">
          <q-td :props="props" class="text-weight-bold text-red-8">
            {{ props.value }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round dense color="negative" icon="delete" size="sm" @click="deleteExpense(props.row.id)">
              <q-tooltip>Delete Record</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center flex-col text-grey-6 q-pa-xl column">
            <q-icon size="4em" name="receipt_long" class="q-mb-md opacity-50" />
            <div class="text-h6">No expenses found.</div>
            <div class="text-caption">Use "Record Expense" to add a new transaction.</div>
          </div>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="expenseDialog" persistent>
      <q-card style="min-width: 450px; border-radius: 12px;">
        <q-card-section class="bg-red-9 text-white row items-center justify-between q-pb-md">
          <div class="text-h6">Log Daily Expense</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="saveExpense">
          <q-card-section class="q-gutter-md q-pt-md">

            <div class="row q-col-gutter-sm">
              <q-input
                filled
                v-model="form.date"
                label="Date *"
                mask="YYYY-MM-DD"
                dense
                class="col-6"
                :rules="[val => !!val || 'Date is required']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer text-primary">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.date" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-select
                filled
                v-model="form.category"
                :options="categoryOptions"
                label="Category *"
                dense
                class="col-6"
                :rules="[val => !!val || 'Category is required']"
              />
            </div>

            <q-input
              filled
              v-model.number="form.amount"
              type="number"
              label="Amount (৳) *"
              dense
              min="1"
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

          <q-card-actions align="right" class="q-pa-md bg-grey-1">
            <q-btn flat label="Cancel" color="grey-8" v-close-popup />
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

    // --- State ---
    const search = ref('')
    const expenseDialog = ref(false)
    const isSaving = ref(false)
    const expenses = ref([])

    const categoryOptions = [
      'Raw Materials', 'Utility Bill', 'Rent', 'Payroll', 'Maintenance', 'Marketing', 'Logistics', 'Other'
    ]

    // Initial Form State
    const today = new Date().toISOString().split('T')[0]
    const getInitialForm = () => ({ date: today, category: '', amount: null, note: '' })
    const form = reactive(getInitialForm())

    // --- Table Configuration ---
    const columns = [
      { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
      { name: 'category', label: 'Category', field: 'category', align: 'left', sortable: true },
      { name: 'note', label: 'Description', field: 'note', align: 'left' },
      { name: 'amount', label: 'Amount', field: 'amount', align: 'right', format: val => `৳ ${Number(val).toLocaleString('en-IN')}`, sortable: true },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
    ]

    // --- Core Logic ---
    onMounted(() => {
      const savedExpenses = localStorage.getItem('saas_expenses')
      if (savedExpenses) {
        expenses.value = JSON.parse(savedExpenses)
      } else {
        // Fallback dummy data
        expenses.value = [
          { id: 1, date: today, category: 'Raw Materials', note: 'Purchase Chicken & Spices', amount: 8500 },
          { id: 2, date: today, category: 'Utility Bill', note: 'Electricity Bill May', amount: 12000 }
        ]
      }
    })

    // Auto-save to Local Storage
    watch(expenses, (newVal) => {
      localStorage.setItem('saas_expenses', JSON.stringify(newVal))
    }, { deep: true })

    // --- Computed Analytics ---
    const formatMoney = (amount) => {
      return Number(amount || 0).toLocaleString('en-IN')
    }

    const totalExpenses = computed(() => {
      return expenses.value.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    })

    const thisMonthExpenses = computed(() => {
      const currentMonth = new Date().toISOString().substring(0, 7) // "YYYY-MM"
      return expenses.value
        .filter(exp => exp.date && exp.date.startsWith(currentMonth))
        .reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    })

    // --- Methods ---
    const openDialog = () => {
      Object.assign(form, getInitialForm()) // Reset form
      expenseDialog.value = true
    }

    const saveExpense = async () => {
      isSaving.value = true
      await new Promise(resolve => setTimeout(resolve, 600)) // Simulate API Delay

      expenses.value.unshift({
        id: Date.now(),
        ...form
      })

      expenseDialog.value = false
      isSaving.value = false
      $q.notify({ color: 'positive', message: 'Expense recorded successfully!', icon: 'check_circle', position: 'top-right' })
    }

    const deleteExpense = (id) => {
      $q.dialog({
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this expense record? This cannot be undone.',
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(() => {
        expenses.value = expenses.value.filter(exp => exp.id !== id)
        $q.notify({ color: 'negative', message: 'Expense deleted', icon: 'delete', position: 'top-right' })
      })
    }

    // --- Explicit Return ---
    return {
      search,
      expenseDialog,
      form,
      columns,
      expenses,
      categoryOptions,
      isSaving,
      totalExpenses,
      thisMonthExpenses,
      formatMoney,
      saveExpense,
      deleteExpense,
      openDialog
    }
  }
}
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1) !important;
}
.opacity-50 {
  opacity: 0.5;
}
</style>
