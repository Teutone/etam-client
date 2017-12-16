<script>
  import Broadcaster from '../broadcast';

  export default {
    data: () => ({
      iconMap: {
        success: 'iconicstroke-check',
        error: 'iconicstroke-x-alt',
      },
      messages: [],
    }),
    methods: {
      startTimeout(message) {
        this.$set(
          message,
          'timeout',
          setTimeout(() => {
            this.messages = this.messages.filter(m => m.id !== message.id);
          }, 3000),
        );
      },
      stopTimeout(message) {
        clearTimeout(message.timeout);
        this.$set(message, 'timeout', null);
      },
      toasterClass(message) {
        const res = {};
        res[`toaster_${message.type}`] = true;
        return res;
      },
      closeButtonClass(message) {
        const res = {
          toaster__close_running: !!message.timeout,
        };
        return res;
      },
      deleteMessage(index) {
        this.stopTimeout(this.messages[index]);
        this.$delete(this.messages, index);
      },
    },
    mounted() {
      Broadcaster.on('toaster', (message) => {
        const id = (+(Date.now())).toString();
        message.id = id;
        this.messages.push(message);
        this.startTimeout(message);

        if (this.messages.length > 3) {
          for (let i = this.messages.length - 4; i >= 0; i -= 1) {
            this.messages.shift();
          }
        }
      });
    },
  };
</script>
<template>
  <transition-group
    name="toaster-list"
    class="toaster__wrapper"
    tag="div"
  >
    <div
      class="toaster"
      :class="toasterClass(message)"
      v-for="(message, index) in messages"
      :key="message.id"
      @mouseenter="stopTimeout(message)"
      @mouseleave="startTimeout(message)"
    >
      <div class="toaster__message">
        <h4>{{ message.title }}</h4>
        <p v-if="message.text">{{ message.text }}</p>
      </div>
      <button
        @click="deleteMessage(index)"
        class="toaster__close"
        :class="closeButtonClass(message)"
      >
        <svg width="40" height="40">
          <circle class="outer" cx="20" cy="20" r="16" transform="rotate(-90, 20, 20)"/>
        </svg>
        <span :class="iconMap[message.type]"></span>
      </button>
    </div>
  </transition-group>
</template>
