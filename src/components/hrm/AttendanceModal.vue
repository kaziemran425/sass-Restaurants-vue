<template>
  <q-card style="min-width: 350px">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Log Attendance</div>
    </q-card-section>

    <q-card-section class="q-gutter-sm">
      <div class="text-subtitle2">Employee: {{ employeeName }}</div>
      <q-input filled v-model="inTime" label="Check In Time" mask="time" :rules="['time']">
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="inTime" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input filled v-model="outTime" label="Check Out Time" mask="time" :rules="['time']">
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="outTime" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cancel" v-close-popup />
      <q-btn color="primary" label="Update Attendance" @click="save" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { ref } from 'vue'

export default {
  props: ['employeeName'],
  setup(props, { emit }) {
    const inTime = ref('09:00')
    const outTime = ref('18:00')

    const save = () => {
      emit('save', { in: inTime.value, out: outTime.value })
    }

    return { inTime, outTime, save }
  }
}
</script>
