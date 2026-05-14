<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">System Users</div>
      <q-btn color="primary" icon="person_add" label="Add New User" @click="userDialog = true" />
    </div>

    <q-table
      :rows="users"
      :columns="columns"
      row-key="id"
      flat
      bordered
    >
      <template v-slot:body-cell-role="props">
        <q-td :props="props">
          <q-badge :color="getRoleColor(props.value)">
            {{ props.value }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round icon="edit" color="blue" size="sm" />
          <q-btn flat round icon="lock_reset" color="orange" size="sm">
            <q-tooltip>Reset Password</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Add User Dialog -->
    <q-dialog v-model="userDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Create System User</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-sm">
          <q-input filled v-model="newUser.username" label="Username" dense />
          <q-input filled v-model="newUser.email" label="Email" type="email" dense />
          <q-select filled v-model="newUser.role" :options="roleOptions" label="Assign Role" dense />
          <q-input filled v-model="newUser.password" label="Initial Password" type="password" dense />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn unelevated label="Create" color="primary" @click="addUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  setup() {
    const userDialog = ref(false)
    const newUser = reactive({ username: '', email: '', role: '', password: '' })

    const columns = [
      { name: 'username', label: 'Username', field: 'username', align: 'left' },
      { name: 'email', label: 'Email', field: 'email', align: 'left' },
      { name: 'role', label: 'Role', field: 'role', align: 'center' },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
    ]

    const users = ref([
      { id: 1, username: 'admin_emran', email: 'emran@sass.com', role: 'Super Admin' },
      { id: 2, username: 'waiter_01', email: 'waiter1@sass.com', role: 'Waiter' },
      { id: 3, username: 'chef_kabir', email: 'kabir@sass.com', role: 'Kitchen' }
    ])

    const roleOptions = ['Admin', 'Kitchen', 'Waiter', 'Cashier']

    const getRoleColor = (role) => {
      switch (role) {
        case 'Super Admin': return 'purple';
        case 'Kitchen': return 'orange';
        case 'Waiter': return 'blue';
        default: return 'grey-7';
      }
    }

    const addUser = () => {
      users.value.push({ id: Date.now(), ...newUser })
      userDialog.value = false
    }

    return {
      userDialog, newUser, columns, users,
      roleOptions, getRoleColor, addUser
    }
  }
}
</script>
