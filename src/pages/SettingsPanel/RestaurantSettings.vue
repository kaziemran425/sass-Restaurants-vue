<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold text-dark">
        <q-icon name="storefront" class="q-mr-sm text-primary" /> Restaurant
        Configuration
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="settings-card shadow-1 bg-white">
          <q-card-section class="bg-grey-1 border-bottom q-pa-md">
            <div class="text-h6 text-red-13 text-weight-bold">
              General Information
            </div>
            <div class="text-caption text-grey-7">
              Update your restaurant's public details and billing info.
            </div>
          </q-card-section>

          <q-form @submit.prevent="saveSettings">
            <q-card-section class="q-gutter-md q-pt-lg">
              <q-input
                outlined
                v-model="form.name"
                label="Restaurant Name *"
                bg-color="white"
                :rules="[(val) => !!val || 'Restaurant name is required']"
              />

              <div class="row q-col-gutter-md">
                <q-input
                  outlined
                  v-model="form.email"
                  type="email"
                  label="Contact Email"
                  class="col-12 col-sm-6"
                  bg-color="white"
                />
                <q-input
                  outlined
                  v-model="form.phone"
                  type="tel"
                  label="Contact Phone"
                  class="col-12 col-sm-6"
                  bg-color="white"
                />
              </div>

              <q-input
                outlined
                v-model="form.address"
                type="textarea"
                autogrow
                label="Business Address"
                bg-color="white"
              />

              <div
                class="text-subtitle1 text-weight-bold text-dark q-mt-lg q-mb-sm"
              >
                Billing Preferences
              </div>
              <q-separator class="q-mb-md" />

              <div class="row q-col-gutter-md">
                <q-select
                  outlined
                  v-model="form.currency"
                  :options="['BDT (৳)', 'USD ($)', 'EUR (€)']"
                  label="Currency"
                  class="col-12 col-sm-6"
                  bg-color="white"
                />
                <q-input
                  outlined
                  v-model.number="form.taxRate"
                  type="number"
                  label="Default Tax / VAT Rate (%) *"
                  class="col-12 col-sm-6"
                  bg-color="white"
                  min="0"
                  step="0.1"
                  :rules="[
                    (val) =>
                      (val !== null && val >= 0) ||
                      'Valid tax rate is required',
                  ]"
                />
              </div>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md bg-grey-1 border-top">
              <q-btn
                outlined
                dense
                color="teal-13"
                type="submit"
                label="Save Changes"
                icon="save"
                :loading="isSaving"
                class="q-px-md text-weight-bold"
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card
          flat
          bordered
          class="settings-card shadow-1 bg-white text-center column items-center q-pa-lg"
        >
          <q-card-section class="full-width flex flex-center column">
            <div class="text-h6 text-weight-bold text-teal-13 q-mb-lg">
              Restaurant Logo
            </div>

            <q-avatar
              size="150px"
              class="shadow-3 q-mb-xl bg-grey-2"
              style="border: 2px solid #e0e0e0"
            >
              <img
                :src="
                  form.logoBase64 ||
                  'https://cdn.quasar.dev/logo-v2/svg/logo.svg'
                "
                style="object-fit: contain"
              />
            </q-avatar>

            <q-uploader
              style="width: 100%"
              accept="image/*"
              label="Select New Logo"
              auto-upload="false"
              hide-upload-btn
              :max-files="1"
              @added="onFileAdded"
              @removed="onFileRemoved"
              color="teal-13"
              flat
              bordered
            />

            <div class="text-caption text-grey-6 q-mt-md">
              Recommended size: 256x256px (PNG/JPG)
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import { useQuasar } from "quasar";

export default {
  setup() {
    const $q = useQuasar();
    const isSaving = ref(false);

    // Default configuration state
    const form = reactive({
      name: "RestoSaaS Demo",
      email: "contact@restosaas.com",
      phone: "+880 1700 000000",
      address: "Mirpur, Dhaka, Bangladesh",
      currency: "BDT (৳)",
      taxRate: 5,
      logoBase64: "", // Store image as base64 for localstorage persistence
    });

    // Load saved settings on mount
    onMounted(() => {
      const saved = localStorage.getItem("saas_restaurant_settings");
      if (saved) {
        Object.assign(form, JSON.parse(saved));
      }
    });

    // Handle q-uploader file add (Convert to Base64)
    const onFileAdded = (files) => {
      const file = files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        form.logoBase64 = e.target.result;
        $q.notify({
          color: "info",
          message: "Logo preview updated. Remember to save changes.",
          position: "top-right",
          icon: "visibility"
        });
      };
      reader.readAsDataURL(file);
    };

    // Handle q-uploader file removal
    const onFileRemoved = () => {
      form.logoBase64 = "";
    };

    // Save to LocalStorage
    const saveSettings = async () => {
      isSaving.value = true;
      await new Promise((res) => setTimeout(res, 600)); // Simulated API Delay

      localStorage.setItem("saas_restaurant_settings", JSON.stringify(form));

      isSaving.value = false;
      $q.notify({
        color: "positive",
        message: "Restaurant settings saved successfully!",
        icon: "check_circle",
        position: "top-right",
      });
    };

    // --- Explicit Return ---
    return {
      form,
      isSaving,
      saveSettings,
      onFileAdded,
      onFileRemoved,
    };
  },
};
</script>

<style scoped>
.settings-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.border-top {
  border-top: 1px solid #e0e0e0;
}
</style>
