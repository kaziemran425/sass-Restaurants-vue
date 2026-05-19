<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-red-13 text-weight-bold">
        <q-icon name="local_shipping" class="q-mr-sm" /> Vendor / Supplier List
      </div>
      <div class="row q-gutter-sm items-center">
        <q-input
          outlined
          dense
          v-model="searchQuery"
          placeholder="Search suppliers..."
          bg-color="white"
          style="width: 250px"
          clearable
        >
          <template v-slot:append><q-icon name="search" /></template>
        </q-input>
        <q-btn color="teal-13" icon="person_add" label="New Supplier" @click="openDialog()" />
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-center column" style="height: 40vh;">
      <q-spinner-dots color="primary" size="3em" />
      <div class="text-grey-6 q-mt-sm">Loading suppliers...</div>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div v-for="supplier in filteredSuppliers" :key="supplier.id" class="col-12 col-sm-6 col-lg-4">
        <q-card flat bordered class="supplier-card shadow-1 column full-height bg-white">
          <q-item class="q-py-md bg-grey-1 border-bottom">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" icon="business" size="lg" class="shadow-1" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold text-h6 text-dark ellipsis" :title="supplier.name">
                {{ supplier.name }}
              </q-item-label>
              <q-item-label caption class="text-grey-8">Contact: {{ supplier.contact }}</q-item-label>
            </q-item-section>
            <q-item-section side class="row items-center no-wrap">
              <q-btn flat round dense color="blue-7" icon="edit" size="sm" class="q-mr-xs" @click="openDialog(supplier)">
                <q-tooltip>Edit</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="negative" icon="delete" size="sm" @click="deleteSupplier(supplier.id)">
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>

          <q-card-section class="col q-pt-md">
            <div class="row items-center no-wrap q-mb-sm text-grey-9">
              <q-icon name="phone" color="primary" class="q-mr-sm" size="sm" />
              <span class="text-weight-medium">{{ supplier.phone }}</span>
            </div>
            <div class="row items-start no-wrap text-grey-9">
              <q-icon name="location_on" color="primary" class="q-mr-sm q-mt-xs" size="sm" />
              <span class="text-grey-8" style="line-height: 1.4;">{{ supplier.address || 'No address provided' }}</span>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="bg-grey-1 q-pa-sm">
            <q-btn
              flat
              label="View History"
              color="primary"
              size="sm"
              icon-right="arrow_forward"
              @click="viewHistory(supplier)"
            />
          </q-card-actions>
        </q-card>
      </div>

      <div v-if="filteredSuppliers.length === 0" class="col-12 flex flex-center column q-pa-xl text-grey-6" style="min-height: 30vh;">
        <q-icon name="person_off" size="5em" class="opacity-50 q-mb-md" />
        <div class="text-h6">{{ searchQuery ? 'No suppliers match your search.' : 'No suppliers added yet.' }}</div>
        <div class="text-caption" v-if="!searchQuery">Click "New Supplier" to build your vendor list.</div>
      </div>
    </div>

    <q-dialog v-model="supplierDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center justify-between q-pb-md">
          <div class="text-h6">{{ isEditMode ? 'Edit Supplier' : 'Register Supplier' }}</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="saveSupplier">
          <q-card-section class="q-gutter-sm q-pt-md">
            <q-input filled v-model="form.name" label="Company Name *" dense autofocus :rules="[val => !!val || 'Required']" />
            <q-input filled v-model="form.contact" label="Contact Person *" dense :rules="[val => !!val || 'Required']" />
            <q-input filled v-model="form.phone" label="Phone Number *" type="tel" dense :rules="[val => !!val || 'Required']" />
            <q-input filled v-model="form.address" label="Full Address" type="textarea" autogrow dense />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md bg-grey-1">
            <q-btn flat label="Cancel" color="grey-8" v-close-popup />
            <q-btn unelevated :label="isEditMode ? 'Update Supplier' : 'Save Supplier'" type="submit" color="primary" :loading="isSaving" />
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
    const isLoading = ref(false)
    const isSaving = ref(false)
    const supplierDialog = ref(false)
    const suppliers = ref([])
    const searchQuery = ref('')

    // Edit Tracking
    const isEditMode = ref(false)
    const editId = ref(null)

    // Form Initialization
    const getInitialForm = () => ({ name: '', contact: '', phone: '', address: '' })
    const form = reactive(getInitialForm())

    // --- Computed ---
    const filteredSuppliers = computed(() => {
      if (!searchQuery.value) return suppliers.value

      const lowerCaseQuery = searchQuery.value.toLowerCase()
      return suppliers.value.filter(s =>
        s.name.toLowerCase().includes(lowerCaseQuery) ||
        s.contact.toLowerCase().includes(lowerCaseQuery) ||
        s.phone.includes(lowerCaseQuery)
      )
    })

    // --- Core Logic ---
    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400)) // Simulated API Delay

      const saved = localStorage.getItem('saas_suppliers')
      if (saved) {
        suppliers.value = JSON.parse(saved)
      } else {
        // Fallback dummy data
        suppliers.value = [
          { id: 1, name: 'City Group Ltd', contact: 'Mr. Rahim', phone: '01712xxxxxx', address: 'Motijheel, Dhaka' },
          { id: 2, name: 'Fresh Foods', contact: 'Sales Dept', phone: '01823xxxxxx', address: 'Uttara, Dhaka' },
          { id: 3, name: 'Local Poultry', contact: 'Akbar Ali', phone: '01911xxxxxx', address: 'Mirpur Market' }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadData())

    // Auto-save to LocalStorage
    watch(suppliers, (newVal) => {
      localStorage.setItem('saas_suppliers', JSON.stringify(newVal))
    }, { deep: true })

    // --- Methods ---
    const openDialog = (supplier = null) => {
      if (supplier) {
        // Edit Mode
        isEditMode.value = true
        editId.value = supplier.id
        Object.assign(form, {
          name: supplier.name,
          contact: supplier.contact,
          phone: supplier.phone,
          address: supplier.address
        })
      } else {
        // Create Mode
        isEditMode.value = false
        editId.value = null
        Object.assign(form, getInitialForm())
      }
      supplierDialog.value = true
    }

    const saveSupplier = async () => {
      isSaving.value = true
      await new Promise(res => setTimeout(res, 500))

      if (isEditMode.value) {
        // Update existing
        const index = suppliers.value.findIndex(s => s.id === editId.value)
        if (index !== -1) {
          suppliers.value[index] = { ...suppliers.value[index], ...form }
          $q.notify({ color: 'positive', message: 'Supplier updated successfully', icon: 'check_circle', position: 'top-right' })
        }
      } else {
        // Create new
        suppliers.value.unshift({
          id: Date.now(),
          ...form
        })
        $q.notify({ color: 'positive', message: 'Supplier added successfully', icon: 'check_circle', position: 'top-right' })
      }

      supplierDialog.value = false
      isSaving.value = false
    }

    const deleteSupplier = (id) => {
      $q.dialog({
        title: 'Confirm Deletion',
        message: 'Are you sure you want to remove this supplier? This action cannot be undone.',
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(() => {
        suppliers.value = suppliers.value.filter(s => s.id !== id)
        $q.notify({ color: 'negative', message: 'Supplier removed', icon: 'delete', position: 'top-right' })
      })
    }

    const viewHistory = (supplier) => {
      // Placeholder for routing to a detailed history page
      $q.notify({
        color: 'info',
        message: `Fetching transaction history for ${supplier.name}...`,
        icon: 'history',
        position: 'top-right'
      })
    }

    // --- Explicit Return ---
    return {
      suppliers,
      filteredSuppliers,
      searchQuery,
      supplierDialog,
      isEditMode,
      form,
      isLoading,
      isSaving,
      openDialog,
      saveSupplier,
      deleteSupplier,
      viewHistory
    }
  }
}
</script>

<style scoped>
.supplier-card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #e0e0e0;
}
.supplier-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1) !important;
  border-color: var(--q-primary);
}
.border-bottom {
  border-bottom: 1px solid #eeeeee;
}
.opacity-50 {
  opacity: 0.5;
}
</style>
