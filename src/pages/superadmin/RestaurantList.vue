<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-indigo-10">
        <q-icon name="business" class="q-mr-sm" /> Manage Tenants (Restaurants)
      </div>
      <div class="row q-gutter-sm">
        <q-input dense outlined bg-color="white" v-model="filter" placeholder="Search by name...">
          <template v-slot:append><q-icon name="search" /></template>
        </q-input>
        <q-btn color="indigo" icon="add" label="Add Tenant" @click="tenantDialog = true" />
      </div>
    </div>

    <q-card flat bordered style="border-radius: 12px;">
      <q-table
        :rows="tenants"
        :columns="tenantCols"
        row-key="id"
        flat
        :filter="filter"
        :loading="isLoading"
      >
        <template v-slot:body-cell-plan="props">
          <q-td :props="props" class="text-weight-bold">
            {{ props.value }}
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn-toggle
              v-model="props.row.status"
              :options="[ {label: 'Active', value: 'Active'}, {label: 'Suspended', value: 'Suspended'} ]"
              dense
              spread
              no-caps
              toggle-color="green"
              color="white"
              text-color="grey-8"
              class="border-grey"
              @update:model-value="updateStatus(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round dense color="primary" icon="visibility" size="sm" class="q-mr-xs" @click="openEditDialog(props.row)" />
            <q-btn flat round dense color="negative" icon="delete" size="sm" @click="deleteTenant(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="tenantDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-indigo text-white row items-center justify-between">
          <div class="text-h6">Register New Tenant</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="saveTenant">
          <q-card-section class="q-pt-md q-gutter-sm">
            <q-input filled v-model="form.name" label="Restaurant Name *" dense :rules="[val => !!val || 'Required']" />
            <q-input filled v-model="form.owner" label="Owner Name *" dense :rules="[val => !!val || 'Required']" />
            <q-input filled v-model="form.email" label="Email Address *" type="email" dense :rules="[val => !!val || 'Required']" />

            <q-select
              filled dense
              v-model="form.plan"
              :options="['Basic', 'Professional', 'Enterprise']"
              label="Subscription Plan *"
            />
          </q-card-section>

          <q-card-actions align="right" class="bg-grey-1 q-pa-md">
            <q-btn flat label="Cancel" color="grey" v-close-popup />
            <q-btn unelevated label="Create Tenant" type="submit" color="indigo" :loading="isSaving" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center justify-between">
          <div class="text-h6">Edit Tenant Information</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="updateTenant">
          <q-card-section class="q-pt-md q-gutter-sm">
            <q-input filled v-model="editForm.name" label="Restaurant Name *" dense :rules="[val => !!val || 'Required']" />
            <q-input filled v-model="editForm.owner" label="Owner Name *" dense :rules="[val => !!val || 'Required']" />
            <q-input filled v-model="editForm.email" label="Email Address *" type="email" dense :rules="[val => !!val || 'Required']" />

            <q-select
              filled dense
              v-model="editForm.plan"
              :options="['Basic', 'Professional', 'Enterprise']"
              label="Subscription Plan *"
            />
          </q-card-section>

          <q-card-actions align="right" class="bg-grey-1 q-pa-md">
            <q-btn flat label="Cancel" color="grey" v-close-popup />
            <q-btn unelevated label="Save Changes" type="submit" color="primary" :loading="isUpdating" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const filter = ref('')
    const isLoading = ref(false)
    const isSaving = ref(false)
    const tenantDialog = ref(false)
    const tenants = ref([])

    const form = reactive({ name: '', owner: '', email: '', plan: 'Professional' })

    // Edit specific state
    const editDialog = ref(false)
    const isUpdating = ref(false)
    const editForm = reactive({ id: null, name: '', owner: '', email: '', plan: '' })

    const tenantCols = [
      { name: 'name', label: 'Restaurant', field: 'name', align: 'left', sortable: true },
      { name: 'owner', label: 'Owner', field: 'owner', align: 'left' },
      { name: 'email', label: 'Email', field: 'email', align: 'left' },
      { name: 'plan', label: 'Plan', field: 'plan', align: 'left' },
      { name: 'status', label: 'Access Control', field: 'status', align: 'center' },
      { name: 'actions', label: 'Actions', align: 'right' }
    ]

    const getFeeByPlan = (plan) => {
      if (plan === 'Basic') return 1000
      if (plan === 'Professional') return 3000
      if (plan === 'Enterprise') return 5000
      return 0
    }

    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 500))
      const saved = localStorage.getItem('saas_restaurants')
      if (saved) tenants.value = JSON.parse(saved)
      isLoading.value = false
    }

    onMounted(() => loadData())

    watch(tenants, (newVal) => {
      localStorage.setItem('saas_restaurants', JSON.stringify(newVal))
    }, { deep: true })

    const saveTenant = async () => {
      isSaving.value = true
      await new Promise(res => setTimeout(res, 600))

      tenants.value.unshift({
        id: Date.now(),
        ...form,
        status: 'Active',
        fee: getFeeByPlan(form.plan)
      })

      tenantDialog.value = false
      isSaving.value = false
      Object.assign(form, { name: '', owner: '', email: '', plan: 'Professional' })
      $q.notify({ color: 'positive', message: 'Tenant successfully created!', icon: 'check_circle' })
    }

    // --- Edit Logic ---
    const openEditDialog = (tenant) => {
      editForm.id = tenant.id
      editForm.name = tenant.name
      editForm.owner = tenant.owner
      editForm.email = tenant.email
      editForm.plan = tenant.plan
      editDialog.value = true
    }

    const updateTenant = async () => {
      isUpdating.value = true
      await new Promise(res => setTimeout(res, 500))

      const index = tenants.value.findIndex(t => t.id === editForm.id)
      if (index !== -1) {
        tenants.value[index] = {
          ...tenants.value[index], // Keep other properties like status intact
          name: editForm.name,
          owner: editForm.owner,
          email: editForm.email,
          plan: editForm.plan,
          fee: getFeeByPlan(editForm.plan) // Update fee if plan was changed
        }
      }

      isUpdating.value = false
      editDialog.value = false
      $q.notify({ color: 'positive', message: 'Tenant updated successfully!', icon: 'check_circle' })
    }

    const updateStatus = async (tenant) => {
      $q.notify({
        color: tenant.status === 'Active' ? 'positive' : 'negative',
        message: `${tenant.name} is now ${tenant.status}`,
        icon: 'admin_panel_settings'
      })
    }

    const deleteTenant = (id) => {
      $q.dialog({
        title: 'Danger Area',
        message: 'Are you sure you want to delete this tenant completely?',
        cancel: true,
        color: 'negative'
      }).onOk(() => {
        tenants.value = tenants.value.filter(t => t.id !== id)
        $q.notify({ color: 'negative', message: 'Tenant deleted', icon: 'delete' })
      })
    }

    // Explicit return block exporting all state and methods to the template
    return {
      filter,
      tenantCols,
      tenants,
      tenantDialog,
      form,
      isLoading,
      isSaving,
      saveTenant,
      updateStatus,
      deleteTenant,
      editDialog,
      editForm,
      isUpdating,
      openEditDialog,
      updateTenant
    }
  }
}
</script>

<style scoped>
.border-grey {
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
