<template>
  <q-page padding>
    <div class="text-h5 q-mb-md text-weight-bold">Billing Dashboard</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-4">
        <q-card class="bg-blue text-white">
          <q-card-section>
            <div class="text-subtitle2">Today's Sales</div>
            <div class="text-h4">৳ 12,500</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card class="bg-green text-white">
          <q-card-section>
            <div class="text-subtitle2">Orders Completed</div>
            <div class="text-h4">42</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card class="bg-orange text-white">
          <q-card-section>
            <div class="text-subtitle2">Pending Orders</div>
            <div class="text-h4">05</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  setup() {
    return {}
  }
}
</script>
