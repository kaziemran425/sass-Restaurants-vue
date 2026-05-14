<template>
  <q-page padding>
    <div class="text-h5 q-mb-md text-weight-bold">Restaurant Configuration</div>

    <div class="row q-col-gutter-lg">
      <!-- General Settings -->
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section class="bg-blue-1 text-primary text-subtitle1 text-weight-bold">
            Basic Information
          </q-card-section>

          <q-card-section class="q-gutter-md">
            <div class="row q-col-gutter-sm">
              <q-input filled v-model="settings.name" label="Restaurant Name" class="col-12 col-sm-6" />
              <q-input filled v-model="settings.phone" label="Contact Number" class="col-12 col-sm-6" />
            </div>

            <q-input filled v-model="settings.address" label="Address" type="textarea" autogrow />

            <div class="row q-col-gutter-sm">
              <q-input filled v-model="settings.vat" label="VAT / Tax (%)" class="col-12 col-sm-6" />
              <q-select filled v-model="settings.currency" :options="['BDT', 'USD', 'EUR']" label="Base Currency" class="col-12 col-sm-6" />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md">
            <q-btn unelevated color="primary" label="Save Settings" icon="save" @click="saveSettings" />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Shop Status -->
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section class="text-subtitle1 text-weight-bold">Operation Status</q-card-section>
          <q-list>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Store Status</q-item-label>
                <q-item-label caption>Turn on/off to accept orders</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle color="green" v-model="settings.isOpen" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { reactive } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const settings = reactive({
      name: 'My Awesome Restaurant',
      phone: '+880123456789',
      address: 'Mirpur, Dhaka, Bangladesh',
      vat: '5',
      currency: 'BDT',
      isOpen: true
    })

    const saveSettings = () => {
      $q.notify({
        color: 'positive',
        message: 'Settings updated successfully!',
        icon: 'cloud_done'
      })
    }

    return { settings, saveSettings }
  }
}
</script>
