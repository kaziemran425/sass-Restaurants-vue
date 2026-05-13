<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-secondary text-white">
      <q-toolbar>
        <q-toolbar-title>SBD Service Panel</q-toolbar-title>
        <q-btn flat round dense icon="refresh" @click="refreshData" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
const refreshData = () => {
  window.location.reload()
}
</script>
