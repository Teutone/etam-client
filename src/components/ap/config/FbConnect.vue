<script>
  import { getFbAccess, getFbRedirectURL, getFbPages, setFbPage, setFbUserAccessToken } from '../../../app';

  export default {
    data: () => ({
      error: null,
      loading: true,

      pages: null,

      userId: null,
      pageName: null,
      pageId: null,
    }),
    computed: {
      view() {
        if (this.pageId && this.pageName) {
          return 'success';
        }

        if (this.error) {
          return 'error';
        }

        if (this.loading) {
          return 'loading';
        }

        return 'pages';
      },
    },
    methods: {
      tryGetAccessTokenFromURL() {
        if (this.$route.query && this.$route.query.access_token) {
          return this.$route.query.access_token;
        }

        // Get from hash data
        return (new URL(`http://a.b/?${window.location.hash.slice(1)}`)).searchParams.get('access_token');
      },
      tryGetErrorFromURL() {
        if (this.$route.query && this.$route.query.error_reason) {
          return this.$route.query.error_reason;
        }

        // Get from hash data
        return (new URL(`http://a.b/?${window.location.hash.slice(1)}`)).searchParams.get('error_reason');
      },
      getFbRedirectURL() {
        return getFbRedirectURL()
          .then((data) => {
            const redirectURL = encodeURIComponent(window.location.origin + this.$route.path);
            return `${data.url}&redirect_uri=${redirectURL}`;
          });
      },
      getPages() {
        return getFbPages()
          .then((data) => {
            this.pages = data;
          });
      },
      getAccess() {
        return getFbAccess()
          .then((data) => {
            this.userId = data.localUserId;
            this.pageName = data.pageName;
            this.pageId = data.pageId;

            if (this.pageId) {
              this.$router.push({ name: 'fb' });
            }
          });
      },
      setPage(page) {
        return setFbPage(page.id, page.name, page.accessToken)
          .then(this.getAccess);
      },
      connect() {
        this.loading = true;
        this.error = null;
        return this.getFbRedirectURL()
          .then(data => window.location.replace(data));
      },
    },
    mounted() {
      this.getAccess()
        .then(() => {
          // If we are already connected to a page, show alternatives
          if (this.userId) {
            return this.getPages();
          }

          // If we are getting something from the url, handle that
          if (this.tryGetErrorFromURL()) {
            this.error = this.tryGetErrorFromURL();
          } else if (this.tryGetAccessTokenFromURL()) {
            return setFbUserAccessToken(this.tryGetAccessTokenFromURL())
              .then(this.getPages);
          }

          // otherwise, start the facebook auth process
          return this.getFbRedirectURL()
            .then(data => window.location.replace(data));
        })
        .then(() => {
          this.loading = false;
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
  };
</script>
<template>
  <div class="fb-connect">
    <div v-if="view === 'error'" class="fb-connect__error">
      <p>Couldn't connect to facebook.</p>
      <p>{{ error }}></p>
      <button @click="connect">Try again</button>
    </div>
    <div v-if="view === 'pages'" class="fb-connect__pages">
      <h2>Choose the page to connect</h2>
      <ul class="fb-connect__page-list">
        <li class="fb-connect__page" v-for="page in pages">
          <a href="#" @click.prevent="setPage(page)">
          {{ page.name }}
          </a>
        </li>
      </ul>
    </div>
    <div v-if="view === 'loading'" class="fb-connect__loading">
      <span class="iconicstroke-spin-alt ani-spin"></span>
    </div>
    <div v-if="view === 'success'" class="fb-connect__success">
      <p>You've successfully connected to page {{ pageName }} (id: {{ pageId }})</p>
      <p><router-link :to="{ name: 'fb' }">Continue</router-link></p>
    </div>
  </div>
</template>