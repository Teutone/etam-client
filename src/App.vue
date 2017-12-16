<script>
import LnbNav from './components/LnbNav';
import Toaster from './components/Toaster';

export default {
  name: 'app',
  components: {
    LnbNav,
    Toaster,
  },
  computed: {
    isTall() {
      return this.$route.name === 'tracks' || this.$route.name === 'users' || this.$route.name === 'config';
    },
  },

  mounted() {
    setTimeout(() => document.body.classList.add('transitions-active'), 200);
  },
};
</script>

<style src="./assets/scss/global.scss" lang="scss"></style>

<template>
  <main class="app" :class="{ 'app_tall': isTall }">
    <toaster></toaster>
    <lnb-nav></lnb-nav>
    <transition enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown">
      <router-view></router-view>
    </transition>
    <svg xmlns="http://www.w3.org/2000/svg" v-show="false" version="1.1">
      <defs>
        <filter id="blur">
          <feGaussianBlur stdDeviation="5"/>
        </filter>
      </defs>
    </svg>
  </main>
</template>
