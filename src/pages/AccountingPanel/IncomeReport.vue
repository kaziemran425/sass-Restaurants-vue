<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 q-mb-md text-weight-bold text-green-9">
        <q-icon name="trending_up" class="q-mr-sm" /> Income & Profit Report
      </div>
      <div class="row q-gutter-sm items-center">
        <q-btn
          outline
          color="primary"
          icon="sync"
          label="Sync Month Data"
          @click="syncCurrentMonth"
          :loading="isSyncing"
          class="bg-white"
        >
          <q-tooltip>Pull live sales and expenses for this month</q-tooltip>
        </q-btn>

        <q-btn
          unelevated
          color="green-9"
          icon="add"
          label="Add Record"
          @click="openAddDialog"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-sm-4">
        <q-card
          class="bg-green-9 text-white shadow-3 stat-card"
          style="border-radius: 12px"
        >
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle1 text-green-2 text-weight-medium">
              Total Income (Gross)
            </div>
            <div class="text-h4 text-weight-bolder q-mt-sm">
              ৳ {{ formatMoney(totalGross) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card
          class="bg-red-8 text-white shadow-3 stat-card"
          style="border-radius: 12px"
        >
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle1 text-red-2 text-weight-medium">
              Total Expenses
            </div>
            <div class="text-h4 text-weight-bolder q-mt-sm">
              ৳ {{ formatMoney(totalExpense) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card
          class="bg-indigo-9 text-white shadow-3 stat-card"
          style="border-radius: 12px"
        >
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle1 text-indigo-2 text-weight-medium">
              Overall Net Profit
            </div>
            <div class="text-h4 text-weight-bolder q-mt-sm">
              ৳ {{ formatMoney(netProfit) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered style="border-radius: 12px" class="bg-white">
      <q-card-section
        class="row items-center justify-between bg-grey-1 border-bottom q-pa-md"
      >
        <div class="text-h6 text-weight-bold text-dark">Monthly Breakdown</div>
        <q-btn-dropdown
          unelevated
          color="primary"
          label="Export Report"
          :loading="isExporting"
        >
          <q-list>
            <q-item clickable v-close-popup @click="exportData('PDF')">
              <q-item-section avatar>
                <q-icon name="picture_as_pdf" color="red-6" />
              </q-item-section>
              <q-item-section>Download PDF</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="exportData('CSV')">
              <q-item-section avatar>
                <q-icon name="description" color="green-6" />
              </q-item-section>
              <q-item-section>Export CSV</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-section>

      <q-table
        :rows="incomeHistory"
        :columns="incomeCols"
        row-key="month"
        flat
        :pagination="{ rowsPerPage: 12 }"
        class="text-grey-9"
      >
        <template v-slot:body-cell-sales="props">
          <q-td :props="props" class="text-weight-medium">
            ৳ {{ formatMoney(props.value) }}
          </q-td>
        </template>

        <template v-slot:body-cell-expense="props">
          <q-td :props="props" class="text-red-7 text-weight-medium">
            ৳ {{ formatMoney(props.value) }}
          </q-td>
        </template>

        <template v-slot:body-cell-profit="props">
          <q-td
            :props="props"
            class="text-weight-bold text-subtitle2"
            :class="(props.row.sales - props.row.expense) >= 0 ? 'text-green-7' : 'text-red-7'"
          >
            ৳ {{ formatMoney(props.row.sales - props.row.expense) }}
          </q-td>
        </template>

        <template v-slot:body-cell-margin="props">
          <q-td :props="props" class="text-center">
            <q-badge
              :color="getMarginColor(props.row)"
              class="q-pa-sm text-weight-bold shadow-1"
            >
              {{ calculateMargin(props.row) }}%
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn
              flat round dense
              color="negative"
              icon="delete"
              size="sm"
              @click="deleteRecord(props.row.month)"
            >
              <q-tooltip>Delete Record</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div
            class="full-width row flex-center flex-col text-grey-6 q-pa-xl column"
          >
            <q-icon size="4em" name="analytics" class="q-mb-md opacity-50" />
            <div class="text-h6">No financial data found.</div>
            <div class="text-caption">
              Click "Sync Month Data" or "Add Record" to generate reports.
            </div>
          </div>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="addDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-green-9 text-white row items-center justify-between q-pb-md">
          <div class="text-h6">Manual Income/Expense Record</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="saveRecord">
          <q-card-section class="q-pt-md q-gutter-md">
            <q-input
              filled
              v-model="form.month"
              label="Month / Period *"
              dense
              hint="e.g., June 2026 or Q1 2026"
              :rules="[val => !!val || 'Period is required']"
            />
            <q-input
              filled
              v-model.number="form.sales"
              type="number"
              label="Total Gross Income (৳) *"
              dense
              min="0"
              :rules="[val => val !== null || 'Income is required']"
            />
            <q-input
              filled
              v-model.number="form.expense"
              type="number"
              label="Total Expenses (৳) *"
              dense
              min="0"
              :rules="[val => val !== null || 'Expense is required']"
            />
          </q-card-section>

          <q-card-actions align="right" class="bg-grey-1 q-pa-md border-top">
            <q-btn flat label="Cancel" color="grey-8" v-close-popup />
            <q-btn
              unelevated
              label="Save Record"
              color="green-9"
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
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useQuasar } from "quasar";

export default {
  setup() {
    const $q = useQuasar();

    // --- State ---
    const isExporting = ref(false);
    const isSyncing = ref(false);
    const isSaving = ref(false);
    const addDialog = ref(false);

    // Form State
    const getInitialForm = () => ({ month: '', sales: null, expense: null });
    const form = reactive(getInitialForm());

    // --- Table Configuration ---
    const incomeCols = [
      { name: "month", label: "Month/Date", field: "month", align: "left", sortable: true },
      { name: "sales", label: "Sales Income (Gross)", field: "sales", align: "right", sortable: true },
      { name: "expense", label: "Total Expense", field: "expense", align: "right", sortable: true },
      { name: "profit", label: "Net Profit", field: "profit", align: "right" },
      { name: "margin", label: "Profit Margin", field: "margin", align: "center" },
      { name: "actions", label: "Actions", field: "actions", align: "right" }, // Added Actions column
    ];

    const incomeHistory = ref([]);

    // --- Core Logic ---
    onMounted(() => {
      const savedIncome = localStorage.getItem("saas_income_history");
      if (savedIncome) {
        incomeHistory.value = JSON.parse(savedIncome);
      } else {
        // Fallback Default Data
        incomeHistory.value = [
          { month: "May 2026", sales: 125000, expense: 45200 },
          { month: "April 2026", sales: 310000, expense: 120000 },
          { month: "March 2026", sales: 285000, expense: 115000 },
        ];
      }
    });

    // Auto-save changes
    watch(
      incomeHistory,
      (newVal) => {
        localStorage.setItem("saas_income_history", JSON.stringify(newVal));
      },
      { deep: true },
    );

    // --- Computed Summaries ---
    const totalGross = computed(() =>
      incomeHistory.value.reduce((sum, item) => sum + (item.sales || 0), 0),
    );
    const totalExpense = computed(() =>
      incomeHistory.value.reduce((sum, item) => sum + (item.expense || 0), 0),
    );
    const netProfit = computed(() => totalGross.value - totalExpense.value);

    // --- Methods ---
    const formatMoney = (val) => {
      return Number(val || 0).toLocaleString("en-IN");
    };

    const calculateMargin = (row) => {
      if (!row.sales || row.sales === 0) return 0;
      const profit = row.sales - row.expense;
      return ((profit / row.sales) * 100).toFixed(1);
    };

    const getMarginColor = (row) => {
      const margin = calculateMargin(row);
      if (margin >= 30) return "green-6";
      if (margin >= 15) return "orange-8";
      return "red-6";
    };

    // Advanced Cross-Module Data Sync
    const syncCurrentMonth = async () => {
      isSyncing.value = true;
      await new Promise((res) => setTimeout(res, 800)); // Simulated calculation delay

      const now = new Date();
      const yearMonthPrefix = now.toISOString().split("T")[0].substring(0, 7); // e.g. "2026-05"
      const currentMonthLabel = now.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      // 1. Calculate Sales from POS Invoices (INCOME)
      let currentSales = 0;
      const invoices = JSON.parse(
        localStorage.getItem("saas_invoices") || "[]",
      );
      invoices.forEach((inv) => {
        if (inv.date && inv.date.startsWith(yearMonthPrefix)) {
          let rawAmount = inv.totalRaw
            ? Number(inv.totalRaw)
            : Number(String(inv.total).replace(/[^0-9.-]+/g, ""));
          currentSales += rawAmount || 0;
        }
      });

      // 2. Calculate Expenses (Stock + Payroll + General Expenses)
      let currentExp = 0;

      const stocks = JSON.parse(localStorage.getItem("saas_stock_entries") || "[]");
      stocks.forEach((st) => {
        if (st.date && st.date.startsWith(yearMonthPrefix)) {
          currentExp += Number(st.totalCost || 0);
        }
      });

      const payroll = JSON.parse(localStorage.getItem("saas_payroll") || "[]");
      payroll.forEach((p) => {
        if (p.status === "Paid") {
          const netPay = (p.basic || 0) + (p.bonus || 0) - (p.deduction || 0);
          currentExp += Number(netPay);
        }
      });

      const generalExpenses = JSON.parse(localStorage.getItem("saas_expenses") || "[]");
      generalExpenses.forEach((exp) => {
        if (exp.date && exp.date.startsWith(yearMonthPrefix)) {
          currentExp += Number(exp.amount || 0);
        }
      });

      // 3. Update or Add to Table
      const index = incomeHistory.value.findIndex(
        (h) => h.month === currentMonthLabel,
      );

      if (index !== -1) {
        incomeHistory.value[index].sales = currentSales || incomeHistory.value[index].sales;
        incomeHistory.value[index].expense = currentExp || incomeHistory.value[index].expense;
      } else {
        incomeHistory.value.unshift({
          month: currentMonthLabel,
          sales: currentSales,
          expense: currentExp,
        });
      }

      isSyncing.value = false;
      $q.notify({
        color: "positive",
        message: "Current month data synced across all modules!",
        icon: "sync",
        position: "top-right",
      });
    };

    // --- Manual Record Logic ---
    const openAddDialog = () => {
      Object.assign(form, getInitialForm());
      addDialog.value = true;
    };

    const saveRecord = async () => {
      isSaving.value = true;
      await new Promise(res => setTimeout(res, 500));

      const index = incomeHistory.value.findIndex(h => h.month.toLowerCase() === form.month.toLowerCase());

      if (index !== -1) {
        // Update existing record for that month
        incomeHistory.value[index].sales = form.sales;
        incomeHistory.value[index].expense = form.expense;
        $q.notify({ color: "info", message: "Record updated successfully", icon: "update", position: "top-right" });
      } else {
        // Insert new record at the top
        incomeHistory.value.unshift({
          month: form.month,
          sales: form.sales,
          expense: form.expense,
        });
        $q.notify({ color: "positive", message: "New record added successfully", icon: "check_circle", position: "top-right" });
      }

      addDialog.value = false;
      isSaving.value = false;
    };

    const deleteRecord = (monthLabel) => {
      $q.dialog({
        title: "Confirm Deletion",
        message: `Are you sure you want to delete the record for <strong>${monthLabel}</strong>?`,
        html: true,
        cancel: true,
        persistent: true,
        color: "negative"
      }).onOk(() => {
        incomeHistory.value = incomeHistory.value.filter(row => row.month !== monthLabel);
        $q.notify({ color: "negative", message: "Record deleted", icon: "delete", position: "top-right" });
      });
    };

    // --- Export Logic ---
    const exportData = async (type) => {
      isExporting.value = true;
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (type === "CSV") {
        if (incomeHistory.value.length === 0) {
          $q.notify({ color: "warning", message: "No data to export", position: "top-right" });
          isExporting.value = false;
          return;
        }

        const headers = ["Month/Date", "Sales Income (Gross)", "Total Expense", "Net Profit", "Profit Margin (%)"];
        const csvContent = [
          headers.join(","),
          ...incomeHistory.value.map((row) => {
            const profit = row.sales - row.expense;
            const margin = calculateMargin(row);
            return `"${row.month}","${row.sales}","${row.expense}","${profit}","${margin}%"`;
          }),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", `financial_report_${new Date().toISOString().split("T")[0]}.csv`);
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        $q.notify({ color: "positive", message: "CSV Report downloaded!", icon: "download", position: "top-right" });
      } else {
        $q.notify({
          color: "info",
          message: "PDF Export requires an external library (e.g., jsPDF). CSV is fully functional.",
          icon: "info",
          position: "top-right",
        });
      }

      isExporting.value = false;
    };

    // --- Explicit Return ---
    return {
      incomeCols,
      incomeHistory,
      totalGross,
      totalExpense,
      netProfit,
      isExporting,
      isSyncing,
      isSaving,
      addDialog,
      form,
      formatMoney,
      calculateMargin,
      getMarginColor,
      syncCurrentMonth,
      exportData,
      openAddDialog,
      saveRecord,
      deleteRecord
    };
  },
};
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15) !important;
}
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.border-top {
  border-top: 1px solid #e0e0e0;
}
.opacity-50 {
  opacity: 0.5;
}
</style>
