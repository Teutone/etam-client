<script>
  import { state } from '../../../app';
import UserForm from './UserForm';

  export default {
    props: {
      user: { type: Object, default: {} },
    },
    components: {
      UserForm,
    },
    data: () => ({
      editing: false,
    }),
    subscriptions: {
      currUser: state.user,
    },
    computed: {
      isCurrUser() {
        if (!this.currUser) {
          return false;
        }

        return this.currUser.id === this.user.id;
      },
      allowedToEdit() {
        return this.isCurrUser || this.currUser.role === 'admin';
      },
      editUser() {
        return this.isCurrUser ? this.currUser : this.user;
      },
    },
  };
</script>

<template>
  <div class="user">
    <user-form
      v-if="allowedToEdit && editing"
      @cancel="editing = false"
      @saved="editing = false"
      :user="editUser"
    ></user-form>
    <div v-else class="user__view">
      <div class="user__details">
        <h1>{{ user.name }}
          <span class="user__role" v-if="user.role">{{ user.role ? user.role : ''}}</span>
          <span class="user__hosts" v-if="user.hosts">{{ user.hosts.join(', ') }}</span>
        </h1>
        <p>{{ user.bio }}</p>
      </div>
      <div v-if="allowedToEdit" class="user__actions">
        <button @click="editing = !editing" type="button">Edit</button>
      </div>
    </div>
  </div>
</template>