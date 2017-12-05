<script>
import { login, state } from '../app';

export default {
  components: { },
  data: () => ({
    name: '',
    password: '',
    remember: false,
    error: null,
    redirect: null,
  }),
  methods: {
    login() {
      this.error = null;
      login(this.name, this.password, this.remember)
        .then(() => {
          if (this.redirect) {
            this.$router.push(this.redirect);
          } else {
            this.$router.push({ name: 'ap' });
          }
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
  },
  mounted() {
    if (this.$route.params.redirect) {
      this.redirect = this.$route.params.redirect;
    }

    state.user.subscribe((user) => {
      if (user !== null) {
        this.$router.push({ name: 'ap' });
      }
    });
  },
};
</script>

<template>
  <form class="login" name="loginForm" @submit.prevent="login">
    <h1 class="logo">
      <router-link :to="{ name: 'main' }" title="11:30am">11:30am</router-link>
    </h1>
    <div class="login__inputs">
      <input placeholder="Name" v-model="name" />
      <input placeholder="Password" type="password" v-model="password" />
      <button type="submit">Login</button>
    </div>
    <label for="remember">
      <input type="checkbox" v-model="remember" />
      Remember me
    </label>
    <p v-if="error">{{ error }}</p>
  </form>
</template>
