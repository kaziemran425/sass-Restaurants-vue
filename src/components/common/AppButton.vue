<template>
  <q-btn
    :label="label"
    :color="color"
    :icon="icon"
    :loading="loading"
    :disable="disable"
    unelevated
    rounded
    class="q-px-md"
  >
    <slot></slot>
  </q-btn>
</template>

<script>
export default {
  props: ['label', 'color', 'icon', 'loading', 'disable'],
  setup() {
    return {}
  }
}
</script>
