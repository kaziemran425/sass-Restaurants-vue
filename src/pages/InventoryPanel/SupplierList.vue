<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">
        <q-icon name="local_shipping" class="q-mr-sm text-primary" /> Vendor / Supplier List
      </div>
      <q-btn color="primary" icon="person_add" label="New Supplier" @click="openDialog" />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-center" style="height: 30vh;">
      <q-spinner-dots color="primary" size="3em" />
    </div>

    <div v-else class="row q-col-gutter-md">
      <div v-for="supplier in suppliers" :key="supplier.id" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="supplier-card shadow-1">
          <q-item class="q-py-md">
            <q-item-section avatar>
              <q-avatar color="blue-1" text-color="primary" icon="business" size="xl" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold text-h6">{{ supplier.name }}</q-item-label>
              <q-item-label caption class="text-grey-8">Contact: {{ supplier.contact }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteSupplier(supplier.id)" />
            </q-item-section>
          </q-item>

          <q-separator inset />

          <q-card-section class="q-pt-sm">
            <div class="row items-center no-wrap q-mb-xs">
              <q-icon name="phone" color="grey-7" class="q-mr-sm" size="sm" />
              <span class="text-weight-medium">{{ supplier.phone }}</span>
            </div>
            <div class="row items-center no-wrap">
              <q-icon name="location_on" color="grey-7" class="q-mr-sm" size="sm" />
              <span class="ellipsis text-grey-9">{{ supplier.address }}</span>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="bg-grey-1">
            <q-btn flat label="View History" color="primary" size="sm" />
          </q-card-actions>
        </q-card>
      </div>

      <div v-if="suppliers.length === 0" class="col-12 text-center q-pa-xl text-grey">
        <q-icon name="person_off" size="4em" />
        <div class="text-h6 q-mt-md">No suppliers added yet.</div>
      </div>
    </div>

    <!-- Add Supplier Dialog -->
    <q-dialog v-model="supplierDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center justify-between">
          <div class="text-h6">Register Supplier</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="saveSupplier">
          <q-card-section class="q-gutter-sm q-pt-md">
            <q-input filled v-model="form.name" label="Company Name *" dense :rules="[val => !!val || 'Required']" />
            <q-input filled v-model="form.contact" label="Contact Person *" dense :rules="[val => !!val || 'Required']" />
            <q-input filled v-model="form.phone" label="Phone Number *" type="tel" dense :rules="[val => !!val || 'Required']" />
            <q-input filled v-model="form.address" label="Address" type="textarea" autogrow dense />
          </q-card-section>
          <q-card-actions align="right" class="q-pb-md q-pr-md bg-grey-1">
            <q-btn flat label="Cancel" color="grey" v-close-popup />
            <q-btn unelevated label="Save Supplier" type="submit" color="primary" :loading="isSaving" />
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
    const isLoading = ref(false)
    const isSaving = ref(false)
    const supplierDialog = ref(false)
    const suppliers = ref([])

    const getInitialForm = () => ({ name: '', contact: '', phone: '', address: '' })
    const form = reactive(getInitialForm())

    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400))
      const saved = localStorage.getItem('saas_suppliers')
      if (saved) {
        suppliers.value = JSON.parse(saved)
      } else {
        suppliers.value = [
          { id: 1, name: 'City Group Ltd', contact: 'Mr. Rahim', phone: '01712xxxxxx', address: 'Motijheel, Dhaka' },
          { id: 2, name: 'Fresh Foods', contact: 'Sales Dept', phone: '01823xxxxxx', address: 'Uttara, Dhaka' },
          { id: 3, name: 'Local Poultry', contact: 'Akbar Ali', phone: '01911xxxxxx', address: 'Mirpur Market' }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadData())

    watch(suppliers, (newVal) => {
      localStorage.setItem('saas_suppliers', JSON.stringify(newVal))
    }, { deep: true })

    const openDialog = () => {
      Object.assign(form, getInitialForm())
      supplierDialog.value = true
    }

    const saveSupplier = async () => {
      isSaving.value = true
      await new Promise(res => setTimeout(res, 500))

      suppliers.value.unshift({
        id: Date.now(),
        ...form
      })

      supplierDialog.value = false
      isSaving.value = false
      $q.notify({ color: 'positive', message: 'Supplier added successfully', icon: 'check_circle' })
    }

    const deleteSupplier = (id) => {
      $q.dialog({ title: 'Confirm Deletion', message: 'Remove this supplier?', cancel: true }).onOk(() => {
        suppliers.value = suppliers.value.filter(s => s.id !== id)
        $q.notify({ color: 'negative', message: 'Supplier removed', icon: 'delete' })
      })
    }

    return { suppliers, supplierDialog, form, isLoading, isSaving, openDialog, saveSupplier, deleteSupplier }
  }
}
</script>

<style scoped>
.supplier-card { border-radius: 12px; transition: transform 0.2s; }
.supplier-card:hover { transform: translateY(-4px); border-color: var(--q-primary); }
</style>
