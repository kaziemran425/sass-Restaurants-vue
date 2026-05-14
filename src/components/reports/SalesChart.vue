<template>
  <q-card flat bordered class="q-pa-md">
    <div class="text-subtitle1 text-weight-bold q-mb-md">Sales Performance</div>
    <!-- এখানে আপনি চাইলে ApexCharts বা Chart.js ইন্টিগ্রেট করতে পারেন -->
    <div class="bg-grey-2 flex flex-center" style="height: 200px; border-radius: 8px">
       [ Sales Graph Placeholder ]
    </div>
    <div class="row justify-around q-mt-md">
      <div class="text-center">
        <div class="text-caption">Today</div>
        <div class="text-h6">৳ 5.2k</div>
      </div>
      <div class="text-center">
        <div class="text-caption">Monthly</div>
        <div class="text-h6">৳ 1.4L</div>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  setup() {
    return {}
  }
}
</script>
