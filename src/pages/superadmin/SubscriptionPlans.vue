<template>
  <q-page padding>
    <div class="text-h5 q-mb-md text-weight-bold">Subscription Pricing Plans</div>

    <div class="row q-col-gutter-md">
      <div v-for="plan in plans" :key="plan.title" class="col-12 col-md-4">
        <q-card flat bordered class="text-center q-pa-lg shadow-3">
          <div class="text-h6 text-primary">{{ plan.title }}</div>
          <div class="text-h4 q-my-md">৳ {{ plan.price }}<small>/mo</small></div>

          <q-list dense class="q-mb-md">
            <q-item v-for="feature in plan.features" :key="feature">
              <q-item-section avatar><q-icon name="check" color="green" /></q-item-section>
              <q-item-section class="text-left">{{ feature }}</q-item-section>
            </q-item>
          </q-list>

          <q-btn color="primary" outline label="Edit Plan Features" class="full-width" />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const plans = ref([
      {
        title: 'Basic', price: '1000',
        features: ['Up to 1000 Invoices', '1 User Access', 'Standard Reports']
      },
      {
        title: 'Professional', price: '3000',
        features: ['Unlimited Invoices', '5 User Access', 'Inventory Management', 'HRM Access']
      },
      {
        title: 'Enterprise', price: '5000',
        features: ['Everything in Pro', 'Unlimited Users', 'Dedicated Support', 'Custom Branding']
      }
    ])

    return { plans }
  }
}
</script>
