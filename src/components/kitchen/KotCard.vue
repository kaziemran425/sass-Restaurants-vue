<template>
  <q-card flat bordered class="q-mb-md">
    <q-card-section class="bg-blue-grey-10 text-white row justify-between">
      <div class="text-subtitle1">Table: {{ table }}</div>
      <q-badge color="orange">#{{ orderId }}</q-badge>
    </q-card-section>

    <q-list dense separator>
      <q-item v-for="item in items" :key="item.name">
        <q-item-section>{{ item.name }}</q-item-section>
        <q-item-section side class="text-weight-bold">x{{ item.qty }}</q-item-section>
      </q-item>
    </q-list>

    <q-card-actions align="right">
      <q-btn flat color="positive" label="Done" icon="check" @click="$emit('done')" />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  props: ['table', 'orderId', 'items'],
  setup() {
    return {}
  }
}
</script>
