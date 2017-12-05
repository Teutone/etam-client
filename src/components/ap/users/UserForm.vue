<script>
import { state, addUser, updateUser } from '../../../app';

export default {
  props: {
    user: {
      type: Object,
      default: () => ({
        name: '',
        bio: '',
        role: 'submitter',
        hosts: [],
      }),
    },
  },
  data: () => ({
    uUser: {
      name: '',
      bio: '',
      password: '',
      role: '',
      hosts: '',
    },
    error: '',
  }),
  watch: {
    user() {
      this.onUserUpdate();
    },
  },
  subscriptions() {
    return {
      currUser: state.user,
    };
  },
  methods: {
    submit() {
      const user = {
        id: this.user.id ? this.user.id : null,
        name: this.uUser.name,
        bio: this.uUser.bio,
        password: this.uUser.password,
        role: this.uUser.role,
        hosts: this.uUser.hosts.split(/,\s*/),
      };

      if (this.user.id) {
        updateUser(user)
          .then(() => this.$emit('saved'))
          .catch((err) => {
            this.error = err.toString();
          });
      } else {
        addUser(user)
          .then(() => this.$emit('saved'))
          .catch((err) => {
            this.error = err.toString();
          });
      }
    },
    onUserUpdate() {
      this.uUser.name = `${this.user.name}`;
      this.uUser.bio = `${this.user.bio}`;
      this.uUser.role = `${this.user.role}`;
      this.uUser.hosts = this.user.hosts.join(', ');
    },
  },
  mounted() {
    console.log(this.user);
    this.onUserUpdate();
  },
};
</script>

<template>
  <form name="userForm" class="user-form user-form_inline" @submit.prevent="submit">
    <div class="user-form__fields">
      <input v-model="uUser.name" placeholder="Name" :class="{ active: uUser.name }" />
      <textarea v-model="uUser.bio" placeholder="Bio / Quote / Ode to your mother / Thank you speech / Sexual harassment apology" :class="{ active: uUser.bio }" rows="4"></textarea>
      <input v-model="uUser.password" type="password" :placeholder="'Password ' + (user.id ? '(unchanged)' : '')" min-length="12" :class="{ active: uUser.password }"/>
      <select v-model="uUser.role" v-if="currUser.role === 'admin'" class="active">
        <option>admin</option>
        <option>submitter</option>
      </select>
      <input v-model="uUser.hosts" :placeholder="currUser.hosts.join(', ')" :class="{ active: uUser.hosts }" />
    </div>
    <p v-if="error" v-html="error"></p>
    <div class="form-actions">
      <button type="submit">Save</button>
      <button @click.prevent="$emit('cancel')">Cancel</button>
    </div>
  </form>
</template>