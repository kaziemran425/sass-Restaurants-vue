<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold text-indigo-10">
        <q-icon name="workspace_premium" class="q-mr-sm" /> Subscription Pricing Plans
      </div>
      <q-btn color="indigo" icon="add" label="Create Custom Plan" @click="openCreateDialog" />
    </div>

    <div v-if="isLoading" class="flex flex-center q-pa-xl">
      <q-spinner-dots color="indigo" size="4em" />
    </div>

    <div v-else class="row q-col-gutter-lg justify-center">
      <div v-for="plan in plans" :key="plan.id" class="col-12 col-md-4">
        <q-card
          flat bordered
          class="pricing-card text-center q-pa-md full-height bg-white relative-position shadow-2"
          :class="{'border-primary': plan.isPopular}"
        >
          <q-badge v-if="plan.isPopular" color="orange" label="Most Popular" class="absolute-top-right q-ma-md q-pa-xs" />

          <q-card-section>
            <div class="text-h6 text-indigo text-uppercase text-weight-bold">{{ plan.title }}</div>
            <div class="text-h3 text-weight-bolder text-dark q-my-md">
              ৳ {{ formatMoney(plan.price) }}<span class="text-subtitle1 text-weight-regular text-grey-6">/mo</span>
            </div>

            <q-separator inset class="q-my-md" />

            <q-list dense class="q-mb-md text-left">
              <q-item v-for="feature in plan.features" :key="feature" class="q-px-none">
                <q-item-section avatar class="min-width-auto q-pr-sm">
                  <q-icon name="check_circle" color="positive" size="sm" />
                </q-item-section>
                <q-item-section class="text-body2 text-grey-9">{{ feature }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions class="absolute-bottom q-pa-lg bg-white" style="bottom: 0; width: 100%;">
            <q-btn
              :outline="!plan.isPopular"
              :unelevated="plan.isPopular"
              color="indigo"
              label="Edit Plan Settings"
              class="full-width text-weight-bold"
              @click="openEditDialog(plan)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 350px; border-radius: 12px;">
        <q-card-section class="bg-indigo text-white row justify-between items-center">
          <div class="text-h6">Edit {{ selectedPlan?.title }} Plan</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="savePlan">
          <q-card-section class="q-pt-md">
            <q-input filled v-model.number="editForm.price" type="number" label="Monthly Price (৳)" dense />
            <q-toggle v-model="editForm.isPopular" label="Mark as Most Popular" color="orange" class="q-mt-md" />
          </q-card-section>

          <q-card-actions align="right" class="bg-grey-1">
            <q-btn flat label="Cancel" color="grey" v-close-popup />
            <q-btn unelevated label="Save Changes" type="submit" color="indigo" :loading="isSaving" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="createDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-indigo text-white row justify-between items-center">
          <div class="text-h6">Create Custom Plan</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="createPlan">
          <q-card-section class="q-pt-md">
            <q-input filled v-model="createForm.title" label="Plan Title" dense class="q-mb-md" :rules="[val => !!val || 'Title is required']" />
            <q-input filled v-model.number="createForm.price" type="number" label="Monthly Price (৳)" dense class="q-mb-md" :rules="[val => val !== null && val !== '' || 'Price is required']" />
            <q-input filled v-model="createForm.features" type="textarea" label="Features" dense rows="4" hint="Enter each feature on a new line" />
            <q-toggle v-model="createForm.isPopular" label="Mark as Most Popular" color="orange" class="q-mt-sm" />
          </q-card-section>

          <q-card-actions align="right" class="bg-grey-1">
            <q-btn flat label="Cancel" color="grey" v-close-popup />
            <q-btn unelevated label="Create Plan" type="submit" color="indigo" :loading="isCreating" />
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

    // Edit specific state
    const isSaving = ref(false)
    const editDialog = ref(false)
    const selectedPlan = ref(null)
    const editForm = reactive({ price: 0, isPopular: false })

    // Create specific state
    const isCreating = ref(false)
    const createDialog = ref(false)
    const createForm = reactive({ title: '', price: 0, features: '', isPopular: false })

    const plans = ref([])

    const formatMoney = (val) => Number(val || 0).toLocaleString('en-IN')

    const loadPlans = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400))
      const saved = localStorage.getItem('saas_subscription_plans')
      if (saved) {
        plans.value = JSON.parse(saved)
      } else {
        plans.value = [
          {
            id: 1, title: 'Basic', price: 1000, isPopular: false,
            features: ['Up to 1000 Invoices/mo', '1 User Access', 'Standard Reports', 'Basic POS']
          },
          {
            id: 2, title: 'Professional', price: 3000, isPopular: true,
            features: ['Unlimited Invoices', '5 User Access', 'Inventory Management', 'HRM Access', 'Live KDS']
          },
          {
            id: 3, title: 'Enterprise', price: 5000, isPopular: false,
            features: ['Everything in Pro', 'Unlimited Users', 'Dedicated Support', 'Custom Branding', 'API Access']
          }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadPlans())

    watch(plans, (newVal) => {
      localStorage.setItem('saas_subscription_plans', JSON.stringify(newVal))
    }, { deep: true })

    // --- Edit Logic ---
    const openEditDialog = (plan) => {
      selectedPlan.value = plan
      editForm.price = plan.price
      editForm.isPopular = plan.isPopular
      editDialog.value = true
    }

    const savePlan = async () => {
      isSaving.value = true
      await new Promise(res => setTimeout(res, 500))

      const index = plans.value.findIndex(p => p.id === selectedPlan.value.id)
      if(index !== -1) {
        if(editForm.isPopular) {
          plans.value.forEach(p => p.isPopular = false)
        }
        plans.value[index].price = editForm.price
        plans.value[index].isPopular = editForm.isPopular
      }

      isSaving.value = false
      editDialog.value = false
      $q.notify({ color: 'positive', message: 'Plan updated successfully!', icon: 'check_circle' })
    }

    // --- Create Logic ---
    const openCreateDialog = () => {
      // Reset form fields
      createForm.title = ''
      createForm.price = 0
      createForm.features = ''
      createForm.isPopular = false
      createDialog.value = true
    }

    const createPlan = async () => {
      isCreating.value = true
      await new Promise(res => setTimeout(res, 500))

      // Parse features from text area (split by new line)
      const featuresArray = createForm.features
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0)

      const newPlan = {
        id: Date.now(), // Generate a unique ID based on timestamp
        title: createForm.title,
        price: createForm.price,
        isPopular: createForm.isPopular,
        features: featuresArray
      }

      // If marked as popular, remove popular from others
      if(createForm.isPopular) {
        plans.value.forEach(p => p.isPopular = false)
      }

      // Add to array
      plans.value.push(newPlan)

      isCreating.value = false
      createDialog.value = false
      $q.notify({ color: 'positive', message: 'Custom plan created successfully!', icon: 'check_circle' })
    }

    return {
      plans, isLoading, formatMoney,

      // Edit Returns
      isSaving, editDialog, selectedPlan, editForm, openEditDialog, savePlan,

      // Create Returns
      isCreating, createDialog, createForm, openCreateDialog, createPlan
    }
  }
}
</script>

<style scoped>
.pricing-card {
  border-radius: 16px;
  padding-bottom: 80px !important; /* Space for the absolute button */
  transition: transform 0.3s;
}
.pricing-card:hover {
  transform: translateY(-5px);
}
.border-primary {
  border: 2px solid var(--q-primary) !important;
}
.min-width-auto { min-width: auto; }
</style>
