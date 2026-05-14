<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <!-- Header -->
    <q-header elevated class="bg-blue-grey-10 text-white">
      <q-toolbar>
        <!-- Back Button: কেবল যদি কাস্টমার কিউআর মেনু বা নির্দিষ্ট প্যানেলে থাকে -->
        <q-btn
          v-if="$route.path.includes('/menu/category')"
          flat
          round
          dense
          icon="arrow_back"
          @click="$router.back()"
        />

        <q-toolbar-title class="text-weight-bold">
          {{ getPageTitle }}
        </q-toolbar-title>

        <q-space />

        <!-- Status Indicator -->
        <div class="row items-center q-gutter-sm">
          <q-badge color="green" pulse v-if="!$route.path.includes('/menu')">Live</q-badge>
          <q-btn flat round dense icon="notifications" v-if="!$route.path.includes('/menu')" />
          <q-btn flat round dense icon="more_vert">
            <q-menu auto-close>
              <q-list style="min-width: 150px">
                <q-item clickable to="/">
                  <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
                  <q-item-section>Back to Admin</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="refreshPage">
                  <q-item-section avatar><q-icon name="refresh" /></q-item-section>
                  <q-item-section>Refresh Sync</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Content Container -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Mobile Navigation (Visible only for Waiter or QR Menu) -->
    <q-footer bordered class="bg-white text-primary" v-if="showFooter">
      <q-tabs
        no-caps
        active-color="primary"
        indicator-color="transparent"
        class="text-grey"
        align="justify"
      >
        <template v-if="$route.path.includes('/waiter')">
          <q-route-tab to="/waiter/place-order" icon="add_shopping_cart" label="New Order" />
          <q-route-tab to="/waiter/tables" icon="table_bar" label="Tables" />
        </template>

        <template v-else-if="$route.path.includes('/menu')">
          <q-route-tab to="/menu" icon="restaurant_menu" label="Menu" />
          <q-route-tab icon="shopping_basket" label="My Cart" />
        </template>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'MainLayout',
  setup() {
    const route = useRoute()

    // ডাইনামিক পেজ টাইটেল নির্ধারণ
    const getPageTitle = computed(() => {
      const path = route.path
      if (path.includes('/kitchen')) return 'Kitchen Display'
      if (path.includes('/waiter')) return 'Waiter Service'
      if (path.includes('/menu')) return 'Digital Menu'
      return 'SaaS Restaurant'
    })

    // ফুটার দেখানোর লজিক
    const showFooter = computed(() => {
      return route.path.includes('/waiter') || route.path.includes('/menu')
    })

    const refreshPage = () => {
      window.location.reload()
    }

    return {
      getPageTitle,
      showFooter,
      refreshPage
    }
  }
}
</script>

<style scoped>
.q-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.q-footer {
  border-top: 1px solid #ddd;
}
</style>
