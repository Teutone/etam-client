<script>
  import marked from 'marked';
  import { getFbAccess, clearFbData, state, setConfig } from '../../../app';
  import { buildMeta } from '../../../utility';
  import UserName from '../../UserName';

  export default {
    components: { UserName },
    data: () => ({
      userId: null,
      pageName: null,
      pageId: null,
      loadingFb: true,
      loadingConfig: true,
      editing: false,
      configForm: {
        informationText: '',
        defaultSocialMessage: '',
        title: {
          episode: '',
          default: '',
        },
        description: {
          episode: '',
          default: '',
        },
      },
    }),
    subscriptions() {
      state.config.subscribe((config) => {
        this.configForm.informationText = config.informationText;
        this.configForm.defaultSocialMessage = config.defaultSocialMessage;
        this.configForm.title.episode = config.title.episode;
        this.configForm.title.default = config.title.default;
        this.configForm.description.episode = config.description.episode;
        this.configForm.description.default = config.description.default;
        this.loadingConfig = false;
      });
    },
    methods: {
      marked(string) {
        return marked(string);
      },
      buildMeta(string) {
        const track = {
          title: 'An Encyclopedia',
          artist: 'Milo',
          release: 'So the Flies Don\'t Come',
          episode: 132,
        };

        return buildMeta(string, track);
      },
      setConfig() {
        this.loadingConfig = true;
        setConfig(this.configForm)
          .then(() => {
            this.editing = false;
          });
      },
      getFbAccess() {
        this.loadingFb = true;
        getFbAccess()
          .then((data) => {
            this.userId = data.localUserId;
            this.pageName = data.pageName;
            this.pageid = data.pageId;
            this.loadingFb = false;
          });
      },
      clearData() {
        this.loading = true;
        clearFbData()
          .then(this.getFbAccess);
      },
      connect() {
        this.$router.push({ name: 'fb-connect' });
      },
    },
    mounted() {
      this.getFbAccess();
    },
  };
</script>
<template>
  <div class="config" :class="{ config_editing: editing }">
    <div v-if="loadingFb" class="config__loading">
      <span class="iconicstroke-spin-alt ani-spin"></span>
    </div>
    <div class="config__fb" v-else>
      <h3>Facebook</h3>
      <p v-if="!userId">No page connected</p>
      <p v-else>Connected to page {{ pageName }}<br /><user-name :id="userId"></user-name></p>
      <div>
        <button @click="clearData" v-if="userId">Disconnect</button>
        <button @click="connect" v-else>Connect to Page</button>
      </div>
    </div>

    <div v-if="loadingConfig" class="config__loading">
      <span class="iconicstroke-spin-alt ani-spin"></span>
    </div>
    <form
      class="config__seo"
      name="seoForm"
      @submit.prevent="setConfig"
    >
      <h3>
        SEO config
        <button type="button" v-if="!editing" @click="editing = true">Edit</button>
      </h3>

      <div class="config__field">
        <div class="config__input">
          <label>Information tab text</label>
          <textarea v-model="configForm.informationText" placeholder="This is a short story about this website" rows="8"></textarea>
        </div>
        <div class="config__preview" v-html="marked(configForm.informationText)"></div>
      </div>

      <div class="config__field">
        <div class="config__input">
          <label>Default social media message</label>
          <input v-model="configForm.defaultSocialMessage" placeholder="A new episode has been uploaded!">
        </div>
        <div class="config__preview" v-html="buildMeta(configForm.defaultSocialMessage)"></div>
      </div>

      <div class="config__field">
        <div class="config__input">
          <label>Title default</label>
          <input v-model="configForm.title.default" placeholder="latenight.blue">
        </div>
        <div class="config__preview" v-html="buildMeta(configForm.title.default)"></div>
      </div>
      <div class="config__field">
        <div class="config__input">
          <label>Title for episodes</label>
          <input v-model="configForm.title.episode" placeholder="Episode $$EPISODE features $$TITLE by $$ARTIST from $$RELEASE">
        </div>
        <div class="config__preview" v-html="buildMeta(configForm.title.episode)"></div>
      </div>
      <div class="config__field">
        <div class="config__input">
          <label>Description default</label>
          <input v-model="configForm.description.default" placeholder="My cool playlist">
        </div>
        <div class="config__preview" v-html="buildMeta(configForm.description.default)"></div>
      </div>
      <div class="config__field">
        <div class="config__input">
          <label>Description for episodes</label>
          <input v-model="configForm.description.episode" placeholder="$$ARTIST - $$TITLE">
        </div>
        <div class="config__preview" v-html="buildMeta(configForm.description.episode)"></div>
      </div>
      <div class="center">
        <button type="submit" v-if="editing">Save</button>
      </div>
    </form>
  </div>
</template>