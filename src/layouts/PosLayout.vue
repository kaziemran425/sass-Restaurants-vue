<template>
  <q-layout view="hHh Lpr fFf" class="bg-grey-1">
    <q-header elevated class="bg-dark text-white">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" to="/" />
        <q-toolbar-title>POS Terminal - SBD Express</q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-badge color="green" pulse>Live</q-badge>
          <q-btn flat round dense icon="notifications" />
          <q-btn flat round dense icon="account_circle">
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup class="text-red">
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <!-- POS প্যানেলের জন্য কোনো প্যাডিং ছাড়া ফুল স্ক্রিন ভিউ -->
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-white text-dark">
      <q-tabs
        v-model="tab"
        dense
        class="text-primary"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-route-tab name="home" icon="apps" label="Menu" to="/pos" />
        <q-route-tab name="orders" icon="list_alt" label="Orders" to="/pos/upcoming" />
        <q-route-tab name="history" icon="history" label="Invoices" to="/pos/invoices" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
const tab = ref('home')
</script>
