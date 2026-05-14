<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">Manage All Tenants</div>
      <q-input dense filled v-model="filter" placeholder="Search by name or owner...">
        <template v-slot:append><q-icon name="search" /></template>
      </q-input>
    </div>

    <q-table
      :rows="tenants"
      :columns="tenantCols"
      row-key="id"
      flat
      bordered
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-btn-toggle
            v-model="props.row.status"
            toggle-color="green"
            dense
            :options="[
              {label: 'Active', value: 'active'},
              {label: 'Suspended', value: 'suspended'}
            ]"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round icon="visibility" color="primary" size="sm" />
          <q-btn flat round icon="delete" color="negative" size="sm" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const filter = ref('')
    const tenantCols = [
      { name: 'name', label: 'Restaurant', field: 'name', align: 'left' },
      { name: 'email', label: 'Email', field: 'email', align: 'left' },
      { name: 'plan', label: 'Plan', field: 'plan' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' },
      { name: 'actions', label: 'Actions', align: 'right' }
    ]

    const tenants = ref([
      { id: 1, name: 'Sultans Dine', email: 'owner@sultans.com', plan: 'Premium', status: 'active' },
      { id: 2, name: 'Burger King Local', email: 'king@bk.com', plan: 'Basic', status: 'suspended' }
    ])

    return { filter, tenantCols, tenants }
  }
}
</script>
