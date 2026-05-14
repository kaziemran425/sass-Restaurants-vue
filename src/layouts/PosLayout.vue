<template>
  <q-layout view="hHh Lpr fFf">
    <q-header class="bg-dark text-white">
      <q-toolbar>
        <q-btn flat round icon="arrow_back" to="/" />
        <q-toolbar-title>POS Terminal</q-toolbar-title>
        <q-space />
        <q-btn flat round icon="refresh" />
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-grey-3">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  setup() { return {} }
}
</script>
