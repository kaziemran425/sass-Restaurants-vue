<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="bg-blue-grey-1">
      <q-page class="flex flex-center">
        <div class="full-width" style="max-width: 450px">
          <div class="text-center q-mb-xl">
             <q-icon name="restaurant" size="64px" color="primary" />
             <div class="text-h4 text-weight-bolder text-primary">SaaS Restaurant</div>
          </div>
          <router-view />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  setup() { return {} }
}
</script>
