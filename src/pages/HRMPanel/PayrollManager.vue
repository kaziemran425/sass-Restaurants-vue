<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-red-13 text-weight-bold">
        <q-icon name="payments" class="q-mr-sm" /> Payroll Manager
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          color="teal-13"
          icon="receipt_long"
          label="Generate Payroll"
          @click="generatePayroll"
          :loading="isGenerating"
          unelevated
        >
          <q-tooltip>Pull active employees into this month's payroll</q-tooltip>
        </q-btn>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4" v-for="item in stats" :key="item.label">
        <q-card
          :class="item.color"
          class="text-white shadow-2"
          style="border-radius: 12px; transition: transform 0.2s;"
        >
          <q-card-section class="row items-center justify-between q-pa-lg">
            <div>
              <div class="text-subtitle1 text-weight-medium" style="opacity: 0.85">
                {{ item.label }}
              </div>
              <div class="text-h4 text-weight-bolder q-mt-sm">{{ item.value }}</div>
            </div>
            <q-icon :name="item.icon" size="4em" style="opacity: 0.4" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered style="border-radius: 12px" class="bg-white">
      <q-table
        :rows="payrollData"
        :columns="payColumns"
        row-key="id"
        flat
        :loading="isLoading"
        :pagination="{ rowsPerPage: 15 }"
        class="text-grey-9"
      >
        <template v-slot:body-cell-basic="props">
          <q-td :props="props" class="text-right">৳ {{ formatMoney(props.row.basic) }}</q-td>
        </template>
        <template v-slot:body-cell-bonus="props">
          <q-td :props="props" class="text-right text-green-7">+ ৳ {{ formatMoney(props.row.bonus) }}</q-td>
        </template>
        <template v-slot:body-cell-deduction="props">
          <q-td :props="props" class="text-right text-red-6">- ৳ {{ formatMoney(props.row.deduction) }}</q-td>
        </template>

        <template v-slot:body-cell-net="props">
          <q-td :props="props" class="text-weight-bold text-primary text-right" style="font-size: 1.1em;">
            ৳ {{ formatMoney(props.row.basic + (props.row.bonus || 0) - (props.row.deduction || 0)) }}
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props" class="text-center">
            <q-badge :color="props.value === 'Paid' ? 'green-6' : 'orange-8'" class="q-px-sm q-py-xs text-weight-bold">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn
              v-if="props.row.status !== 'Paid'"
              flat
              round
              dense
              color="blue"
              icon="edit"
              size="sm"
              class="q-mr-sm"
              @click="openEditDialog(props.row)"
            >
              <q-tooltip>Edit Bonus / Deduction</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.status !== 'Paid'"
              unelevated
              size="sm"
              color="green-6"
              icon="done_all"
              label="Pay Now"
              class="text-weight-bold"
              @click="markAsPaid(props.row.id)"
            />
            <q-icon v-else name="check_circle" color="green-6" size="sm">
              <q-tooltip>Payment Completed</q-tooltip>
            </q-icon>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center flex-col text-grey-6 q-pa-xl column">
            <q-icon size="4em" name="account_balance_wallet" class="q-mb-md opacity-50" />
            <div class="text-h6">No payroll records generated.</div>
            <div class="text-caption">Click "Generate Payroll" to fetch active employees.</div>
          </div>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 350px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center justify-between q-pb-md">
          <div class="text-h6">Adjust Payroll</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="saveAdjustments">
          <q-card-section class="q-pt-md">
            <div class="text-subtitle1 text-weight-bold q-mb-md text-dark">{{ editForm.name }}</div>

            <q-input
              filled
              v-model.number="editForm.bonus"
              type="number"
              label="Bonus Amount (৳)"
              dense
              class="q-mb-md"
              hint="Additional earnings"
              min="0"
            />

            <q-input
              filled
              v-model.number="editForm.deduction"
              type="number"
              label="Deduction Amount (৳)"
              dense
              hint="Penalties, advances, or unpaid leave"
              min="0"
            />
          </q-card-section>

          <q-card-actions align="right" class="bg-grey-1 q-pa-md">
            <q-btn flat label="Cancel" color="grey-8" v-close-popup />
            <q-btn unelevated label="Save Changes" color="primary" type="submit" />
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
    const isLoading = ref(false);
    const isGenerating = ref(false);
    const payrollData = ref([]);
    const editDialog = ref(false);

    const editForm = reactive({
      id: null,
      name: '',
      bonus: 0,
      deduction: 0
    });

    // --- Table Columns ---
    const payColumns = [
      { name: "name", label: "Employee", field: "name", align: "left", sortable: true },
      { name: "basic", label: "Basic Salary", field: "basic", align: "right", sortable: true },
      { name: "bonus", label: "Bonus", field: "bonus", align: "right" },
      { name: "deduction", label: "Deductions", field: "deduction", align: "right" },
      { name: "net", label: "Net Payable", field: "net", align: "right", sortable: true },
      { name: "status", label: "Status", field: "status", align: "center", sortable: true },
      { name: "actions", label: "Actions", field: "actions", align: "right" },
    ];

    // --- Core Logic ---
    const formatMoney = (val) => Number(val || 0).toLocaleString("en-IN");

    const loadData = async () => {
      isLoading.value = true;
      await new Promise((res) => setTimeout(res, 400));

      const saved = localStorage.getItem("saas_payroll");
      if (saved) {
        payrollData.value = JSON.parse(saved);
      } else {
        payrollData.value = [];
      }
      isLoading.value = false;
    };

    onMounted(() => loadData());

    // Auto-save to LocalStorage
    watch(
      payrollData,
      (newVal) => localStorage.setItem("saas_payroll", JSON.stringify(newVal)),
      { deep: true },
    );

    // --- Computed Stats ---
    const stats = computed(() => {
      const getNet = (p) => (p.basic || 0) + (p.bonus || 0) - (p.deduction || 0);

      const total = payrollData.value.reduce((sum, p) => sum + getNet(p), 0);
      const paidEmps = payrollData.value.filter((p) => p.status === "Paid").length;
      const pendingTotal = payrollData.value
        .filter((p) => p.status !== "Paid")
        .reduce((sum, p) => sum + getNet(p), 0);

      return [
        {
          label: "Total Net Payroll",
          value: `৳ ${formatMoney(total)}`,
          color: "bg-primary",
          icon: "account_balance",
        },
        {
          label: "Paid Employees",
          value: `${paidEmps} / ${payrollData.value.length}`,
          color: "bg-green-7",
          icon: "people",
        },
        {
          label: "Pending Payment",
          value: `৳ ${formatMoney(pendingTotal)}`,
          color: "bg-orange-8",
          icon: "pending_actions",
        },
      ];
    });

    // --- Methods ---
    const generatePayroll = async () => {
      isGenerating.value = true;
      await new Promise((res) => setTimeout(res, 800));

      const emps = JSON.parse(localStorage.getItem("saas_employees") || "[]");

      if (emps.length > 0) {
        let addedCount = 0;

        // Smart generation: Only add employees who aren't already in the list
        emps.forEach((e) => {
          const exists = payrollData.value.find(p => p.id === e.id);
          if (!exists) {
            payrollData.value.push({
              id: e.id,
              name: e.name,
              basic: e.salary,
              bonus: 0,
              deduction: 0,
              status: "Pending",
            });
            addedCount++;
          }
        });

        if (addedCount > 0) {
          $q.notify({ color: "positive", message: `Generated payroll for ${addedCount} new employees.`, icon: "sync", position: 'top-right' });
        } else {
          $q.notify({ color: "info", message: "All active employees are already in the payroll.", icon: "info", position: 'top-right' });
        }
      } else {
        $q.notify({ color: "warning", message: "No employees found in the HRM system.", icon: "warning", position: 'top-right' });
      }
      isGenerating.value = false;
    };

    const openEditDialog = (row) => {
      editForm.id = row.id;
      editForm.name = row.name;
      editForm.bonus = row.bonus || 0;
      editForm.deduction = row.deduction || 0;
      editDialog.value = true;
    };

    const saveAdjustments = () => {
      const index = payrollData.value.findIndex(p => p.id === editForm.id);
      if (index !== -1) {
        payrollData.value[index].bonus = editForm.bonus;
        payrollData.value[index].deduction = editForm.deduction;
        $q.notify({ color: "positive", message: "Adjustments saved successfully.", icon: "check_circle", position: 'top-right' });
      }
      editDialog.value = false;
    };

    const markAsPaid = (id) => {
      $q.dialog({
        title: 'Confirm Payment',
        message: 'Are you sure you want to mark this employee as Paid? This will lock their record.',
        cancel: true,
        persistent: true,
        color: 'green'
      }).onOk(() => {
        const index = payrollData.value.findIndex((p) => p.id === id);
        if (index !== -1) {
          payrollData.value[index].status = "Paid";
          $q.notify({ color: "positive", message: "Payment recorded successfully.", icon: "done_all", position: 'top-right' });
        }
      });
    };

    // --- Explicit Return ---
    return {
      payrollData,
      payColumns,
      stats,
      isLoading,
      isGenerating,
      editDialog,
      editForm,
      formatMoney,
      generatePayroll,
      openEditDialog,
      saveAdjustments,
      markAsPaid,
    };
  },
};
</script>

<style scoped>
.opacity-50 {
  opacity: 0.5;
}
</style>
