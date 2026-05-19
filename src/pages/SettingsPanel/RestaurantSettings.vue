<template>
  <q-page padding>
    <div class="text-h5 text-weight-bold q-mb-md">
      <q-icon name="storefront" class="q-mr-sm text-primary" /> Restaurant Configuration
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card flat bordered style="border-radius: 12px;">
          <q-card-section class="bg-grey-1">
            <div class="text-h6">General Information</div>
            <div class="text-caption text-grey-7">Update your restaurant's public details and billing info.</div>
          </q-card-section>
          <q-separator />

          <q-form @submit.prevent="saveSettings">
            <q-card-section class="q-gutter-md q-pt-lg">
              <q-input outlined v-model="form.name" label="Restaurant Name" bg-color="white" />

              <div class="row q-col-gutter-sm">
                <q-input outlined v-model="form.email" type="email" label="Contact Email" class="col-12 col-sm-6" bg-color="white" />
                <q-input outlined v-model="form.phone" type="tel" label="Contact Phone" class="col-12 col-sm-6" bg-color="white" />
              </div>

              <q-input outlined v-model="form.address" type="textarea" autogrow label="Business Address" bg-color="white" />

              <div class="text-subtitle2 q-mt-md">Billing Preferences</div>
              <q-separator class="q-mb-sm" />

              <div class="row q-col-gutter-sm">
                <q-select outlined v-model="form.currency" :options="['BDT (৳)', 'USD ($)', 'EUR (€)']" label="Currency" class="col-12 col-sm-6" bg-color="white" />
                <q-input outlined v-model.number="form.taxRate" type="number" label="Default Tax / VAT Rate (%)" class="col-12 col-sm-6" bg-color="white" />
              </div>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md bg-grey-1">
              <q-btn unelevated color="primary" type="submit" label="Save Changes" icon="save" :loading="isSaving" class="q-px-md text-weight-bold" />
            </q-card-actions>
          </q-form>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered style="border-radius: 12px;" class="text-center q-pa-md">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Restaurant Logo</div>
            <q-avatar size="120px" class="shadow-2 q-mb-md">
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
            </q-avatar>
            <q-file outlined dense v-model="logoFile" label="Upload New Logo" accept="image/*">
              <template v-slot:prepend><q-icon name="cloud_upload" /></template>
            </q-file>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const isSaving = ref(false)
    const logoFile = ref(null)

    const form = reactive({
      name: 'RestoSaaS Demo',
      email: 'contact@restosaas.com',
      phone: '+880 1700 000000',
      address: 'Mirpur, Dhaka, Bangladesh',
      currency: 'BDT (৳)',
      taxRate: 5
    })

    onMounted(() => {
      const saved = localStorage.getItem('saas_restaurant_settings')
      if(saved) Object.assign(form, JSON.parse(saved))
    })

    const saveSettings = async () => {
      isSaving.value = true
      await new Promise(res => setTimeout(res, 600))

      localStorage.setItem('saas_restaurant_settings', JSON.stringify(form))

      isSaving.value = false
      $q.notify({ color: 'positive', message: 'Settings saved successfully!', icon: 'check_circle' })
    }

    return { form, isSaving, logoFile, saveSettings }
  }
}
</script>
