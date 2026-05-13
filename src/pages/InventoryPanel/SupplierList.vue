<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">Vendor/Supplier List</div>
      <q-btn outline color="primary" icon="person_add" label="New Supplier" />
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="supplier in suppliers" :key="supplier.id" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="my-card">
          <q-item>
            <q-item-section avatar>
              <q-avatar color="blue-1" text-color="blue" icon="business" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{ supplier.name }}</q-item-label>
              <q-item-label caption>{{ supplier.contact }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-card-section>
            <div class="row items-center no-wrap">
              <q-icon name="phone" color="grey" class="q-mr-sm" />
              <span>{{ supplier.phone }}</span>
            </div>
            <div class="row items-center no-wrap q-mt-xs">
              <q-icon name="location_on" color="grey" class="q-mr-sm" />
              <span class="ellipsis">{{ supplier.address }}</span>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="View History" color="primary" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const suppliers = ref([
      { id: 1, name: 'City Group Ltd', contact: 'Mr. Rahim', phone: '01712xxxxxx', address: 'Motijheel, Dhaka' },
      { id: 2, name: 'Fresh Foods', contact: 'Sales Dept', phone: '01823xxxxxx', address: 'Uttara, Dhaka' },
      { id: 3, name: 'Local Poultry', contact: 'Akbar Ali', phone: '01911xxxxxx', address: 'Mirpur Market' }
    ])

    return { suppliers }
  }
}
</script>
