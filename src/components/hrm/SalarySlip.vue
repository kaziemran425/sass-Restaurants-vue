<template>
  <q-card flat bordered class="q-pa-md bg-grey-1">
    <div class="text-center">
      <div class="text-h6">Salary Statement</div>
      <div class="text-caption">Monthly Payroll - May 2026</div>
    </div>

    <q-separator q-my-md />

    <div class="row justify-between q-mb-xs">
      <span>Basic Salary:</span>
      <span class="text-weight-bold">৳ {{ basic }}</span>
    </div>
    <div class="row justify-between q-mb-xs text-green">
      <span>Bonus:</span>
      <span class="text-weight-bold">+ ৳ {{ bonus }}</span>
    </div>
    <div class="row justify-between q-mb-xs text-red">
      <span>Deductions:</span>
      <span class="text-weight-bold">- ৳ {{ deduction }}</span>
    </div>

    <q-separator spaced />

    <div class="row justify-between text-h6 text-primary">
      <span>Net Payable:</span>
      <span>৳ {{ basic + bonus - deduction }}</span>
    </div>

    <q-btn outline color="primary" icon="print" label="Print Slip" class="full-width q-mt-md" />
  </q-card>
</template>

<script>
export default {
  props: {
    basic: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    deduction: { type: Number, default: 0 }
  },
  setup() {
    return {}
  }
}
</script>
